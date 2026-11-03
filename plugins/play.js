import { cmd } from '../command.js';
import axios from 'axios';
import yts from 'yt-search';

// ---------- Search helpers ----------

const tokenize = (s = '') =>
    s.toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .split(/\s+/)
        .filter(Boolean);

const BAD_WORDS = ['live', 'cover', 'remix', 'reaction', 'slowed', 'reverb', 'sped', 'nightcore', 'karaoke', '8d', 'instrumental', 'shorts', 'status'];
const GOOD_WORDS = ['official', 'audio', 'lyrical', 'lyrics', 'song'];

function extractVideoId(input) {
    const m = input.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/i);
    return m ? m[1] : null;
}

function scoreVideo(video, qTokens, index) {
    const titleTokens = tokenize(video.title);
    const authorTokens = tokenize(video.author?.name || '');
    const qSet = new Set(qTokens);

    let score = 0;

    // How many query words appear in the title / channel
    let titleHits = 0;
    let authorHits = 0;
    for (const t of qTokens) {
        if (titleTokens.includes(t)) titleHits++;
        else if (authorTokens.includes(t)) authorHits++;
    }
    score += (titleHits / qTokens.length) * 10;
    score += (authorHits / qTokens.length) * 4;

    // Penalise unwanted versions unless user asked for them
    for (const w of BAD_WORDS) {
        if (titleTokens.includes(w) && !qSet.has(w)) score -= 5;
    }

    // Small bonus for official / audio versions
    for (const w of GOOD_WORDS) {
        if (titleTokens.includes(w)) score += 0.7;
    }

    // Duration: avoid live (0 sec) and very long videos
    const secs = video.seconds || 0;
    if (secs === 0) score -= 20;
    else if (secs > 1800) score -= 8;
    else if (secs > 900) score -= 3;
    else if (secs < 45) score -= 4;

    // Popularity bonus (small)
    score += Math.log10((video.views || 0) + 1) * 0.3;

    // Keep YouTube's own relevance order as a light tie-breaker
    score -= index * 0.15;

    return score;
}

function pickBestVideo(videos, query) {
    const qTokens = tokenize(query);
    if (!qTokens.length) return videos[0];

    const candidates = videos.slice(0, 10);
    let best = candidates[0];
    let bestScore = -Infinity;

    candidates.forEach((v, i) => {
        const s = scoreVideo(v, qTokens, i);
        if (s > bestScore) {
            bestScore = s;
            best = v;
        }
    });
    return best;
}

async function getVideoById(videoId) {
    // Exact lookup by id (much more accurate than text search)
    try {
        const v = await yts({ videoId });
        if (v && v.title) {
            return {
                title: v.title,
                url: v.url || `https://www.youtube.com/watch?v=${videoId}`,
                thumbnail: v.thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                timestamp: v.timestamp || 'N/A',
                views: v.views || 0,
                author: v.author || { name: 'Unknown' }
            };
        }
    } catch (_) {}

    return {
        title: 'Unknown Title',
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        timestamp: 'N/A',
        views: 0,
        author: { name: 'Unknown' }
    };
}

// ---------- Command ----------

cmd({
    pattern: "play",
    alias: ["song", "mp3"],
    desc: "Download YouTube audio via Adeel-Xtech API",
    category: "download",
    react: "🎶",
    filename: import.meta.url
}, async (conn, mek, m, { from, q, reply }) => {
    const react = async (emoji) => {
        try { await conn.sendMessage(from, { react: { text: emoji, key: mek.key } }); } catch (_) {}
    };

    try {
        const query = q ? q.trim() : "";

        if (!query) {
            return reply("❌ Please provide a song name or YouTube link!");
        }

        await react("⏳");

        let video;
        const isYT = /^(https?:\/\/)?(www\.|m\.|music\.)?(youtube\.com|youtu\.be)\//i.test(query);

        if (isYT) {
            const videoId = extractVideoId(query);
            if (!videoId) {
                await react("❌");
                return reply("❌ Invalid YouTube link");
            }
            video = await getVideoById(videoId);
        } else {
            const search = await yts(query);
            const videos = (search?.videos || []).filter(v => v && v.url);
            if (!videos.length) {
                await react("❌");
                return reply("❌ No song results found");
            }
            video = pickBestVideo(videos, query);
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

        let data;
        try {
            const apiRes = await axios.get('https://adeel-xtech-api.vercel.app/api/ytmp3', {
                params: { url: video.url },
                timeout: 45000,
                validateStatus: () => true
            });
            data = apiRes.data;
        } catch (apiErr) {
            await react("❌");
            return reply(`❌ API error: ${apiErr?.message || apiErr}`);
        }

        if (!data?.status || !data?.result?.audio_download) {
            await react("❌");
            return reply(`❌ ${data?.message || 'Failed to fetch audio from server.'}`);
        }

        const res = data.result;
        const title = (res.title || video.title || 'YouTube Song').toString();
        const audioUrl = res.audio_download;

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
        const msg = e?.message || e?.toString?.() || 'Unexpected error';
        console.error('Play Command Error:', e);
        await react("❌");
        reply(`❌ Error: ${msg}`);
    }
});
