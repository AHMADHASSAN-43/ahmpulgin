import { fileURLToPath } from 'url';
import config from '../config.js';
import { cmd } from '../command.js';
import axios from 'axios';
import AdmZip from 'adm-zip';
import { getBuffer } from "../lib/functions.js";
import { videoToWebp } from '../lib/video-utils.js';
import { Sticker, StickerTypes } from "wa-sticker-formatter";

const __filename = fileURLToPath(import.meta.url);

// Token ko code me mat rakho — config ya env se lo
const BOT_TOKEN = config.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const PACK_NAME = "𝘼𝙃𝙈𝘼𝘿🚩";
const BATCH_SIZE = 5;

async function convertSticker(s) {
    const ext = s.file_path.split('.').pop().toLowerCase();
    const buf = await getBuffer(s.image_url);
    if (!buf || !buf.length) throw new Error('Empty buffer');

    // Static webp: seedha use karo
    if (ext === 'webp' && !s.is_animated && !s.is_video) {
        return { buffer: buf, ext: 'webp' };
    }

    // Video (webm) sticker: webp me convert
    if (ext === 'webm' || s.is_video) {
        const webp = await videoToWebp(buf);
        if (!webp || !webp.length) throw new Error('Empty WebP');
        const out = await new Sticker(webp, {
            pack: PACK_NAME,
            type: StickerTypes.FULL,
            quality: 75,
            background: 'transparent',
        }).toBuffer();
        return { buffer: out, ext: 'webp' };
    }

    // .tgs (Lottie) wagera: original file as-is
    return { buffer: buf, ext };
}

cmd({
    pattern: "tticker",
    alias: ["teg", "tegs", "tegstick", "tlegramsticker"],
    react: "🛡️",
    desc: "Download Telegram sticker pack (single ZIP)",
    category: "download",
    use: ".tsticker <telegram_sticker_url>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, isCreator }) => {
    try {
        if (!isCreator) return await reply("📛 This is an owner command.");
        if (!BOT_TOKEN) return await reply("❌ Telegram bot token configure nahi hai.");
        if (!q) return await reply("❌ Please provide a Telegram sticker pack URL!\nExample: .tsticker https://t.me/addstickers/packname");

        if (!q.includes('t.me/addstickers/') && !q.includes('telegram.me/addstickers/')) {
            return await reply("❌ Please provide a valid Telegram sticker pack URL!");
        }

        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });
        await reply("📦 Downloading sticker pack... Please wait!");

        let packName = q.trim()
            .replace(/^https?:\/\/(t|telegram)\.me\/addstickers\//, "")
            .split('?')[0].trim();
        if (!packName) return await reply("❌ Invalid sticker pack URL!");

        const { data } = await axios.get(
            `https://api.telegram.org/bot${BOT_TOKEN}/getStickerSet?name=${encodeURIComponent(packName)}`,
            { timeout: 30000, headers: { Accept: "application/json", "User-Agent": "Mozilla/5.0" } }
        );

        if (!data?.ok) return await reply(`❌ Failed to fetch sticker pack: ${data?.description || 'Invalid response'}`);

        const stickerSet = data.result;
        if (!stickerSet?.stickers?.length) return await reply("❌ No stickers found in this pack!");

        // File paths nikalo
        const stickers = [];
        for (const st of stickerSet.stickers) {
            try {
                const fr = await axios.get(
                    `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${st.file_id}`
                );
                if (fr.data.ok && fr.data.result.file_path) {
                    const filePath = fr.data.result.file_path;
                    stickers.push({
                        is_animated: st.is_animated || false,
                        is_video: st.is_video || false,
                        file_path: filePath,
                        image_url: `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`
                    });
                }
            } catch (e) {
                console.error('[TSTICK] getFile error:', e.message);
            }
        }

        if (!stickers.length) return await reply("❌ No stickers could be processed!");

        await reply(
            `📦 *Sticker Pack Info*\n\n` +
            `*Name:* ${stickerSet.name || 'N/A'}\n` +
            `*Title:* ${stickerSet.title || 'N/A'}\n` +
            `*Stickers:* ${stickers.length}\n\n` +
            `⏳ Processing...`
        );

        // Batches me parallel convert karke ZIP me daalo
        const zip = new AdmZip();
        let success = 0, failed = 0;

        for (let i = 0; i < stickers.length; i += BATCH_SIZE) {
            const batch = stickers.slice(i, i + BATCH_SIZE);
            const results = await Promise.allSettled(batch.map(convertSticker));

            results.forEach((r, j) => {
                const num = String(i + j + 1).padStart(3, '0');
                if (r.status === 'fulfilled') {
                    zip.addFile(`sticker_${num}.${r.value.ext}`, r.value.buffer);
                    success++;
                } else {
                    console.error(`[TSTICK] Sticker ${num} failed:`, r.reason?.message);
                    failed++;
                }
            });
        }

        if (success === 0) return await reply("❌ Koi sticker convert nahi ho saka!");

        const safeName = (stickerSet.title || stickerSet.name || 'stickers').replace(/[^\w\-]+/g, '_');

        // Ek hi baar me pura pack
        await conn.sendMessage(from, {
            document: zip.toBuffer(),
            fileName: `${safeName}.zip`,
            mimetype: 'application/zip',
            caption: `✅ *${stickerSet.title || stickerSet.name}*\n📦 ${success}/${stickers.length} stickers` +
                     (failed ? `\n⚠️ ${failed} failed` : '')
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (error) {
        console.error('[TSTICK] Command Error:', error?.message || error);
        let errorMsg = "❌ Download failed: ";
        if (error.response?.status === 404) errorMsg += "Sticker pack not found. Please check the URL.";
        else if (error.response?.status === 401) errorMsg += "Invalid bot token.";
        else if (error.code === 'ECONNABORTED') errorMsg += "Connection timeout. Please try again later.";
        else errorMsg += error?.message || 'Unknown error';
        await reply(errorMsg);
    }
});
