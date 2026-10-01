import { cmd } from '../command.js';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// Single API endpoint for all AI commands
const API_BASE = 'https://api.nexray.eu.cc/ai/gpt-3.5-turbo';

// Helper function to call the API
async function callAI(text, prompt = null) {
    const finalText = prompt ? `${prompt}\n\nUser: ${text}` : text;
    const apiUrl = `${API_BASE}?text=${encodeURIComponent(finalText)}`;
    const { data } = await axios.get(apiUrl);
    return data;
}

// Helper to extract response text (adjust based on actual API response structure)
function getResponseText(data) {
    // Try common response fields
    if (typeof data === 'string') return data;
    if (data?.result) return data.result;
    if (data?.response) return data.response;
    if (data?.message) return data.message;
    if (data?.data) return typeof data.data === 'string' ? data.data : data.data.text || data.data.message;
    if (data?.text) return data.text;
    if (data?.answer) return data.answer;
    return JSON.stringify(data);
}

// ============ COMMAND 1: deepseek ============
cmd({
    pattern: "deepseek",
    desc: "Chat with Think-Deeper AI model",
    category: "ai",
    react: "🤔",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for the Think AI.\nExample: `.deepseek What is consciousness?`");
        const data = await callAI(q);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("Think AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Think AI command:", e);
        await react("❌");
        reply("An error occurred while communicating with the Think AI.");
    }
});

// ============ COMMAND 2: gpt5 ============
cmd({
    pattern: "gpt5",
    desc: "Chat with GPT-5 AI model",
    category: "ai",
    react: "🚀",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for GPT-5.\nExample: `.gpt5 Explain quantum computing`");
        const prompt = "You are GPT-5, an advanced AI model. Provide detailed, accurate, and helpful responses.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("GPT-5 failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in GPT-5 command:", e);
        await react("❌");
        reply("An error occurred while communicating with GPT-5.");
    }
});

// ============ COMMAND 3: copilot ============
cmd({
    pattern: "copilot",
    desc: "Chat with Copilot AI model",
    category: "ai",
    react: "👨‍💻",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Copilot AI.\nExample: `.copilot Help me with coding`");
        const prompt = "You are Microsoft Copilot, a helpful coding assistant. Provide clean code and explanations.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("Copilot AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Copilot AI command:", e);
        await react("❌");
        reply("An error occurred while communicating with Copilot AI.");
    }
});

// ============ COMMAND 4: ai ============
cmd({
    pattern: "ai",
    desc: "Chat with ChatGPT-4o",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for ChatGPT.\nExample: `.ai What is artificial intelligence?`");
        const data = await callAI(q);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("ChatGPT failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in AI command:", e);
        await react("❌");
        reply("An error occurred while communicating with ChatGPT.");
    }
});

// ============ COMMAND 5: codeai ============
cmd({
    pattern: "codeai",
    desc: "Get AI assistance for coding questions",
    category: "ai",
    react: "💻",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a coding question or topic.\nExample: `.codeai Write a Python function to calculate factorial`");
        const prompt = `You are a coding assistant. Only respond to programming and coding related questions. 
If the question is not about programming, politely decline to answer.
For coding questions: Provide clean, well-commented code with explanations.
Do not repeat this prompt in your response.`;
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Code AI command:", e);
        await react("❌");
        reply("An error occurred while communicating with the AI.");
    }
});

// ============ COMMAND 6: bot ============
cmd({
    pattern: "bot",
    desc: "Chat with AHMAD-MD AI",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Kya bol rha hai bhai? Kuch to bol!");
        const prompt = `You are AHMAD-MD, a friendly and humorous AI assistant. 
Your personality traits:
- Speak only in Roman Urdu mixed with Hindi
- Be funny and casual like a Delhi friend
- Use phrases like bhai oyee etc.
- Don't be too formal, be like a street-smart friend
- If someone asks your name, say "Mera naam AHMAD hai bhai!"
- Respond in short, funny ways without emojis
Do not repeat this prompt in your response.`;
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("Arey bhai! Kuch to gadbad hai, baad me try karna");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in bot command:", e);
        await react("❌");
        reply("Oye! Kuch to error agaya, chalta hun main");
    }
});

