import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);

// ====== CONFIG (no lib) ======
const WebUrl = 'https://ahmad-md.vercel.app/api';
const Key = 'drahmad823';

// ====== HELPERS ======
function getCountStatus(count) {
    if (count === 50) return '🔴';
    if (count >= 40) return '🟣';
    if (count >= 30) return '🟡';
    if (count >= 20) return '🟠';
    if (count >= 10) return '🔵';
    return '🟢';
}

function isValidChannelPostUrl(url) {
    const pattern = /^https?:\/\/(?:www\.)?whatsapp\.com\/channel\/[a-zA-Z0-9]+\/\d+$/;
    return pattern.test(url);
}

function extractIdsFromUrl(url) {
    const match = url.match(/\/channel\/([a-zA-Z0-9]+)\/(\d+)/);
    if (match) {
        return { channelId: match[1], postId: match[2] };
    }
    return null;
}

function parseEmojis(input) {
    const emojis = [];
    const parts = input.split(',').map(p => p.trim()).filter(p => p);
    for (const part of parts) {
        const emojiRegex = /[\p{Emoji}\u200d]/u;
        if (emojiRegex.test(part)) emojis.push(part);
    }
    return emojis;
}

function validateEmojis(emojis) {
    if (!emojis || emojis.length === 0) {
        return {
            valid: false,
            error: '❌ *No valid emojis found!*\n*Example:* .chreact https://whatsapp.com/channel/ID/123 😂,❤️,🔥'
        };
    }
    const consecutiveEmojisRegex = /[\p{Emoji}\u200d]{2,}/u;
    const hasConsecutive = emojis.some(e => consecutiveEmojisRegex.test(e));
    if (hasConsecutive) {
        return {
            valid: false,
            error: '❌ *Invalid format! Please separate all emojis with commas*\n*Example:* .chreact link 😂,❤️,🔥,👏,😮'
        };
    }
    return { valid: true, emojis };
}

// ==================== CHREACT ====================
cmd({
    pattern: "chreact",
    alias: ["channelreact", "react", "rp"],
    react: "🎯",
    desc: "React to WhatsApp channel post",
    category: "group",
    use: ".chreact <channel_post_url> [emojis]",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        if (!args[0]) {
            return reply(`❌ *Please provide a channel post URL!*

*Example:* 
.chreact https://whatsapp.com/channel/0029VbD059NBadmT79uGx41n/609

*With custom emojis:*
.chreact https://whatsapp.com/channel/0029VbD059NBadmT79uGx41n/609 ❤️,🫠,🥰
`);
        }

        const url = args[0];

        if (!isValidChannelPostUrl(url)) {
            return reply(`❌ *Invalid URL!*

*Valid format:* 
https://whatsapp.com/channel/CHANNEL_ID/POST_ID
`);
        }

        const ids = extractIdsFromUrl(url);
        if (!ids) return reply(`❌ *Failed to extract channel/post IDs from URL!*`);

        let emojis = [];
        let emojisString = '';

        if (args.length > 1) {
            const remaining = args.slice(1).join(' ');
            emojis = parseEmojis(remaining);
            emojisString = emojis.join(',');
        }

        if (!emojisString) {
            emojis = ['❤️', '🫠', '👻'];
            emojisString = emojis.join(',');
        }

        const validation = validateEmojis(emojis);
        if (!validation.valid) return reply(validation.error);

        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        const serversResponse = await axios.get(`${WebUrl}/servers`, { timeout: 10000 });

        if (!serversResponse.data || !serversResponse.data.servers) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ *Failed to fetch server list!*");
        }

        const servers = serversResponse.data.servers;
        if (servers.length === 0) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ *No servers found!*");
        }

        await reply(`✅ *Reactions sent successfully!*

📊 *Details:*
🎯 *Channel:* ${ids.channelId}
📝 *Post:* ${ids.postId}
😊 *Emojis:* ${validation.emojis.join(' ')}
🌐 *Servers:* ${servers.length}

> *Powered By 𝐀͢ͱ꧊ϻ͒͜𝛂͜𝛛🚩*`);

        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

        for (const server of servers) {
            const reactUrl = `${server.url}/chreact?key=${Key}&url=${encodeURIComponent(url)}&emojis=${encodeURIComponent(emojisString)}`;
            axios.get(reactUrl, { timeout: 5000 }).catch(() => {});
        }

    } catch (error) {
        console.error("React post error:", error);
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
        await reply(`❌ *Error processing request!*\n\n*Error:* ${error.message}`);
    }
});

// ==================== STATUS ====================
cmd({
    pattern: "status",
    alias: ["serverstatus", "stats", "servers"],
    react: "📊",
    desc: "Check server status and active users",
    category: "owner",
    use: ".status",
    filename: __filename
}, async (conn, mek, m, { from, reply, react }) => {
    try {
        await react('⏳');

        const serversResponse = await axios.get(`${WebUrl}/servers`, { timeout: 10000 });

        if (!serversResponse.data || !serversResponse.data.servers) {
            await react('❌');
            return reply("❌ Failed to fetch server list.");
        }

        const servers = serversResponse.data.servers;
        const serverStatus = [];
        let totalActive = 0, totalLimit = 0, onlineServers = 0, offlineServers = 0;

        for (const server of servers) {
            try {
                const statusResponse = await axios.get(`${server.url}/active`, { timeout: 8000 });

                if (statusResponse.data && !statusResponse.data.error) {
                    const count = statusResponse.data.count || 0;
                    const limit = statusResponse.data.limit || 50;
                    const statusEmoji = getCountStatus(count);

                    serverStatus.push({
                        name: server.name,
                        count, limit,
                        status: `${statusEmoji} ONLINE`
                    });

                    totalActive += count;
                    totalLimit += limit;
                    onlineServers++;
                } else {
                    serverStatus.push({ name: server.name, count: 0, limit: 50, status: '🟡 NO DATA' });
                    offlineServers++;
                }
            } catch {
                serverStatus.push({ name: server.name, count: 0, limit: 50, status: '🔴 OFFLINE' });
                offlineServers++;
            }
        }

        await react('✅');

        let msg = `╭──「 *SERVER STATUS* 」\n│\n`;
        msg += `│ *📊 Overview*\n`;
        msg += `│ Total: ${servers.length}\n`;
        msg += `│ Online: ${onlineServers} | Offline: ${offlineServers}\n`;
        msg += `│ Active: ${totalActive}/${totalLimit}\n`;
        msg += `│\n│━━━━━━━━━━━━━━━━━━━━\n`;

        for (const s of serverStatus) {
            const [icon, text] = s.status.split(' ');
            msg += `│ ${s.name.padEnd(8)}: ${s.count.toString().padStart(2)}/${s.limit} ${icon} ${text}\n`;
        }

        msg += `╰─────────────────`;
        await reply(msg);

    } catch (error) {
        console.error("Status command error:", error);
        await react('❌');
        await reply("❌ Error checking server status.");
    }
});
