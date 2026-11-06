import { cmd } from '../command.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "chstatus",
    alias: ["channelstatus", "chs"],
    desc: "Post a Channel Status (story ring) on your WhatsApp channel.",
    category: "channel",
    react: "📢",
    filename: __filename
}, async (conn, mek, m, { from, text, reply, isCreator }) => {

    if (!isCreator) return reply("❌ This command is only for the *bot owner*!");

    try {
        // Elaina fork check
        if (typeof conn.sendNewsletterStatus !== "function") {
            return reply("❌ Is Baileys mein *Channel Status* support nahi hai.\n`@rexxhayanasi/elaina-baileys` use karo.");
        }

        const args = text?.trim().split(/\s+/).filter(Boolean) || [];
        const target = args[0] || "";
        const isLink = target.includes("whatsapp.com/channel/");
        const isJid = target.endsWith("@newsletter");

        if (!isLink && !isJid) {
            return reply(
                `📢 *Channel Status Usage:*\n\n` +
                `*Text:* \`.chstatus <channel link> Hello\`\n` +
                `*Media:* image/video ko reply karke\n` +
                `\`.chstatus <channel link> caption\`\n\n` +
                `_Aap channel ke admin/owner hone chahiye._\n` +
                `━━━━━━━━━━━━━━━━━━\n~ *𝐀͢ͱ꧊ϻ͒͜𝛂͜𝛛🚩*`
            );
        }

        const caption = args.slice(1).join(" ");
        const quotedMsg = m.quoted;
        const mimeType = quotedMsg ? (quotedMsg.msg || quotedMsg).mimetype || "" : "";

        if (!quotedMsg && !caption) {
            return reply("❌ Text likho ya image/video ko reply karo!");
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // Channel JID
        let channelJid = target;
        let channelName = "";
        if (isLink) {
            const code = target.split("whatsapp.com/channel/")[1].split(/[/?]/)[0];
            const meta = await conn.newsletterMetadata("invite", code);
            channelJid = meta.id;
            channelName = meta.name || meta.thread_metadata?.name?.text || "";
        }

        // Permission check
        if (typeof conn.newsletterCanPostStatus === "function") {
            const can = await conn.newsletterCanPostStatus(channelJid);
            if (can === false) {
                return reply("❌ Aap is channel par status post nahi kar sakte (admin/owner nahi ho).");
            }
        }

        // Content
        let content = {};
        if (quotedMsg) {
            const buffer = await quotedMsg.download();
            if (mimeType.startsWith("image/")) content = { image: buffer, caption };
            else if (mimeType.startsWith("video/")) content = { video: buffer, caption };
            else return reply("❌ Sirf image ya video support hai!");
        } else {
            content = { text: caption };
        }

        await conn.sendNewsletterStatus(channelJid, content);

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        return reply(
            `✅ *Channel Status post ho gaya!*\n\n` +
            `*Channel:* ${channelName || channelJid}\n` +
            `━━━━━━━━━━━━━━━━━━\n~ *𝐀͢ͱ꧊ϻ͒͜𝛂͜𝛛🚩*`
        );

    } catch (error) {
        reply(`❌ *Error:* ${error.message}`);
    }
});
