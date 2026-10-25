
import { fileURLToPath } from 'url';
import { cmd } from '../command.js';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const API_URL = 'https://adeel-xtech-api.vercel.app/api/gptv2';
const TIMEOUT = 15000;

async function askAI(q, reply, usage) {
    if (!q) return reply(usage);
    try {
        const res = await axios.get(API_URL, {
            params: { q },
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

// Helper
function reg(pattern, desc, react) {
    cmd({
        pattern,
        desc,
        category: "ai",
        react,
        filename: __filename
    }, async (conn, mek, m, { q, reply }) => {
        await askAI(q, reply, `❌ *Usage:* .${pattern} Your question`);
    });
}

// ========== ORIGINAL 72 ==========
reg("copilot", "Microsoft Copilot AI", "✨");
reg("chatgptelite", "ChatGPT Elite AI", "🧠");
reg("talkai", "Talk AI", "💬");
reg("brain", "Brain AI", "🧠");
reg("elite", "Elite AI Assistant", "👑");
reg("mscopilot", "Microsoft Copilot", "💙");
reg("elitegpt", "Elite ChatGPT", "🤖");
reg("assistant", "AI Assistant", "🤵");
reg("smart", "Smart AI", "🧠");
reg("genius", "Genius AI", "🌟");
reg("proai", "Pro AI", "⚡");
reg("elitecopilot", "Elite Copilot", "🎯");
reg("ultra", "Ultra AI", "🔥");
reg("maxai", "Max AI", "💪");
reg("nova", "Nova AI", "⭐");
reg("zenith", "Zenith AI", "✨");
reg("apex", "Apex AI", "🏆");
reg("vertex", "Vertex AI", "🔷");
reg("pulse", "Pulse AI", "💓");
reg("quantum", "Quantum AI", "⚛️");
reg("neo", "Neo AI", "💚");
reg("omega", "Omega AI", "🔱");
reg("gpt", "GPT-3.5 AI", "🤖");
reg("gpt4", "GPT-4 AI", "🤖");
reg("gpt4o", "GPT-4o AI", "🤖");
reg("chatgpt", "ChatGPT AI", "🤖");
reg("claude", "Claude AI", "🤖");
reg("gemini", "Google Gemini AI", "🤖");
reg("kimi", "Kimi AI", "🤖");
reg("perplexity", "Perplexity AI", "🤖");
reg("llama2", "Llama 2 AI", "🤖");
reg("llama3", "Llama 3 AI", "🤖");
reg("mistral", "Mistral AI", "🤖");
reg("mixtral", "Mixtral AI", "🤖");
reg("falcon", "Falcon AI", "🤖");
reg("bloom", "BLOOM AI", "🤖");
reg("orca", "Orca AI", "🤖");
reg("vicuna", "Vicuna AI", "🤖");
reg("alpaca", "Alpaca AI", "🤖");
reg("phi2", "Phi-2 AI", "🤖");
reg("wizard", "Wizard AI", "🤖");
reg("codet5", "CodeT5 AI", "🤖");
reg("starlin", "Starlin AI", "🤖");
reg("deepseek", "DeepSeek AI", "🤖");
reg("deepseekcoder", "DeepSeek Coder AI", "🤖");
reg("yi", "Yi AI", "🤖");
reg("yi34b", "Yi-34B AI", "🤖");
reg("qwen", "Qwen AI", "🤖");
reg("command", "Command AI", "🤖");
reg("jurassic", "Jurassic AI", "🤖");
reg("ai21", "AI21 Labs AI", "🤖");
reg("solar", "Solar AI", "🤖");
reg("lumin", "Lumin AI", "🤖");
reg("grokbeta", "Grok Beta AI", "🤖");
reg("bard", "Google Bard AI", "🤖");
reg("redpajama", "RedPajama AI", "🤖");
reg("dolly", "Dolly AI", "🤖");
reg("codex", "Codex AI", "🤖");
reg("hugging", "HuggingChat AI", "🤖");
reg("openassist", "OpenAssistant AI", "🤖");
reg("gptneo", "GPT-Neo AI", "🤖");
reg("gptj", "GPT-J AI", "🤖");
reg("bloomz", "BLOOMZ AI", "🤖");
reg("flant5", "FLAN-T5 AI", "🤖");
reg("codegen", "CodeGen AI", "🤖");
reg("starcoder", "StarCoder AI", "🤖");
reg("gpt3", "GPT-3 AI", "🤖");
reg("chatgptplus", "ChatGPT Plus AI", "🤖");
reg("gpt4turbo", "GPT-4 Turbo AI", "🤖");
reg("claudeinstant", "Claude Instant AI", "🤖");
reg("claude2", "Claude 2 AI", "🤖");
reg("palm2", "PaLM 2 AI", "🤖");

// ========== NEW 40 (Total = 112) ==========
reg("replit", "Replit AI", "🟠");
reg("replitai", "Replit AI Assistant", "🟠");
reg("repl", "Repl AI", "🟠");
reg("geminipro", "Gemini Pro AI", "💎");
reg("geminiultra", "Gemini Ultra AI", "💎");
reg("geminai", "Geminai AI", "💎");
reg("deepseekv3", "DeepSeek V3 AI", "🐋");
reg("deepseekchat", "DeepSeek Chat AI", "🐋");
reg("deepseekr1", "DeepSeek R1 AI", "🐋");
reg("ds", "DeepSeek AI", "🐋");
reg("ma", "MA AI", "🤖");
reg("ahmad", "AHMAD AI", "👨‍💻");
reg("ahmed", "AHMED AI", "👨‍💻");
reg("ahmadai", "AHMAD AI Assistant", "👨‍💻");
reg("ahmadgpt", "AHMAD GPT", "👨‍💻");
reg("grok", "Grok AI", "🚀");
reg("grok2", "Grok 2 AI", "🚀");
reg("grok3", "Grok 3 AI", "🚀");
reg("xai", "xAI", "🚀");
reg("metaai", "Meta AI", "🔵");
reg("llama", "Llama AI", "🦙");
reg("llama4", "Llama 4 AI", "🦙");
reg("claude3", "Claude 3 AI", "🎭");
reg("claude35", "Claude 3.5 AI", "🎭");
reg("claudeopus", "Claude Opus AI", "🎭");
reg("claudesonnet", "Claude Sonnet AI", "🎭");
reg("claudehaiku", "Claude Haiku AI", "🎭");
reg("o1", "OpenAI o1", "🧪");
reg("o1mini", "OpenAI o1-mini", "🧪");
reg("o3", "OpenAI o3", "🧪");
reg("qwen2", "Qwen 2 AI", "🐉");
reg("qwen25", "Qwen 2.5 AI", "🐉");
reg("qwenmax", "Qwen Max AI", "🐉");
reg("moonshot", "Moonshot AI", "🌙");
reg("kimi2", "Kimi 2 AI", "🌙");
reg("glm", "GLM AI", "🧬");
reg("glm4", "GLM-4 AI", "🧬");
reg("ernie", "ERNIE Bot AI", "🐻");
reg("ernie4", "ERNIE 4 AI", "🐻");
reg("doubao", "Doubao AI", "🫘");

// ========== SPECIAL BEHAVIOR ==========
cmd({
    pattern: "mathgpt",
    desc: "Solve math problems with MathGPT",
    category: "ai",
    react: "🧮",
    filename: __filename
}, async (conn, mek, m, { q, reply }) => {
    const prompt = q ? ("Solve this math problem and explain clearly: " + q) : q;
    await askAI(prompt, reply, "❌ *Usage:* .mathgpt Your math problem");
});

cmd({
    pattern: "grammar",
    desc: "Check grammar and spelling",
    category: "ai",
    react: "📝",
    filename: __filename
}, async (conn, mek, m, { q, reply }) => {
    const prompt = q ? ("Check grammar and spelling, then give corrected text: " + q) : q;
    await askAI(prompt, reply, "❌ *Usage:* .grammar Your text to check");
});

cmd({
    pattern: "translate",
    desc: "Translate text using AI",
    category: "ai",
    react: "🌍",
    filename: __filename
}, async (conn, mek, m, { q, reply }) => {
    const prompt = q ? ("Translate the following text to English (or detect language and translate): " + q) : q;
    await askAI(prompt, reply, "❌ *Usage:* .translate Your text");
});

cmd({
    pattern: "code",
    desc: "Generate or fix code with AI",
    category: "ai",
    react: "💻",
    filename: __filename
}, async (conn, mek, m, { q, reply }) => {
    const prompt = q ? ("Write or fix the following code with explanation: " + q) : q;
    await askAI(prompt, reply, "❌ *Usage:* .code Your code request");
});

cmd({
    pattern: "explain",
    desc: "Explain a concept using AI",
    category: "ai",
    react: "📚",
    filename: __filename
}, async (conn, mek, m, { q, reply }) => {
    const prompt = q ? ("Explain this clearly with examples: " + q) : q;
    await askAI(prompt, reply, "❌ *Usage:* .explain Topic");
});

cmd({
    pattern: "summarize",
    desc: "Summarize text using AI",
    category: "ai",
    react: "📋",
    filename: __filename
}, async (conn, mek, m, { q, reply }) => {
    const prompt = q ? ("Summarize this text briefly: " + q) : q;
    await askAI(prompt, reply, "❌ *Usage:* .summarize Your text");
});

cmd({
    pattern: "story",
    desc: "Generate a story with AI",
    category: "ai",
    react: "📖",
    filename: __filename
}, async (conn, mek, m, { q, reply }) => {
    const prompt = q ? ("Write a short creative story about: " + q) : q;
    await askAI(prompt, reply, "❌ *Usage:* .story Topic");
});
