import { cmd } from '../command.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "chstatus",
    alias: ["channelstatus", "chpost"],
    desc: "Post status/update to your WhatsApp channel.",
    category: "channel",
    react: "📢",
    filename: __filename
}, async (conn, mek, m, { from, text, reply, isCreator }) => {

    // ── Owner Check ──
    if (!isCreator) return reply("❌ This command is only for the *bot owner*!");

    try {
        const args = text?.trim().split(/\s+/).filter(Boolean) || [];
        const target = args[0] || "";

        const isLink = target.includes("whatsapp.com/channel/");
        const isJid = target.endsWith("@newsletter");

        if (!isLink && !isJid) {
            return reply(
                `📢 *Channel Status Usage:*\n\n` +
                `*Text:* \`.chstatus <channel link> Hello\`\n` +
                `*Media:* Reply to image/video/audio with\n` +
                `\`.chstatus <channel link> caption\`\n\n` +
                `_Note: Aap us channel ke *admin/owner* hone chahiye._\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `~ *𝐀͢ͱ꧊ϻ͒͜𝛂͜𝛛🚩*`
            );
        }

        const caption = args.slice(1).join(" ");
        const quotedMsg = m.quoted;
        const mimeType = quotedMsg ? (quotedMsg.msg || quotedMsg).mimetype || "" : "";

        if (!quotedMsg && !caption) {
            return reply("❌ Text likho ya kisi image/video/audio ko reply karo!");
        }

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // ── Channel JID nikalo ──
        let channelJid = target;
        let channelName = "";
        if (isLink) {
            const code = target.split("whatsapp.com/channel/")[1].split(/[/?]/)[0];
            const meta = await conn.newsletterMetadata("invite", code);
            channelJid = meta.id;
            channelName = meta.name || meta.thread_metadata?.name?.text || "";
        }

        // ── Message banao ──
        let content = {};
        if (quotedMsg) {
            const buffer = await quotedMsg.download();
            if (mimeType.startsWith("image/")) content = { image: buffer, caption };
            else if (mimeType.startsWith("video/")) content = { video: buffer, caption };
            else if (mimeType.startsWith("audio/")) content = { audio: buffer, mimetype: "audio/mpeg", ptt: false };
            else return reply("❌ Sirf image, video ya audio support hai!");
        } else {
            content = { text: caption };
        }

        await conn.sendMessage(channelJid, content);

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        return reply(
            `✅ *Channel par post ho gaya!*\n\n` +
            `*Channel:* ${channelName || channelJid}\n` +
            `━━━━━━━━━━━━━━━━━━\n~ *𝐀͢ͱ꧊ϻ͒͜𝛂͜𝛛🚩*`
        );

    } catch (error) {
        reply(`❌ *Error:* ${error.message}`);
    }
});
