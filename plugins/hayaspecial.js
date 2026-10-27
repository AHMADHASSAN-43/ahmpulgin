import config from '../config.js';
import { cmd, commands } from '../command.js';
import path from 'path';
import os from "os";
import fs from 'fs';
import { runtime } from '../lib/functions.js';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// Yahan songs ki list hai - bas naya URL add karte jao
const hayaSongs = [
    "https://files.catbox.moe/cs1158.opus",   // hayasong1
    "https://files.catbox.moe/tda6ds.mp3",    // hayasong2
    // "https://files.catbox.moe/xxxxx.mp3",  // hayasong3 - aage add karna
    // "https://files.catbox.moe/xxxxx.mp3",  // hayasong4
];

// Har song ke liye alag command banayenge
hayaSongs.forEach((songUrl, index) => {
    const commandName = `hayasong${index + 1}`; // hayasong1, hayasong2, ...

    cmd({
        pattern: commandName,
        category: "haya song",
        react: "⚡",
        filename: __filename
    },
    async (conn, mek, m, { from, reply }) => {
        try {
            await conn.sendMessage(from, {
                audio: { url: songUrl },
                mimetype: 'audio/mpeg',
                ptt: false
            }, { quoted: mek });

        } catch (e) {
            reply(`Error: ${e.message}`);
        }
    });
});
