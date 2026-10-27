import config from '../config.js';
import { cmd, commands } from '../command.js';
import path from 'path';
import os from "os";
import fs from 'fs';
import { runtime } from '../lib/functions.js';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// Song URLs - yahan naye songs add karte raho
const songs = {
    1: "https://files.catbox.moe/cs1158.opus",  // Haya Song 1 (default)
    2: "https://files.catbox.moe/tda6ds.mp3",   // Haya Song 2 (naya)
    // 3: "https://...",  // future songs yahan add karo
};

// Base patterns
const basePatterns = ["hayasong", "haya", "hsong"];

// Sab patterns generate karo: base, base1, base2, base3...
const patternLoop = [];
basePatterns.forEach((base) => {
    patternLoop.push(base);           // "hayasong"
    Object.keys(songs).forEach((num) => {
        patternLoop.push(`${base}${num}`);  // "hayasong1", "hayasong2"
    });
});

patternLoop.forEach((ptrn) => {
    cmd({
        pattern: ptrn,
        category: "haya song",
        react: "⚡",
        filename: __filename
    },
    async (conn, mek, m, { from, reply }) => {
        try {
            // Pattern se song number nikaalo
            // Example: "hayasong1" -> "1" | "hayasong" -> default 1
            let songNum = null;

            for (const base of basePatterns) {
                if (ptrn === base) {
                    songNum = 1; // default song
                    break;
                }
                if (ptrn.startsWith(base)) {
                    const suffix = ptrn.slice(base.length);
                    if (/^\d+$/.test(suffix)) {
                        songNum = parseInt(suffix);
                        break;
                    }
                }
            }

            const audioUrl = songs[songNum];

            if (!audioUrl) {
                return reply(`❌ Song ${songNum} nahi mila. Available: ${Object.keys(songs).join(", ")}`);
            }

            // Audio file bhejo (channel forwarding removed)
            await conn.sendMessage(from, {
                audio: { url: audioUrl },
                mimetype: 'audio/mpeg',
                ptt: false
            }, { quoted: mek });

        } catch (e) {
            reply(`Error: ${e.message}`);
        }
    });
});
