cmd({
    pattern: "testai",
    desc: "Test AI",
    category: "ai",
    react: "🧪",
    filename: __filename
},
async (conn, mek, m, { q, reply }) => {
    try {
        if (!q) return reply("Kuch likho!");
        
        const url = `https://api.nexray.eu.cc/ai/gpt-3.5-turbo?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(url);
        
        // Pura response dekhein
        console.log("FULL RESPONSE:", JSON.stringify(data, null, 2));
        
        // Jo bhi field ho, wo try karein
        const answer = data.result || data.message || data.response || data.data || "Kuch samajh nahi aaya";
        reply(answer);
    } catch (e) {
        console.log(e);
        reply("Error: " + e.message);
    }
});
