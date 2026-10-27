// plugins/kdp.js
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import { Jimp } from 'jimp';

const S_WHATSAPP_NET = '@s.whatsapp.net';
const __filename = fileURLToPath(import.meta.url);

function normalizePK(input) {
    let n = input.replace(/[^0-9]/g, '');
    if (n.startsWith('0092')) n = n.slice(2);
    else if (n.startsWith('92')) { }
    else if (n.startsWith('0')) n = '92' + n.slice(1);
    else if (n.length === 10 && n.startsWith('3')) n = '92' + n;
    return n;
}

cmd({
    pattern: "kdp",
    react: "🖼️",
    desc: "Owner Only - Number ki DP bot ki DP banao (original aspect ratio)",
    category: "owner",
    filename: __filename
}, async (client, message, m, { from, isCreator, q, args }) => {
    try {
        if (!isCreator) {
            return await client.sendMessage(from, { text: "*📛 This is an owner command.*" }, { quoted: message });
        }

        const input = (q || (args || []).join(' ') || '').trim();
        const number = normalizePK(input);

        if (number.length < 10) {
            return await client.sendMessage(from, { text: "*🍁 Use:* *.kdp 923001234567*" }, { quoted: message });
        }

        // 1. Number ki DP download karo
        let url;
        try {
            url = await client.profilePictureUrl(number + S_WHATSAPP_NET, 'image');
        } catch {
            return await client.sendMessage(from, {
                text: "*❌ DP nahi mili (hidden hai, number galat hai, ya WhatsApp par nahi hai).*"
            }, { quoted: message });
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error("DP download failed: " + res.status);
        const buffer = Buffer.from(await res.arrayBuffer());

        // 2. Same logic as fullpp
        const jimp = await Jimp.read(buffer);
        const w = jimp.width;
        const h = jimp.height;
        jimp.crop({ x: 0, y: 0, w, h });
        jimp.scaleToFit({ w: 720, h: 720 });
        const img = await jimp.getBuffer('image/jpeg', { quality: 80 });

        // 3. Send IQ
        await client.query({
            tag: 'iq',
            attrs: { target: undefined, to: S_WHATSAPP_NET, type: 'set', xmlns: 'w:profile:picture' },
            content: [{ tag: 'picture', attrs: { type: 'image' }, content: img }]
        });

        await client.sendMessage(from, { text: "*✅ Bot's profile picture updated successfully!*" }, { quoted: message });
    } catch (error) {
        console.error("kdp Error:", error);
        await client.sendMessage(from, { text: "❌ Error updating profile picture:\n" + error.message }, { quoted: message });
    }
});
