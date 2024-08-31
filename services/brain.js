const axios = require('axios');
const OpenAI = require('openai');
require('dotenv').config(); // Load environment variables

// Initialize OpenAI instance
const openai = new OpenAI();

// Function to handle OpenAI requests
const getLLMOpenaiResponse = async (message) => {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                content: `You are Palina, a highly advanced AI assistant designed to interact in an almost human-like manner...`,
                role: "system"
            },
            { role: "user", content: message },
        ]
    });

    console.log(completion.choices[0].message);
    return completion.choices[0].message.content;
};

// Function to handle DeepSeek Coder requests
const getDeepSeekCoderLLMResponse = async (message, history = []) => {
    const AI_ENDPOINT = 'https://api.deepseek.com/chat/completions';
    const API_KEY = process.env.API_KEY;

    const messages = [
        {
            content: `You are Palina, a highly advanced AI assistant designed to interact in an almost human-like manner...`,
            role: "system"
        },
        ...history.map((msg, index) => ({
            "content": msg.content,
            "role": msg.role === 'ai' ? 'assistant' : msg.role,
            "name": `message_${index}`
        })),
        {
            "content": message,
            "role": "user"
        }
    ];

    const data = JSON.stringify({
        "messages": messages,
        "model": "deepseek-coder",
        "frequency_penalty": 0.5,
        "max_tokens": 2048,
        "presence_penalty": 0.6,
        "stop": null,
        "stream": false,
        "temperature": 0.7,
        "top_p": 1,
        "logprobs": null
    });

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: AI_ENDPOINT,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
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
        console.error('Error fetching AI response:', error.response ? error.response.data : error.message);
        return 'Sorry, something went wrong.';
    }
};

/// Function to determine which service to use based on the content
const determineService = async (message) => {
    const codingKeywords = ['code', 'programming', 'debug', 'algorithm', 'function', 'API', 'syntax', 'compile', 'error'];

    // Extract the content from the message object
    const messageContent = message.content.toLowerCase();

    // Simple keyword check to determine if it's related to coding
    const isCodingRelated = codingKeywords.some(keyword => messageContent.includes(keyword));

    if (isCodingRelated) {
        console.log("Request related to coding. Using DeepSeek Coder LLM.");
        return await getDeepSeekCoderLLMResponse(messageContent);
    } else {
        console.log("Request not related to coding. Using OpenAI LLM.");
        return await getLLMOpenaiResponse(messageContent);
    }
};

// Export the functions
module.exports = { getLLMOpenaiResponse, getDeepSeekCoderLLMResponse, determineService };
