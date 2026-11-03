import { cmd } from '../command.js';
import axios from 'axios';
import yts from 'yt-search';

// 🔑 API Config (Adeel-Xtech API with token)
const API_BASE = 'https://adeel-xtech-api.onrender.com/api/ytmp3';
const API_TOKEN = 'Ahmad568868990866';

// 🎯 Exact match helpers
const BAD_WORDS = ['remix','cover','slowed','reverb','lofi','lo-fi','karaoke','8d','nightcore','sped up','speed up','instrumental','live','mashup','reaction','tutorial','status','shorts'];

const norm = s => (s || '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();

function pickBest(videos, query) {
    const nq = norm(query);
    const qWords = nq.split(' ').filter(Boolean);
    if (!qWords.length) return videos[0];
    let best = null, bestScore = -Infinity;

    videos.slice(0, 10).forEach((v, i) => {
        const title = norm(v.title);
        const text = title + ' ' + norm(v.author?.name);
        let score = (qWords.filter(w => text.includes(w)).length / qWords.length) * 100;
        if (title.includes(nq)) score += 50;
        for (const b of BAD_WORDS) {
            if (title.includes(b) && !nq.includes(b)) score -= 40;
        }
        const sec = v.seconds || 0;
        if (sec > 900 || sec < 60) score -= 30;
        if (/topic|official|vevo/.test(norm(v.author?.name))) score += 5;
        score -= i * 2;
        if (score > bestScore) { bestScore = score; best = v; }
    });
    return best || videos[0];
}

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
                const urlObj = new URL(query.startsWith('http') ? query : 'https://' + query);
                if (urlObj.hostname === 'youtu.be') {
                    videoId = urlObj.pathname.slice(1);
                } else if (urlObj.pathname.startsWith('/shorts/')) {
                    videoId = urlObj.pathname.split('/')[2];
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
                const info = await yts({ videoId }); // exact video
                if (info && info.title) video = info;
            } catch (e) {}

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
            video = pickBest(search.videos, query);
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

            if (apiRes.status !== 200) {
                console.error('API Status:', apiRes.status, 'Response:', data);
            }
        } catch (apiErr) {
            try { await conn.sendMessage(from, { react: { text: "❌", key: mek.key } }); } catch (_) {}
            return reply(`❌ API error: ${apiErr?.message || apiErr}`);
        }

        // 🔍 Multiple response formats support
        if (!data?.status || !data?.result?.audio_download) {
            const altUrl = data?.result?.audio || data?.result?.url || data?.audio_download || data?.url;
            if (!altUrl) {
                try { await conn.sendMessage(from, { react: { text: "❌", key: mek.key } }); } catch (_) {}
                return reply(`❌ ${data?.message || 'Failed to fetch audio from server.'}`);
            }
            data = data || {};
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