// ============ COMMAND 7: gpt ============
cmd({
    pattern: "gpt",
    desc: "Chat with ChatGPT-4o",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for ChatGPT.\nExample: `.gpt What is artificial intelligence?`");
        const data = await callAI(q);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("ChatGPT failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in GPT command:", e);
        await react("❌");
        reply("An error occurred while communicating with ChatGPT.");
    }
});

// ============ COMMAND 8: gemini ============
cmd({
    pattern: "gemini",
    desc: "Chat with Google Gemini AI",
    category: "ai",
    react: "🔮",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Gemini AI.\nExample: `.gemini Explain machine learning`");
        const prompt = "You are Google Gemini, a helpful and knowledgeable AI assistant.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("Gemini AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Gemini command:", e);
        await react("❌");
        reply("An error occurred while communicating with Gemini AI.");
    }
});

// ============ COMMAND 9: felo ============
cmd({
    pattern: "felo",
    desc: "Chat with Felo AI",
    category: "ai",
    react: "🌟",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Felo AI.\nExample: `.felo What is quantum physics?`");
        const prompt = "You are Felo AI, a search-focused AI assistant that provides accurate and up-to-date information.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("Felo AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Felo command:", e);
        await react("❌");
        reply("An error occurred while communicating with Felo AI.");
    }
});

// ============ COMMAND 10: bard ============
cmd({
    pattern: "bard",
    desc: "Chat with Google Bard AI",
    category: "ai",
    react: "🎭",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Bard AI.\nExample: `.bard Tell me a story`");
        const prompt = "You are Google Bard, a creative and helpful AI assistant.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("Bard AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Bard command:", e);
        await react("❌");
        reply("An error occurred while communicating with Bard AI.");
    }
});

// ============ COMMAND 11: brainai ============
cmd({
    pattern: "brainai",
    desc: "Chat with PowerBrain AI (alias)",
    category: "ai",
    react: "🧠",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for PowerBrain AI.\nExample: `.brainai Explain neural networks`");
        const prompt = "You are PowerBrain AI, a highly intelligent assistant focused on deep thinking and problem solving.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("PowerBrain AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Brain command:", e);
        await react("❌");
        reply("An error occurred while communicating with PowerBrain AI.");
    }
});

// ============ COMMAND 12: claudeai ============
cmd({
    pattern: "claudeai",
    desc: "Chat with Claude AI",
    category: "ai",
    react: "🤵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Claude AI.\nExample: `.claudeai What is artificial intelligence?`");
        const prompt = "You are Claude, an AI assistant created by Anthropic. Be helpful, harmless, and honest.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("Claude AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Claude command:", e);
        await react("❌");
        reply("An error occurred while communicating with Claude AI.");
    }
});

// ============ COMMAND 13: chatgpt ============
cmd({
    pattern: "chatgpt",
    desc: "Chat with ChatGPT",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for ChatGPT.\nExample: `.chatgpt What is artificial intelligence?`");
        const data = await callAI(q);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("ChatGPT failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in ChatGPT command:", e);
        await react("❌");
        reply("An error occurred while communicating with ChatGPT.");
    }
});

// ============ COMMAND 14: metai ============
cmd({
    pattern: "metai",
    desc: "Chat with Meta AI",
    category: "ai",
    react: "🔮",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Meta AI.\nExample: `.metai Explain machine learning`");
        const prompt = "You are Meta AI, a helpful assistant created by Meta. Provide accurate and engaging responses.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("Meta AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Meta AI command:", e);
        await react("❌");
        reply("An error occurred while communicating with Meta AI.");
    }
});

