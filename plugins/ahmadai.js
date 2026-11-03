import { cmd } from '../command.js';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const API_URL = 'https://adeel-xtech-api.onrender.com/api/gptv2';
const TIMEOUT = 15000;
const API_TOKEN = 'Ahmad568868990866';

async function askAI(q, reply, usage) {
    if (!q) return reply(usage);
    try {
        const res = await axios.get(API_URL, {
            params: { q },
            headers: { 'x-api-token': API_TOKEN },
            timeout: TIMEOUT
        });
        if (res.data && res.data.status && res.data.result) {
            return reply(String(res.data.result));
        }
        return reply('❌ API Error.');
    } catch (e) {
        if (e.code === 'ECONNABORTED' || e.message?.includes('timeout')) {
            return reply('❌ Request timeout.');
        }
        return reply('❌ Failed to connect to API.');
    }
}

// ============================================================
// ===== AHMED AI - NO PREFIX HANDLER (on: body) =====
// Bina prefix bhi kaam karega: "ahmed hello"
// ============================================================
cmd({
    'on': "body"
}, async (conn, mek, m, { body, reply, config }) => {
    try {
        if (!body) return;

        const text = body.trim();

        // Prefix wale messages skip karo
        const usedPrefix = (config && config.PREFIX) ? config.PREFIX : '.';
        if (text.startsWith(usedPrefix) || text.startsWith('.') || 
            text.startsWith('!') || text.startsWith('#') || text.startsWith('/')) {
            return;
        }

        const lower = text.toLowerCase();

        // ===== 1. AHMED =====
        if (lower.startsWith("ahmed ")) {
            const q = text.slice(6).trim();
            if (!q) return reply("❌ *Usage:* ahmed Your question");
            return await askAI(
                "You are Ahmed AI, a smart and helpful assistant. Answer clearly and friendly: " + q,
                reply, "❌ *Usage:* ahmed Your question"
            );
        }
        if (lower === "ahmed") return reply("❌ *Usage:* ahmed Your question");

        // ===== 2. AHMEDPRO =====
        if (lower.startsWith("ahmedpro ")) {
            const q = text.slice(9).trim();
            if (!q) return reply("❌ *Usage:* ahmedpro Your question");
            return await askAI(
                "You are Ahmed Pro AI, an advanced expert assistant with deep knowledge. Give detailed, professional answers: " + q,
                reply, "❌ *Usage:* ahmedpro Your question"
            );
        }
        if (lower === "ahmedpro") return reply("❌ *Usage:* ahmedpro Your question");

        // ===== 3. AHMEDGPT =====
        if (lower.startsWith("ahmedgpt ")) {
            const q = text.slice(9).trim();
            if (!q) return reply("❌ *Usage:* ahmedgpt Your question");
            return await askAI(
                "You are Ahmed GPT, a creative and intelligent AI assistant. Answer with clarity and creativity: " + q,
                reply, "❌ *Usage:* ahmedgpt Your question"
            );
        }
        if (lower === "ahmedgpt") return reply("❌ *Usage:* ahmedgpt Your question");

        // ===== 4. AHMEDAI =====
        if (lower.startsWith("ahmedai ")) {
            const q = text.slice(8).trim();
            if (!q) return reply("❌ *Usage:* ahmedai Your question");
            return await askAI(
                "You are Ahmed AI Assistant, a friendly and helpful bot. Answer in a warm, engaging way: " + q,
                reply, "❌ *Usage:* ahmedai Your question"
            );
        }
        if (lower === "ahmedai") return reply("❌ *Usage:* ahmedai Your question");

        // ===== 5. AHMEDX =====
        if (lower.startsWith("ahmedx ")) {
            const q = text.slice(7).trim();
            if (!q) return reply("❌ *Usage:* ahmedx Your question");
            return await askAI(
                "You are Ahmed X, a next-generation AI with cutting-edge knowledge. Answer smartly and concisely: " + q,
                reply, "❌ *Usage:* ahmedx Your question"
            );
        }
        if (lower === "ahmedx") return reply("❌ *Usage:* ahmedx Your question");

    } catch (error) {
        console.error("Ahmed AI no-prefix error:", error);
    }
});

// ============================================================
// ===== AHMED AI 1: .ahmed =====
// Smart & Helpful Assistant
// ============================================================
cmd({
    pattern: "ahmed",
    desc: "Chat with Ahmed AI - Smart & Helpful",
    category: "ahmed-ai",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { q, reply }) => {
    const prompt = q ? ("You are Ahmed AI, a smart and helpful assistant. Answer clearly and friendly: " + q) : q;
    await askAI(prompt, reply, "❌ *Usage:* .ahmed Your question");
});

// ============================================================
// ===== AHMED AI 2: .ahmedpro =====
// Advanced Expert Assistant
// ============================================================
cmd({
    pattern: "ahmadpro",
    desc: "Chat with Ahmed Pro AI - Advanced Expert",
    category: "ahmed-ai",
    react: "🚀",
    filename: __filename
}, async (conn, mek, m, { q, reply }) => {
    const prompt = q ? ("You are Ahmed Pro AI, an advanced expert assistant with deep knowledge. Give detailed, professional answers: " + q) : q;
    await askAI(prompt, reply, "❌ *Usage:* .ahmedpro Your question");
});

// ============================================================
// ===== AHMED AI 3: .ahmedgpt =====
// Creative & Intelligent AI
// ============================================================
cmd({
    pattern: "ahmadgpt",
    desc: "Chat with Ahmed GPT - Creative & Intelligent",
    category: "ahmed-ai",
    react: "🧠",
    filename: __filename
}, async (conn, mek, m, { q, reply }) => {
    const prompt = q ? ("You are Ahmed GPT, a creative and intelligent AI assistant. Answer with clarity and creativity: " + q) : q;
    await askAI(prompt, reply, "❌ *Usage:* .ahmedgpt Your question");
});

// ============================================================
// ===== AHMED AI 4: .ahmedai =====
// Friendly & Warm Assistant
// ============================================================
cmd({
    pattern: "ahmadai",
    desc: "Chat with Ahmed AI Assistant - Friendly & Warm",
    category: "ahmed-ai",
    react: "💬",
    filename: __filename
}, async (conn, mek, m, { q, reply }) => {
    const prompt = q ? ("You are Ahmed AI Assistant, a friendly and helpful bot. Answer in a warm, engaging way: " + q) : q;
    await askAI(prompt, reply, "❌ *Usage:* .ahmedai Your question");
});

// ============================================================
// ===== AHMED AI 5: .ahmedx =====
// Next-Gen Cutting-Edge AI
// ============================================================
cmd({
    pattern: "ahmadx",
    desc: "Chat with Ahmed X - Next-Gen AI",
    category: "ahmed-ai",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { q, reply }) => {
    const prompt = q ? ("You are Ahmed X, a next-generation AI with cutting-edge knowledge. Answer smartly and concisely: " + q) : q;
    await askAI(prompt, reply, "❌ *Usage:* .ahmedx Your question");
});
