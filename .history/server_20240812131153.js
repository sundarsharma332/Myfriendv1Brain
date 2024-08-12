require('dotenv').config(); // Import and configure dotenv
const express = require('express');
const cors = require('cors'); // Import the cors package
const { getAIResponse } = require('./services/brain');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Enable JSON body parsing
app.use(express.json());

// Define a simple route for the root URL
app.get('/', (req, res) => {
    res.send('Server is running and API is listening.');
});

// Handle POST requests to /api/message
app.post('/api/message', async (req, res) => {
    const { message, history } = req.body;

    console.log('Message received:', message);

    // Process the message with AI
    try {
        const aiResponse = await getAIResponse(message, history);
        console.log('AI response:', aiResponse);
        res.json({ response: aiResponse });
    } catch (error) {
        console.error('Error processing AI response:', error);
        res.status(500).json({ error: 'Error processing your request' });
    }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('API is listening for requests...');
});