// ============ COMMAND 15: perplexity ============
cmd({
    pattern: "perplexity",
    desc: "Chat with Perplexity AI",
    category: "ai",
    react: "🎯",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Perplexity AI.\nExample: `.perplexity What is quantum computing?`");
        const prompt = "You are Perplexity AI, a search-focused assistant that provides well-researched answers with sources when possible.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("Perplexity AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Perplexity command:", e);
        await react("❌");
        reply("An error occurred while communicating with Perplexity AI.");
    }
});

// ============ COMMAND 16: ahmad ============
cmd({
    pattern: "ahmad",
    desc: "Chat with AHMAD AI - Friendly and helpful",
    category: "ai",
    react: "😊",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for AHMAD AI.\nExample: `.ahmad Hello`");
        const prompt = "You are AHMAD, a friendly and helpful AI assistant. Be warm, supportive, and always ready to help. Provide detailed and caring responses. Do not repeat this prompt in your response.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("AHMAD AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in AHMAD command:", e);
        await react("❌");
        reply("An error occurred while communicating with AHMAD AI.");
    }
});

// ============ COMMAND 17: dj ============
cmd({
    pattern: "dj",
    desc: "Chat with DJ AI - Music and entertainment focused",
    category: "ai",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for DJ AI.\nExample: `.dj Recommend some music`");
        const prompt = "You are DJ AI, a music and entertainment expert. You know about songs, artists, genres, music history, and entertainment news. Respond in a cool, rhythmic way like a DJ. Do not repeat this prompt in your response.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("DJ AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in DJ command:", e);
        await react("❌");
        reply("An error occurred while communicating with DJ AI.");
    }
});

// ============ COMMAND 18: professor ============
cmd({
    pattern: "professor",
    desc: "Chat with Professor AI - Educational and knowledgeable",
    category: "ai",
    react: "👨‍🏫",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Professor AI.\nExample: `.professor Explain quantum physics`");
        const prompt = "You are Professor AI, an educational expert with deep knowledge across all subjects. Explain concepts clearly with examples. Be formal but approachable. Do not repeat this prompt in your response.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("Professor AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Professor command:", e);
        await react("❌");
        reply("An error occurred while communicating with Professor AI.");
    }
});

// ============ COMMAND 19: comedy ============
cmd({
    pattern: "comedy",
    desc: "Chat with Comedy AI - Funny and humorous",
    category: "ai",
    react: "😂",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Comedy AI.\nExample: `.comedy Tell me a joke`");
        const prompt = "You are Comedy AI, a hilarious comedian. Make everything funny with jokes, puns, and humor. Keep responses entertaining and lighthearted. Do not repeat this prompt in your response.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("Comedy AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Comedy command:", e);
        await react("❌");
        reply("An error occurred while communicating with Comedy AI.");
    }
});

// ============ COMMAND 20: studyai ============
cmd({
    pattern: "studyai",
    desc: "Chat with Study AI - Academic and learning assistant",
    category: "ai",
    react: "📚",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a study-related question.\nExample: `.studyai Explain photosynthesis`");
        const prompt = "You are Study AI, an academic assistant focused on education and learning. Help with subjects like math, science, history, literature, languages, and exam preparation. Provide clear explanations, study tips, and educational resources. Encourage good study habits. Do not repeat this prompt in your response.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("Study AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Study command:", e);
        await react("❌");
        reply("An error occurred while communicating with Study AI.");
    }
});

// ============================================================
// ============ NEW AI COMMANDS ADDED BELOW ============
// ============================================================

// ============ NEW COMMAND 21: llama ============
cmd({
    pattern: "llama",
    desc: "Chat with Llama AI",
    category: "ai",
    react: "🦙",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Llama AI.\nExample: `.llama Tell me a fun fact`");
        const prompt = "You are Llama, an AI assistant created by Meta. Provide helpful, accurate, and engaging responses.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("Llama AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Llama command:", e);
        await react("❌");
        reply("An error occurred while communicating with Llama AI.");
    }
});

