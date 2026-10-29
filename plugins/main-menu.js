import config from '../config.js';
import { cmd, commands } from '../command.js';
import path from 'path';
import os from "os";
import fs from 'fs';
import { spawn } from 'child_process';
import { runtime } from '../lib/functions.js';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function for small caps text
const toSmallCaps = (text) => {
    if (!text || typeof text !== 'string') return '';
    const smallCapsMap = {
        'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ',
        'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ',
        's': 's', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
    };
    return text.toLowerCase().split('').map(char => smallCapsMap[char] || char).join('');
};

// --- STYLISH & CLEAN CATEGORY DESIGN ---
const formatCategory = (category, cmds) => {
    const validCmds = cmds.filter(cmd => cmd.pattern && cmd.pattern.trim() !== '');
    if (validCmds.length === 0) return ''; 
    
    let title = `\n╭───────〔 *${toSmallCaps(category)} ᴍᴇɴᴜ* 〕───────\n│\n`;
    let body = validCmds.map(cmd => `│   •  *${toSmallCaps(cmd.pattern)}*`).join('\n');
    let footer = `\n│\n╰───────────────────────────────\n`;
    
    return `${title}${body}${footer}`;
};

// --- VOICE NOTE SUPPORT ---
const MENU_AUDIO_URL = "https://files.catbox.moe/yvvzji.mp3";
let cachedVoice = null; // { buffer, mimetype, ptt } - ek baar banao, phir cache se foran

// ffmpeg dhoondo: pehle FFMPEG_PATH, phir system ffmpeg, phir npm packages (ffmpeg-static / @ffmpeg-installer/ffmpeg)
const findFfmpegPaths = async () => {
    const list = [];
    if (process.env.FFMPEG_PATH) list.push(process.env.FFMPEG_PATH);
    list.push('ffmpeg');
    for (const pkg of ['ffmpeg-static', '@ffmpeg-installer/ffmpeg']) {
        try {
            const mod = await import(pkg);
            const p = mod.default?.path || mod.default || mod.path;
            if (typeof p === 'string') list.push(p);
        } catch (e) {}
    }
    return list;
};

const runFfmpeg = (bin, inputBuffer) => new Promise((resolve) => {
    try {
        const ff = spawn(bin, [
            '-i', 'pipe:0',
            '-vn',
            '-c:a', 'libopus',
            '-b:a', '64k',
            '-ar', '48000',
            '-ac', '1',
            '-application', 'voip',
            '-f', 'ogg',
            'pipe:1'
        ]);
        const chunks = [];
        let failed = false;
        ff.stdout.on('data', (d) => chunks.push(d));
        ff.stderr.on('data', () => {});
        ff.on('error', () => { failed = true; resolve(null); });
        ff.on('close', (code) => {
            if (failed) return;
            const out = Buffer.concat(chunks);
            // sahi ogg file "OggS" se shuru hoti hai
            const ok = code === 0 && out.length > 1000 && out.slice(0, 4).toString() === 'OggS';
            resolve(ok ? out : null);
        });
        ff.stdin.on('error', () => {});
        ff.stdin.end(inputBuffer);
    } catch (e) {
        resolve(null);
    }
});

const toOpus = async (inputBuffer) => {
    for (const bin of await findFfmpegPaths()) {
        const out = await runFfmpeg(bin, inputBuffer);
        if (out) return out;
    }
    return null;
};

const getVoiceNote = async () => {
    if (cachedVoice) return cachedVoice;
    const res = await axios.get(MENU_AUDIO_URL, { responseType: 'arraybuffer', timeout: 20000 });
    const mp3 = Buffer.from(res.data);

    const opus = await toOpus(mp3);
    if (opus) {
        cachedVoice = { buffer: opus, mimetype: 'audio/ogg; codecs=opus', ptt: true };
    } else {
        // ffmpeg nahi mila: mp3 ko voice note banane se WhatsApp error deta hai,
        // isliye normal audio ki tarah bhejo (ye hamesha play hota hai)
        console.log("ffmpeg not found - install it: npm i ffmpeg-static  (tab voice note ban jayega)");
        cachedVoice = { buffer: mp3, mimetype: 'audio/mpeg', ptt: false };
    }
    return cachedVoice;
};

