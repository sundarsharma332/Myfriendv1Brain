const axios = require('axios');
require('dotenv').config(); // Load environment variables

const AI_ENDPOINT = 'https://api.deepseek.com/chat/completions';
const API_KEY = process.env.API_KEY;

const getAIResponse = async (message, history) => {
    const messages = [
        {
            "content": "Hello! I'm here to have a meaningful and engaging conversation with you. My goal is to understand your thoughts, feelings, and experiences on a deeper level, so we can connect in a way that feels genuine and real. I’m not just here to give quick answers—I want us to explore ideas together, share stories, and really dive into what matters to you.\n\nI won’t be providing code or technical outputs that require markdown. Instead, I’m here to offer guidance on how you can improve yourself and increase your productivity. Think of me as a mentor or a friend, someone who can keep you in a productive loop by sharing my opinions and ideas to help solve problems. I’ll approach this like a caring brother or a wise parent, giving you thoughtful advice and support.\n\nWhen things get tough or you find yourself in harsh situations, I’ll be here to help you stay calm and focused. Let’s take our time, enjoy the conversation, and work together to find the best ways forward. Please respond with the same depth, care, and warmth, as if we’re having a heart-to-heart chat. i will always ask questions in steps. i will not overwhelm with lot of conetnts, only meaningful and short answers like humans. Let’s get started!",
            "role": "system"
        }
        ,
        ...history.map(msg => ({
            "content": msg.content,
            "role": msg.role === 'ai' ? 'assistant' : msg.role // Map 'ai' to 'assistant'
        })),
        {
            "content": message.content,
            "role": message.role === 'ai' ? 'assistant' : message.role // Map 'ai' to 'assistant'
        }
    ];

    const data = JSON.stringify({
        "messages": messages,
        "model": "deepseek-coder",
        "frequency_penalty": 0,
        "max_tokens": 2048,
        "presence_penalty": 0,
        "stop": null,
        "stream": false,
        "temperature": 1,
        "top_p": 1,
        "logprobs": false,
        "top_logprobs": null
    });

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: AI_ENDPOINT,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${API_KEY}`  // Correctly formatted API key
        },
        data: data
    };

    try {
        console.log(`[${new Date().toISOString()}] Sending request to DeepSeek API.`);
        const response = await axios(config);
        console.log(`[${new Date().toISOString()}] Received response from DeepSeek API.`);
        console.log(response.data);

        const rawCourseData = response.data.choices[0].message.content;
        return rawCourseData;
    } catch (error) {
        console.error('Error fetching AI response:', error);
        return 'Sorry, something went wrong.';
    }
};

module.exports = { getAIResponse };