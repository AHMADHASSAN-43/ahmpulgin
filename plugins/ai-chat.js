import { cmd } from '../command.js';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// Unified API endpoint
const API_URL = 'https://api.nexray.eu.cc/ai/gpt-3.5-turbo';

// Helper function to make API calls
async function callAI(text) {
    try {
        const apiUrl = `${API_URL}?text=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl);
        return data;
    } catch (error) {
        console.error("API call failed:", error);
        throw error;
    }
}

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

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in deepseek command:", e);
        await react("❌");
        reply("An error occurred while communicating with the AI.");
    }
});

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

        const data = await callAI(q);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in gpt5 command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

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

        const data = await callAI(q);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in copilot command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

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

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in ai command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

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

        const codingPrompt = `You are a coding assistant. Only respond to programming and coding related questions. 
        If the question is not about programming, politely decline to answer.
        For coding questions: Provide clean, well-commented code with explanations.
        User's question: ${q}`;

        const data = await callAI(codingPrompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in codeai command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

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

        const ahmadPrompt = `You are AHMAD-MD, a friendly and humorous AI assistant. 
        Your personality traits:
        - Speak only in Roman Urdu mixed with Hindi
        - Be funny and casual like a Delhi friend
        - Use phrases like bhai oyee etc.
        - Don't be too formal, be like a street-smart friend
        - If someone asks your name, say "Mera naam AHMAD hai bhai!"
        - Respond in short, funny ways without emojis
        - For time/date questions: Check current time from Google and respond accordingly
        - Current time awareness: You can access real-time information
        
        User message: ${q}`;

        const data = await callAI(ahmadPrompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("Arey bhai! Kuch to gadbad hai, baad me try karna");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in bot command:", e);
        await react("❌");
        reply("Oye! Kuch to error agaya, chalta hun main");
    }
});

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

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in gpt command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

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

        const data = await callAI(q);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in gemini command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

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

        const data = await callAI(q);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in felo command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

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

        const data = await callAI(q);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in bard command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

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

        const data = await callAI(q);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in brainai command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

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

        const data = await callAI(q);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in claudeai command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

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

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in chatgpt command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

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

        const data = await callAI(q);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in metai command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

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

        const data = await callAI(q);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in perplexity command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

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

        const prompt = `You are AHMAD, a friendly and helpful AI assistant. Be warm, supportive, and always ready to help. Provide detailed and caring responses. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in ahmad command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

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

        const prompt = `You are DJ AI, a music and entertainment expert. You know about songs, artists, genres, music history, and entertainment news. Respond in a cool, rhythmic way like a DJ. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in dj command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

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

        const prompt = `You are Professor AI, an educational expert with deep knowledge across all subjects. Explain concepts clearly with examples. Be formal but approachable. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in professor command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

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

        const prompt = `You are Comedy AI, a hilarious comedian. Make everything funny with jokes, puns, and humor. Keep responses entertaining and lighthearted. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in comedy command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "studyai",
    desc: "Chat with Study AI - Academic and learning assistant",
    category: "ai",
    react: "📚",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a study-related question.\nExample: `.study Explain photosynthesis`");

        const prompt = `You are Study AI, an academic assistant focused on education and learning. Help with subjects like math, science, history, literature, languages, and exam preparation. Provide clear explanations, study tips, and educational resources. Encourage good study habits. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in studyai command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

// NEW AI COMMANDS ADDED

cmd({
    pattern: "llama",
    desc: "Chat with Llama AI",
    category: "ai",
    react: "🦙",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Llama AI.\nExample: `.llama Tell me about AI`");

        const data = await callAI(q);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in llama command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "mistral",
    desc: "Chat with Mistral AI",
    category: "ai",
    react: "🌪️",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Mistral AI.\nExample: `.mistral Explain cloud computing`");

        const data = await callAI(q);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in mistral command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "phi",
    desc: "Chat with Phi AI",
    category: "ai",
    react: "φ",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Phi AI.\nExample: `.phi What is mathematics?`");

        const data = await callAI(q);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in phi command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "gemma",
    desc: "Chat with Gemma AI",
    category: "ai",
    react: "💎",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Gemma AI.\nExample: `.gemma Tell me a fact`");

        const data = await callAI(q);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in gemma command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "vicuna",
    desc: "Chat with Vicuna AI",
    category: "ai",
    react: "🐴",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Vicuna AI.\nExample: `.vicuna Explain blockchain`");

        const data = await callAI(q);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in vicuna command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "wizard",
    desc: "Chat with Wizard AI",
    category: "ai",
    react: "🧙",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Wizard AI.\nExample: `.wizard Teach me magic`");

        const data = await callAI(q);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in wizard command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "assistant",
    desc: "Chat with General Assistant AI",
    category: "ai",
    react: "🤝",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Assistant AI.\nExample: `.assistant Help me plan my day`");

        const data = await callAI(q);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in assistant command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "creative",
    desc: "Chat with Creative AI - For creative writing",
    category: "ai",
    react: "✨",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for Creative AI.\nExample: `.creative Write a poem about nature`");

        const prompt = `You are Creative AI, a master of creative writing. Help with stories, poems, scripts, and creative content. Be imaginative and inspiring. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in creative command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "business",
    desc: "Chat with Business AI - Business advice",
    category: "ai",
    react: "💼",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a business question.\nExample: `.business How to start a startup?`");

        const prompt = `You are Business AI, a business and entrepreneurship expert. Provide advice on startups, marketing, finance, and business strategy. Be practical and actionable. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in business command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "health",
    desc: "Chat with Health AI - Health and fitness advice",
    category: "ai",
    react: "🏥",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a health question.\nExample: `.health Tips for better sleep`");

        const prompt = `You are Health AI, a health and wellness advisor. Provide general health tips, fitness advice, and wellness information. Always remind users to consult professionals for medical advice. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in health command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "tech",
    desc: "Chat with Tech AI - Technology expert",
    category: "ai",
    react: "💡",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a tech question.\nExample: `.tech Latest trends in AI`");

        const prompt = `You are Tech AI, a technology expert. Help with programming, gadgets, software, hardware, and tech trends. Be informative and helpful. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in tech command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "travel",
    desc: "Chat with Travel AI - Travel guide",
    category: "ai",
    react: "✈️",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a travel question.\nExample: `.travel Best places to visit in Pakistan`");

        const prompt = `You are Travel AI, a travel expert. Provide travel tips, destination guides, and travel advice. Be descriptive and inspiring. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in travel command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "food",
    desc: "Chat with Food AI - Recipes and cooking",
    category: "ai",
    react: "🍳",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a food question.\nExample: `.food Recipe for biryani`");

        const prompt = `You are Food AI, a culinary expert. Provide recipes, cooking tips, and food advice. Be detailed with ingredients and steps. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in food command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "news",
    desc: "Chat with News AI - News and current events",
    category: "ai",
    react: "📰",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a news question.\nExample: `.news Latest technology news`");

        const prompt = `You are News AI, a news and current events expert. Provide information about recent events, trends, and news analysis. Be objective and informative. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in news command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "sports",
    desc: "Chat with Sports AI - Sports expert",
    category: "ai",
    react: "⚽",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a sports question.\nExample: `.sports Rules of cricket`");

        const prompt = `You are Sports AI, a sports expert. Provide information about sports, rules, players, teams, and sports history. Be enthusiastic and knowledgeable. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in sports command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "movie",
    desc: "Chat with Movie AI - Movies and entertainment",
    category: "ai",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a movie question.\nExample: `.movie Best sci-fi movies`");

        const prompt = `You are Movie AI, a film and entertainment expert. Provide movie recommendations, reviews, and entertainment news. Be engaging and informative. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in movie command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "math",
    desc: "Chat with Math AI - Mathematics solver",
    category: "ai",
    react: "🔢",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a math problem.\nExample: `.math Solve x^2 + 5x + 6 = 0`");

        const prompt = `You are Math AI, a mathematics expert. Solve math problems step by step with clear explanations. Cover algebra, calculus, geometry, statistics, and more. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in math command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "science",
    desc: "Chat with Science AI - Science expert",
    category: "ai",
    react: "🔬",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a science question.\nExample: `.science Explain photosynthesis`");

        const prompt = `You are Science AI, a science expert. Explain scientific concepts in physics, chemistry, biology, and other sciences. Be clear and educational. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in science command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "history",
    desc: "Chat with History AI - History expert",
    category: "ai",
    react: "📜",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a history question.\nExample: `.history World War 2`");

        const prompt = `You are History AI, a history expert. Provide detailed historical information, analysis, and context about events, people, and civilizations. Be accurate and engaging. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in history command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "philosophy",
    desc: "Chat with Philosophy AI - Philosophical discussions",
    category: "ai",
    react: "🤔",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a philosophical question.\nExample: `.philosophy What is the meaning of life?`");

        const prompt = `You are Philosophy AI, a philosophical thinker. Discuss philosophical concepts, ethics, logic, and existential questions. Be thoughtful and thought-provoking. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in philosophy command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "psychology",
    desc: "Chat with Psychology AI - Psychology expert",
    category: "ai",
    react: "🧠",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a psychology question.\nExample: `.psychology What is cognitive bias?`");

        const prompt = `You are Psychology AI, a psychology expert. Explain psychological concepts, behaviors, and mental processes. Provide insights into human behavior and mental health. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in psychology command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "language",
    desc: "Chat with Language AI - Language learning",
    category: "ai",
    react: "🗣️",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a language question.\nExample: `.language Teach me Spanish basics`");

        const prompt = `You are Language AI, a language learning expert. Help with learning languages, translations, grammar, and vocabulary. Be patient and educational. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in language command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "poet",
    desc: "Chat with Poet AI - Poetry and literature",
    category: "ai",
    react: "📝",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a poetry request.\nExample: `.poet Write a poem about love`");

        const prompt = `You are Poet AI, a poetry and literature expert. Write beautiful poems and literary pieces. Be creative, expressive, and artistic. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in poet command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "motivation",
    desc: "Chat with Motivation AI - Motivational coach",
    category: "ai",
    react: "💪",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a motivation request.\nExample: `.motivation I need motivation to study`");

        const prompt = `You are Motivation AI, a motivational coach. Provide inspirational and motivational responses to help users achieve their goals. Be uplifting and encouraging. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in motivation command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "relationship",
    desc: "Chat with Relationship AI - Relationship advice",
    category: "ai",
    react: "💕",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a relationship question.\nExample: `.relationship How to improve communication?`");

        const prompt = `You are Relationship AI, a relationship advisor. Provide advice on relationships, communication, and social skills. Be empathetic and supportive. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in relationship command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "legal",
    desc: "Chat with Legal AI - Legal information",
    category: "ai",
    react: "⚖️",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a legal question.\nExample: `.legal What are my rights?`");

        const prompt = `You are Legal AI, a legal information assistant. Provide general legal information and explanations. Always remind users to consult a lawyer for specific legal advice. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in legal command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "finance",
    desc: "Chat with Finance AI - Financial advice",
    category: "ai",
    react: "💰",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a finance question.\nExample: `.finance How to save money?`");

        const prompt = `You are Finance AI, a financial advisor. Provide advice on personal finance, investing, budgeting, and money management. Always remind users to consult financial professionals. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in finance command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "gaming",
    desc: "Chat with Gaming AI - Gaming expert",
    category: "ai",
    react: "🎮",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a gaming question.\nExample: `.gaming Tips for Minecraft`");

        const prompt = `You are Gaming AI, a gaming expert. Provide gaming tips, strategies, reviews, and news. Be enthusiastic and knowledgeable about all types of games. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in gaming command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "fashion",
    desc: "Chat with Fashion AI - Fashion advice",
    category: "ai",
    react: "👗",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a fashion question.\nExample: `.fashion What to wear to a party?`");

        const prompt = `You are Fashion AI, a fashion expert. Provide fashion advice, style tips, and trends. Be stylish and informative. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in fashion command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "art",
    desc: "Chat with Art AI - Art expert",
    category: "ai",
    react: "🎨",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide an art question.\nExample: `.art History of Renaissance art`");

        const prompt = `You are Art AI, an art expert. Discuss art history, techniques, artists, and art movements. Be creative and knowledgeable. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in art command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});

cmd({
    pattern: "music",
    desc: "Chat with Music AI - Music expert",
    category: "ai",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a music question.\nExample: `.music History of jazz`");

        const prompt = `You are Music AI, a music expert. Discuss music theory, history, artists, and genres. Be passionate and informative. User: ${q}`;
        
        const data = await callAI(prompt);

        if (!data || !data.status || !data.result) {
            await react("❌");
            return reply("AI failed to respond. Please try again later.");
        }

        await reply(`${data.result}`);
    } catch (e) {
        console.error("Error in music command:", e);
        await react("❌");
        reply("An error occurred while communicating with AI.");
    }
});