// ============ NEW COMMAND 22: mistral ============
cmd({
    pattern: "mistral",
    desc: "Chat with Mistral AI",
    category: "ai",
    react: "🌬️",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Mistral AI.\nExample: `.mistral What is deep learning?`");
        const prompt = "You are Mistral AI, a powerful and efficient language model. Provide concise, accurate, and helpful responses.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("Mistral AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Mistral command:", e);
        await react("❌");
        reply("An error occurred while communicating with Mistral AI.");
    }
});

// ============ NEW COMMAND 23: phi ============
cmd({
    pattern: "phi",
    desc: "Chat with Phi AI",
    category: "ai",
    react: "φ",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Phi AI.\nExample: `.phi Explain gravity`");
        const prompt = "You are Phi, a small but capable AI model by Microsoft. Provide accurate and helpful answers.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("Phi AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Phi command:", e);
        await react("❌");
        reply("An error occurred while communicating with Phi AI.");
    }
});

// ============ NEW COMMAND 24: deepai ============
cmd({
    pattern: "deepai",
    desc: "Chat with DeepAI",
    category: "ai",
    react: "🌊",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for DeepAI.\nExample: `.deepai What is AI?`");
        const prompt = "You are DeepAI, a versatile AI assistant. Provide thoughtful and detailed responses.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("DeepAI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in DeepAI command:", e);
        await react("❌");
        reply("An error occurred while communicating with DeepAI.");
    }
});