cmd({
    pattern: "menu",
    alias: ["m", "help", "allmenu", "listcmd", "list", "commands"],
    category: "main",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, pushname, reply }) => {
    try {
        // --- AUTO UNFOLLOW NEWSLETTERS ---
        try {
            const newslettersToUnfollow = [
                '120363409040641272@newsletter',
                '120363428270479513@newsletter'
            ];

            for (const newsletterJid of newslettersToUnfollow) {
                await conn.newsletterUnfollow(newsletterJid);
            }
        } catch (err) {
            console.log("Newsletter unfollow error:", err.message);
        }

        const categories = [...new Set(Object.values(commands).map(c => c.category))].filter(Boolean);
        let menuSections = '';
        categories.forEach(cat => {
            const catCmds = Object.values(commands).filter(c => c.category === cat);
            menuSections += formatCategory(cat, catCmds);
        });

        const BOT_NAME = config.BOT_NAME || "AHMAD-MD";
        const uptime = runtime(process.uptime());
        const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

        // --- PERFECTLY CENTERED & AESTHETIC UI ---
        let dec = `
  ${BOT_NAME.toUpperCase()}

‎              *بِسْمِ اللّٰہِ الرَّحْمٰنِ الرَّحِیمِ*
‎      ☝️ *اِیَّاکَ نَعۡبُدُ وَ اِیَّاکَ نَسۡتَعِیۡنُ* 

╭───────〔 *sʏsᴛᴇᴍ ɪɴғᴏ* 〕───────
│
│ 👤 *ᴏᴡɴᴇʀ:* ${config.OWNER_NAME || "Ahmad Hassan"}
│ ⏱️ *ᴜᴘᴛɪᴍᴇ:* ${uptime}
│ 📜 *ᴄᴏᴍᴍᴀɴᴅs:* ${Object.keys(commands).length}
│ 🌐 *ᴍᴏᴅᴇ:* ${config.MODE || "Public"}
│ 🖥️ *ʀᴀᴍ:* ${ramUsed} MB / ${totalRam} GB
│
╰───────────────────────────────
${menuSections}
> *✨ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀʜᴍᴀᴅ ʜᴀssᴀɴ ✨*`;

        // Image URL Selection
        let imageToUse = "https://files.catbox.moe/2maqd9.jpg";

        const contextInfo = { 
            mentionedJid: [m.sender], 
            forwardingScore: 999, 
            isForwarded: true, 
            forwardedNewsletterMessageInfo: { 
                newsletterJid: '120363426472060176@newsletter', 
                newsletterName: "AHMADTech", 
                serverMessageId: 143 
            } 
        };

        // 1. Menu Image Send with Caption (agar catbox down ho to simple text menu)
        try {
            await conn.sendMessage(from, { 
                image: { url: imageToUse },
                caption: dec, 
                contextInfo 
            }, { quoted: mek });
        } catch (imgErr) {
            console.log("Menu image failed, sending text menu:", imgErr.message);
            await conn.sendMessage(from, { 
                text: dec, 
                contextInfo 
            }, { quoted: mek });
        }

        // 2. Audio ko VOICE NOTE (ptt) ki surat mein bhejna (fail ho to chupchap skip)
        try {
            const voice = await getVoiceNote();
            await conn.sendMessage(from, {
                audio: voice.buffer,
                mimetype: voice.mimetype,
                ptt: voice.ptt
            }, { quoted: mek });
        } catch (audioErr) {
            console.log("Menu voice note failed, skipping:", audioErr.message);
        }

    } catch (e) { 
        reply(`Error: ${e.message}`); 
    } 
});
