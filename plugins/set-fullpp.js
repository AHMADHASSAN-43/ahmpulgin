// AHMAD Tech
import { cmd } from "../command.js";
import { fileURLToPath } from 'url';
import jimp from 'jimp'; // Agar jimp use karna chahein (ya native sharp)

const __filename = fileURLToPath(import.meta.url);

cmd({
  pattern: "fullpp",
  alias: ["setpp", "setdp", "pp", "setppbot"],
  react: "🖼️",
  desc: "Owner Only - Set bot's full profile picture",
  category: "owner",
  filename: __filename
}, async (client, message, match, { from, isCreator }) => {
  try {
    if (!isCreator) {
      return await client.sendMessage(from, {
        text: "*📛 This is an owner command.*"
      }, { quoted: message });
    }

    if (!match.quoted) {
      return await client.sendMessage(from, {
        text: "*🍁 Please reply to an image with .fullpp*"
      }, { quoted: message });
    }

    const mtype = match.quoted.mtype;
    
    if (mtype !== "imageMessage") {
      return await client.sendMessage(from, {
        text: "❌ Only image messages are supported for profile picture"
      }, { quoted: message });
    }

    const buffer = await match.quoted.download();
    const botJid = client.decodeJid ? client.decodeJid(client.user.id) : client.user.id;

    // Image ko square (Full DP ke liye) resize karne ka logic
    const processedImage = await jimp.read(buffer);
    processedImage.cover(720, 720); // WhatsApp standard profile picture size
    const squareBuffer = await processedImage.getBufferAsync(jimp.MIME_JPEG);

    await client.updateProfilePicture(botJid, squareBuffer);
    await client.sendMessage(from, {
      text: "*✅ Bot's full profile picture updated successfully!*"
    }, { quoted: message });

  } catch (error) {
    console.error("fullpp Error:", error);
    await client.sendMessage(from, {
      text: "❌ Error updating profile picture:\n" + error.message
    }, { quoted: message });
  }
});
