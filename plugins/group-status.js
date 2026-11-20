import { cmd } from '../command.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

cmd({
    pattern: "gcstatus",
    alias: ["gstatus", "groupstatus"],
    desc: "Send status with mentions to current group or all groups.",
    category: "group",
    react: "📡",
    filename: __filename
}, async (conn, mek, m, { from, text, reply, isCreator }) => {

    // ── Owner Check ──
    if (!isCreator) return reply("❌ This command is only for the *bot owner*!");

    try {
        const args = text?.trim().split(/\s+/) || [];
        const isAll = args[0]?.toLowerCase() === "all";
        const caption = isAll ? args.slice(1).join(" ") : text?.trim() || "";

        const quotedMsg = m.quoted;
        const mimeType = quotedMsg ? (quotedMsg.msg || quotedMsg).mimetype || "" : "";

        if (!quotedMsg && !caption) {
            return reply(
                `📡 *GC Status Usage:*\n\n` +
                `*Single GC:* \`.gcstatus Hello\`\n` +
                `*All GCs:* \`.gcstatus all Hello\`\n\n` +
                `━━━━━━━━━━━━━━━━━━\n` +
                `~ *𝐀͢ͱ꧊ϻ͒͜𝛂͜𝛛🚩*`
            );
        }

        // ── Download Media Once ──
        let mediaBuffer = null;
        if (quotedMsg) {
            mediaBuffer = await quotedMsg.download();
        }

        const getMsgType = () => {
            if (mimeType.startsWith("image/")) return "image";
            if (mimeType.startsWith("video/")) return "video";
            if (mimeType.startsWith("audio/")) return "audio";
            return null;
        };

        // ── Build message content (shared by single + all) ──
        const buildContent = (participants) => {
            const mentionedJid = (participants || []).map(p => p.id);
            const contextInfo = { mentionedJid, isGroupStatus: true };

            if (mediaBuffer) {
                const type = getMsgType();
                if (type === "image") return { image: mediaBuffer, caption, contextInfo };
                if (type === "video") return { video: mediaBuffer, caption, contextInfo };
                if (type === "audio") return {
                    audio: mediaBuffer,
                    mimetype: mimeType,
                    ptt: mimeType.includes("ogg"),
                    contextInfo
                };
            }

            // linkPreview: null => link preview generate hi nahi hoga
            // (yehi link wale status fail hone ki main wajah thi)
            return { text: caption, contextInfo, linkPreview: null };
        };

        // ── Send helper: retry once + real errors throw ──
        const sendStatus = async (jid, participants) => {
            const content = buildContent(participants);
            try {
                return await conn.sendMessage(jid, content);
            } catch (err) {
                console.error(`[gcstatus] 1st try failed for ${jid}:`, err?.message);
                await new Promise(r => setTimeout(r, 1500));
                return await conn.sendMessage(jid, content); // retry, error aaye to upar catch hoga
            }
        };

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // ── Single Group ──
        if (!isAll) {
            const groupMetadata = await conn.groupMetadata(from);
            await sendStatus(from, groupMetadata.participants);
            await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
            return reply("✅ *Status sent to this group successfully!*");
        }

        // ── All Groups (Broadcast) ──
        const allChats = await conn.groupFetchAllParticipating();
        const allGroups = Object.values(allChats);
        let successCount = 0;
        let failCount = 0;

        for (const group of allGroups) {
            try {
                await sendStatus(group.id, group.participants);
                successCount++;
            } catch (err) {
                failCount++;
                console.error(`[gcstatus] Failed for ${group.id}:`, err?.message);
            }
            // Delay to avoid spam filters
            await new Promise(r => setTimeout(r, 1000));
        }

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        return reply(
            `✅ *Broadcast Finished!*\n\n` +
            `*Sent to:* ${successCount} groups\n` +
            `*Failed:* ${failCount} groups\n` +
            `━━━━━━━━━━━━━━━━━━\n~ *𝐀͢ͱ꧊ϻ͒͜𝛂͜𝛛🚩*`
        );

    } catch (error) {
        console.error("[gcstatus] Error:", error);
        reply(`❌ *Error:* ${error.message}`);
    }
});
