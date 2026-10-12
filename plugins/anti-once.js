import { cmd } from "../command.js";
import config from "../config.js";
import { fileURLToPath } from "url";
import { downloadContentFromMessage } from "@whiskeysockets/baileys";

const __filename = fileURLToPath(import.meta.url);

// Wrapper hatao (ephemeral / viewOnce)
const unwrap = (m) => {
  let cur = m;
  for (let i = 0; i < 5; i++) {
    const next =
      cur?.ephemeralMessage?.message ||
      cur?.viewOnceMessageV2?.message ||
      cur?.viewOnceMessageV2Extension?.message ||
      cur?.viewOnceMessage?.message ||
      cur?.documentWithCaptionMessage?.message;
    if (!next) break;
    cur = next;
  }
  return cur;
};

// Quoted view-once message nikalo aur download karo
async function getViewOnce(message) {
  const root = unwrap(message.message) || {};
  const type = Object.keys(root)[0];
  const ctx = root[type]?.contextInfo || message.msg?.contextInfo;

  const inner = unwrap(ctx?.quotedMessage);
  if (!inner) return null;

  const mtype = ["imageMessage", "videoMessage", "audioMessage"].find((t) => inner[t]);
  if (!mtype) return { unsupported: true };

  const media = inner[mtype];
  const stream = await downloadContentFromMessage(media, mtype.replace("Message", ""));
  let buffer = Buffer.from([]);
  for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

  return { buffer, mtype, media, caption: media.caption || "" };
}

function buildContent(q, DESCRIPTION) {
  const { buffer, mtype, media, caption } = q;
  const cap = caption ? `${caption}\n\n> ${DESCRIPTION}` : `> ${DESCRIPTION}`;

  switch (mtype) {
    case "imageMessage":
      return { image: buffer, caption: cap, mimetype: media.mimetype || "image/jpeg" };
    case "videoMessage":
      return { video: buffer, caption: cap, mimetype: media.mimetype || "video/mp4" };
    case "audioMessage":
      return { audio: buffer, mimetype: "audio/mp4", ptt: media.ptt || false };
  }
}

async function handleVV(client, message, { from, isCreator, userConfig }, { silent, toDM }) {
  try {
    if (!isCreator) {
      if (silent) return;
      return await client.sendMessage(from, {
        text: "*📛 This is an owner command.*"
      }, { quoted: message });
    }

    const q = await getViewOnce(message);

    if (!q) {
      return await client.sendMessage(from, {
        text: "*🍁 Please reply to a view once message!*"
      }, { quoted: message });
    }

    if (q.unsupported) {
      return await client.sendMessage(from, {
        text: "❌ Only image, video, and audio messages are supported"
      }, { quoted: message });
    }

    const DESCRIPTION = userConfig?.DESCRIPTION || config.DESCRIPTION;
    const content = buildContent(q, DESCRIPTION);

    const target = toDM ? (message.sender || message.key?.participant || from) : from;
    await client.sendMessage(target, content, { quoted: message });
  } catch (error) {
    console.error("vv Error:", error);
    await client.sendMessage(from, {
      text: "❌ Error fetching vv message:\n" + error.message
    }, { quoted: message });
  }
}

cmd({
  pattern: "vv",
  alias: ["viewonce", "retrive"],
  react: "🐳",
  desc: "Owner Only - retrieve quoted message back to user",
  category: "owner",
  filename: __filename
}, async (client, message, match, extra) => {
  await handleVV(client, message, extra, { silent: false, toDM: false });
});

cmd({
  pattern: "vv2",
  alias: ["wah", "ohh", "oho", "nice", "ok",
    "🙂", "😂", "❤️", "💋", "😒",
    "👍", "😩", "🥵", "🌚", "🌝"],
  desc: "Owner Only - retrieve quoted message to your DM",
  category: "owner",
  filename: __filename
}, async (client, message, match, extra) => {
  await handleVV(client, message, extra, { silent: true, toDM: true });
});
