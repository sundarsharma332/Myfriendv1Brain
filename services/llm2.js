const OpenAI = require('openai');
require('dotenv').config(); // Load environment variables

const openai = new OpenAI();

const getOpenAIHaiku = async () => {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            {
                role: "user",
                content: "Write a haiku about recursion in programming.",
            },
        ],
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Use the OpenAI API key
        }
    });

    console.log(completion.choices[0].message);
    return completion.choices[0].message.content;
};

module.exports = { getOpenAIHaiku };
