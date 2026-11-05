import { fileURLToPath } from 'url';
import config from '../config.js';
import { cmd, commands } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

// --- PING COMMAND (SIMPLE & FAST) ---
cmd({
    pattern: "ping",
    alias: ["speed", "pong"],
    use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        // --- AUTO UNFOLLOW NEWSLETTER ---
        try {
            await conn.newsletterUnfollow('120363420834510109@newsletter');
            await conn.newsletterUnfollow('120363410744696505@newsletter');
        } catch (err) {
            console.log("Newsletter unfollow error:", err.message);
        }

        const start = Date.now();

        await conn.sendMessage(from, {
            react: { text: "⚡", key: mek.key }
        });

        const latency = Date.now() - start;

        // Simple & Clean Style
        const text = `⚡ *Speed:* \`${latency} ms\` | *Status:* \`Online 🟢\``;

        await conn.sendMessage(from, {
            text,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363426472060176@newsletter',
                    newsletterName: "AHMAD-MD TECH",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`⚠️ Error: ${e.message}`);
    }
});

// --- PING2 COMMAND (SIMPLE DIALOGUE STYLE) ---
cmd({
    pattern: "ping2",
    desc: "Check bot's response time simple view.",
    category: "main",
    react: "🚀",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // --- AUTO UNFOLLOW NEWSLETTER ---
        try {
            await conn.newsletterUnfollow('120363420834510109@newsletter');
            await conn.newsletterUnfollow('120363410744696505@newsletter');
        } catch (err) {
            console.log("Newsletter unfollow error:", err.message);
        }

        const start = Date.now();
        await conn.sendMessage(from, { react: { text: "🚀", key: mek.key } });
        const latency = Date.now() - start;

        // Simple Dialogue Style
        const msg = `🚀 *Bot Response Speed:* \`${latency} ms\``;

        await conn.sendMessage(from, { 
            text: msg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363426472060176@newsletter',
                    newsletterName: "AHMAD-MD TECH",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`⚠️ Error: ${e.message}`);
    }
});
