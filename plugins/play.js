import { cmd } from '../command.js';
import axios from 'axios';
import yts from 'yt-search';

// ====== API SETTINGS (sirf yahan badlo) ======
const API_URL = process.env.YT_API_URL || 'https://YOUR-NEW-API-URL/api/ytmp3'; // <-- naya URL yahan
const API_TOKEN = process.env.YT_API_TOKEN || 'Ahmad568868990866';
const AUTH_MODE = 'query';      // 'query' => ?apikey=TOKEN | 'header' => Authorization: Bearer TOKEN
const TOKEN_PARAM = 'apikey';   // query mode mein param ka naam (api_key / token bhi ho sakta hai)
const URL_PARAM = 'url';        // video link ka param naam
// ============================================

function pickAudioUrl(data) {
    const r = data?.result ?? data?.data ?? data;
    const candidates = [
        r?.audio_download, r?.download_url, r?.downloadUrl, r?.download,
        r?.audio, r?.url, r?.link, r?.mp3,
        data?.download_url, data?.url, data?.link
    ];
    return candidates.find(v => typeof v === 'string' && /^https?:\/\//i.test(v)) || null;
}

cmd({
    pattern: "play",
    alias: ["song", "mp3"],
    desc: "Download YouTube audio",
    category: "download",
    react: "🎶",
    filename: import.meta.url
}, async (conn, mek, m, { from, q, reply }) => {
    const react = async (emoji) => {
        try { await conn.sendMessage(from, { react: { text: emoji, key: mek.key } }); } catch (_) {}
    };

    try {
        const query = q ? q.trim() : "";
        if (!query) return reply("❌ Please provide a song name or YouTube link!");

        await react("⏳");

        let video;
        const isYT = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(query);

        if (isYT) {
            let videoId = '';
            try {
                const urlObj = new URL(query.startsWith('http') ? query : `https://${query}`);
                videoId = urlObj.hostname.includes('youtu.be')
                    ? urlObj.pathname.slice(1)
                    : urlObj.searchParams.get('v');
            } catch {
                videoId = query.split('/').pop().split('?')[0];
            }

            if (!videoId) {
                await react("❌");
                return reply("❌ Invalid YouTube link");
            }

            try {
                const search = await yts({ videoId });
                if (search?.title) {
                    video = {
                        title: search.title,
                        url: search.url,
                        thumbnail: search.thumbnail,
                        timestamp: search.timestamp,
                        views: search.views,
                        author: search.author
                    };
                }
            } catch (_) {}

            if (!video) {
                video = {
                    title: 'Unknown Title',
                    url: `https://www.youtube.com/watch?v=${videoId}`,
                    thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                    timestamp: 'N/A',
                    views: 0,
                    author: { name: 'Unknown' }
                };
            }
        } else {
            const search = await yts(query);
            if (!search.videos.length) {
                await react("❌");
                return reply("❌ No song results found");
            }
            video = search.videos[0];
        }

        const infoCaption =
`🎵 *${video.title}*\n\n` +
`🎥 *Channel:* ${video.author?.name || 'Unknown'}\n` +
`👁️ *Views:* ${(video.views || 0).toLocaleString()}\n` +
`⏳ *Duration:* ${video.timestamp || 'N/A'}\n\n` +
`> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀʜᴍᴀᴅ-ᴍᴅ ⚡*`;

        try {
            await conn.sendMessage(from, {
                image: { url: video.thumbnail },
                caption: infoCaption
            }, { quoted: mek });
        } catch (_) {}

        // ---- API call with token ----
        const params = { [URL_PARAM]: video.url };
        const headers = {};
        if (AUTH_MODE === 'header') {
            headers['Authorization'] = `Bearer ${API_TOKEN}`;
            headers['x-api-key'] = API_TOKEN;
        } else {
            params[TOKEN_PARAM] = API_TOKEN;
        }

        let data;
        let httpStatus;
        try {
            const apiRes = await axios.get(API_URL, {
                params,
                headers,
                timeout: 45000,
                validateStatus: () => true
            });
            data = apiRes.data;
            httpStatus = apiRes.status;
        } catch (apiErr) {
            await react("❌");
            return reply(`❌ API error: ${apiErr?.message || apiErr}`);
        }

        // ---- Response check ----
        console.log('[play] API status:', httpStatus, 'response:', JSON.stringify(data)?.slice(0, 500));

        if (httpStatus === 401 || httpStatus === 403) {
            await react("❌");
            return reply("❌ API token invalid ya expire hai.");
        }

        const audioUrl = pickAudioUrl(data);
        if (!audioUrl) {
            await react("❌");
            return reply(`❌ ${data?.message || data?.error || 'Server se audio link nahi mila.'}`);
        }

        const title = (data?.result?.title || data?.title || video.title || 'YouTube Song').toString();

        let sent = false;
        let lastSendError = null;

        try {
            const file = await axios.get(audioUrl, {
                responseType: 'arraybuffer',
                timeout: 90000,
                maxContentLength: 50 * 1024 * 1024,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': '*/*'
                }
            });
            const buffer = Buffer.from(file.data);
            if (buffer.length > 1000) {
                await conn.sendMessage(from, {
                    audio: buffer,
                    mimetype: 'audio/mpeg',
                    fileName: `${title}.mp3`
                }, { quoted: mek });
                sent = true;
            }
        } catch (e) {
            lastSendError = e?.message || String(e);
        }

        if (!sent) {
            try {
                await conn.sendMessage(from, {
                    audio: { url: audioUrl },
                    mimetype: 'audio/mpeg',
                    fileName: `${title}.mp3`
                }, { quoted: mek });
                sent = true;
            } catch (e) {
                lastSendError = e?.message || String(e);
            }
        }

        if (!sent) {
            await react("❌");
            return reply(`❌ Audio send failed: ${lastSendError || 'unknown'}`);
        }

        await react("✅");

    } catch (e) {
        console.error('Play Command Error:', e);
        await react("❌");
        reply(`❌ Error: ${e?.message || 'Unexpected error'}`);
    }
});