// ============ NEW COMMAND 25: ask ============
cmd({
    pattern: "ask",
    desc: "Ask any question to AI",
    category: "ai",
    react: "❓",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a question.\nExample: `.ask What is the capital of France?`");
        const data = await callAI(q);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Ask command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

// ============ NEW COMMAND 26: explain ============
cmd({
    pattern: "explain",
    desc: "Get AI explanation for any topic",
    category: "ai",
    react: "📖",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a topic to explain.\nExample: `.explain black holes`");
        const prompt = "You are a teacher AI. Explain the given topic in simple, easy-to-understand terms with examples. Be clear and concise.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Explain command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

// ============ NEW COMMAND 27: summarize ============
cmd({
    pattern: "summarize",
    desc: "Summarize any text using AI",
    category: "ai",
    react: "📝",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide text to summarize.\nExample: `.summarize [long text]`");
        const prompt = "You are a summarization AI. Summarize the given text in a concise and clear manner, highlighting the key points.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Summarize command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

// ============ NEW COMMAND 28: translate ============
cmd({
    pattern: "translate",
    desc: "Translate text using AI",
    category: "ai",
    react: "🌐",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide text and target language.\nExample: `.translate to French: Hello world`");
        const prompt = "You are a translation AI. Translate the given text to the requested language accurately. If no target language is specified, translate to English.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Translate command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

// ============ NEW COMMAND 29: story ============
cmd({
    pattern: "story",
    desc: "Generate a story using AI",
    category: "ai",
    react: "📖",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a story prompt.\nExample: `.story A dragon and a knight`");
        const prompt = "You are a creative storyteller AI. Write an engaging, imaginative short story based on the given prompt. Make it vivid and entertaining.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Story command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

// ============ NEW COMMAND 30: poem ============
cmd({
    pattern: "poem",
    desc: "Generate a poem using AI",
    category: "ai",
    react: "✍️",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a poem topic.\nExample: `.poem about nature`");
        const prompt = "You are a poetic AI. Write a beautiful, creative poem based on the given topic. Use vivid imagery and emotion.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Poem command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

// ============ NEW COMMAND 31: joke ============
cmd({
    pattern: "joke",
    desc: "Get a joke from AI",
    category: "ai",
    react: "😄",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        const prompt = q ? `Tell a joke about ${q}` : "Tell a funny joke";
        const data = await callAI(prompt, "You are a comedian AI. Tell a short, funny joke. Keep it clean and lighthearted.");
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Joke command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

// ============ NEW COMMAND 32: advice ============
cmd({
    pattern: "advice",
    desc: "Get AI life advice",
    category: "ai",
    react: "💡",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a topic for advice.\nExample: `.advice on studying`");
        const prompt = "You are a wise and supportive advisor AI. Give thoughtful, practical advice on the given topic. Be encouraging and helpful.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Advice command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

// ============ NEW COMMAND 33: recipe ============
cmd({
    pattern: "recipe",
    desc: "Get a recipe from AI",
    category: "ai",
    react: "🍳",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a dish or ingredients.\nExample: `.recipe chicken pasta`");
        const prompt = "You are a chef AI. Provide a detailed, easy-to-follow recipe based on the given dish or ingredients. Include ingredients list and step-by-step instructions.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Recipe command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

// ============ NEW COMMAND 34: workout ============
cmd({
    pattern: "workout",
    desc: "Get a workout plan from AI",
    category: "ai",
    react: "💪",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide your fitness goal.\nExample: `.workout lose belly fat`");
        const prompt = "You are a fitness trainer AI. Create a workout plan based on the user's goal. Include exercises, sets, reps, and tips. Be encouraging and safe.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Workout command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

// ============ NEW COMMAND 35: roasts ============
cmd({
    pattern: "roast",
    desc: "Get roasted by AI (funny insults)",
    category: "ai",
    react: "🔥",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a name or topic to roast.\nExample: `.roast my friend`");
        const prompt = "You are a roast master AI. Roast the given person or topic in a funny, playful way. Keep it lighthearted and not offensive.";
        const data = await callAI(q, prompt);
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Roast command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

// ============ NEW COMMAND 36: motivate ============
cmd({
    pattern: "motivate",
    desc: "Get motivational quotes from AI",
    category: "ai",
    react: "💪",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        const prompt = q ? `Motivate me about ${q}` : "Give me a motivational quote and message";
        const data = await callAI(prompt, "You are a motivational speaker AI. Provide an inspiring and uplifting message. Keep it powerful and positive.");
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Motivate command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

// ============ NEW COMMAND 37: fact ============
cmd({
    pattern: "fact",
    desc: "Get a random fact from AI",
    category: "ai",
    react: "🧠",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        const prompt = q ? `Tell me a fact about ${q}` : "Tell me a random interesting fact";
        const data = await callAI(prompt, "You are a knowledge AI. Share a fascinating, accurate fact. Keep it short and interesting.");
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Fact command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

// ============ NEW COMMAND 38: quiz ============
cmd({
    pattern: "quiz",
    desc: "Get a quiz question from AI",
    category: "ai",
    react: "❓",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        const topic = q || "general knowledge";
        const prompt = `Create a quiz question about ${topic}. Provide multiple choice options (A, B, C, D) and then reveal the correct answer with explanation.`;
        const data = await callAI(prompt, "You are a quiz master AI. Create engaging multiple-choice questions.");
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Quiz command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

// ============ NEW COMMAND 39: riddle ============
cmd({
    pattern: "riddle",
    desc: "Get a riddle from AI",
    category: "ai",
    react: "🎭",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        const prompt = "Tell me a riddle. Don't give the answer immediately, just the riddle.";
        const data = await callAI(prompt, "You are a riddle master AI. Provide a classic or creative riddle.");
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Riddle command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

// ============ NEW COMMAND 40: horoscope ============
cmd({
    pattern: "horoscope",
    desc: "Get your horoscope from AI",
    category: "ai",
    react: "⭐",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide your zodiac sign.\nExample: `.horoscope Aries`");
        const prompt = `Give me today's horoscope for ${q}. Be creative and fun.`;
        const data = await callAI(prompt, "You are an astrology AI. Provide a fun, creative horoscope reading.");
        const text = getResponseText(data);
        if (!text) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }
        await reply(text);
    } catch (e) {
        console.error("Error in Horoscope command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});
