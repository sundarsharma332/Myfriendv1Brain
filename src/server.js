require('dotenv').config(); // Import and configure dotenv
const express = require('express');
const cors = require('cors'); // Import the cors package
const { determineService } = require('../services/brain'); // Import the determineService function

const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: '*',
    credentials: true,
}));

// Enable JSON body parsing
app.use(express.json());

// Define a simple route for the root URL
app.get('/api/test', (req, res) => {
    res.send('Server is running and API is listening.');
});

// Handle POST requests to /api/message
app.post('/api/message', async (req, res) => {
    const { message, history } = req.body;

    console.log('Message received:', message);

    // Process the message with AI
    try {
        // Use determineService to decide which AI service to use
        const aiResponse = await determineService(message, history);
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
