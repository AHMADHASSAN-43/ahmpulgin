import { cmd } from '../command.js';
import axios from 'axios';
import yts from 'yt-search';

// 🔑 API Config (Adeel-Xtech API with token)
const API_BASE = 'https://adeel-xtech-api.onrender.com/api/ytmp3';
const API_TOKEN = 'Ahmad568868990866';

cmd({
    pattern: "play",
    alias: ["song", "mp3"],
    desc: "Download YouTube audio via Adeel-Xtech API",
    category: "download",
    react: "🎶",
    filename: import.meta.url
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        const query = q ? q.trim() : "";

        if (!query) {
            return reply("❌ Please provide a song name or YouTube link!");
        }

        try {
            await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        } catch (_) {}

        let video;
        const isYT = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(query);

        if (isYT) {
            let videoId = '';
            try {
                const urlObj = new URL(query);
                if (urlObj.hostname === 'youtu.be') {
                    videoId = urlObj.pathname.slice(1);
                } else {
                    videoId = urlObj.searchParams.get('v');
                }
            } catch {
                videoId = query.split('/').pop().split('?')[0];
            }

            if (!videoId) {
                try { await conn.sendMessage(from, { react: { text: "❌", key: mek.key } }); } catch (_) {}
                return reply("❌ Invalid YouTube link");
            }

            try {
                const search = await yts(videoId);
                if (search && search.videos && search.videos.length) {
                    video = search.videos[0];
                }
            } catch (e) {}

            if (!video) {
                try {
                    const search2 = await yts(`https://www.youtube.com/watch?v=${videoId}`);
                    if (search2 && search2.videos && search2.videos.length) {
                        video = search2.videos[0];
                    }
                } catch (e) {}
            }

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
                try { await conn.sendMessage(from, { react: { text: "❌", key: mek.key } }); } catch (_) {}
                return reply("❌ No song results found");
            }
            video = search.videos[0];
        }

        const infoCaption =
`╭━━━〔 🎧 𝗔𝗨𝗗𝗜𝗢 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 🎧 〕━━━╮
│
│ 🎵 *Title*    : ${video.title}
│ ⏱️ *Duration* : ${video.timestamp || 'N/A'}
│ 👀 *Views*    : ${(video.views || 0).toLocaleString()}
│ 📺 *Channel*  : ${video.author?.name || 'Unknown'}
│ 📥 *Status*   : Downloading... ⏳
│
╰━━━━━━━━━━━━━━━━━━━━━━━━╯

💖 ᴘᴏᴡᴇʀᴇᴅ ʙʏ AHMAD-MD ⚡`;

        try {
            await conn.sendMessage(from, {
                image: { url: video.thumbnail },
                caption: infoCaption
            }, { quoted: mek });
        } catch (_) {}

        let data;
        try {
            // 🔥 New API with token
            const apiRes = await axios.get(API_BASE, {
                params: {
                    url: video.url,
                    token: API_TOKEN
                },
                timeout: 60000,
                validateStatus: () => true,
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                }
            });
            data = apiRes.data;

            // Log agar API error de
            if (apiRes.status !== 200) {
                console.error('API Status:', apiRes.status, 'Response:', data);
            }
        } catch (apiErr) {
            try { await conn.sendMessage(from, { react: { text: "❌", key: mek.key } }); } catch (_) {}
            return reply(`❌ API error: ${apiErr?.message || apiErr}`);
        }

        // 🔍 Multiple response formats support
        if (!data?.status || !data?.result?.audio_download) {
            // Alternative response check
            const altUrl = data?.result?.audio || data?.result?.url || data?.audio_download || data?.url;
            if (!altUrl) {
                try { await conn.sendMessage(from, { react: { text: "❌", key: mek.key } }); } catch (_) {}
                return reply(`❌ ${data?.message || 'Failed to fetch audio from server.'}`);
            }
            data.result = data.result || {};
            data.result.audio_download = altUrl;
        }

        const res = data.result;
        const title = (res.title || video.title || 'YouTube Song').toString();
        const audioUrl = res.audio_download;

        let sent = false;
        let lastSendError = null;

        // Try buffer first
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

        // Fallback: direct URL
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
            try { await conn.sendMessage(from, { react: { text: "❌", key: mek.key } }); } catch (_) {}
            return reply(`❌ Audio send failed: ${lastSendError || 'unknown'}`);
        }

        try {
            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        } catch (_) {}

    } catch (e) {
        const msg = e?.message || e?.toString?.() || 'Unexpected error';
        console.error('Play Command Error:', e);
        try { await conn.sendMessage(from, { react: { text: "❌", key: mek.key } }); } catch (_) {}
        reply(`❌ Error: ${msg}`);
    }
});
