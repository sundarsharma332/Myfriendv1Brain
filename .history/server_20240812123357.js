require('dotenv').config(); // Import and configure dotenv
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import the cors package
const { getAIResponse } = require('./services/brain');

const app = express();
const server = http.createServer(app);

// Enable CORS for all routes
app.use(cors());

// Set up Socket.IO with CORS configuration
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow any origin (adjust this if you need to restrict)
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
});

// Define a simple route for the root URL
app.get('/', (req, res) => {
    res.send('Server is running and Socket.IO is listening.');
});

// Handle socket connections
io.on('connection', async (socket) => {
    console.log('New client connected');

    // Send a welcome message immediately after the user connects
    try {
        const initialResponse = await getAIResponse({ content: 'Welcome!', role: 'assistant' }, []);
        console.log('Initial AI response:', initialResponse);
        socket.emit('response', initialResponse);
    } catch (error) {
        console.error('Error sending initial AI response:', error);
        socket.emit('response', 'Welcome to the AI chat!');
    }

    socket.on('message', async (payload) => {
        const { message, history } = payload;
        console.log('Message received:', message);

        // Process the message with AI
        try {
            const aiResponse = await getAIResponse(message, history);
            console.log('AI response:', aiResponse);
            // Send the AI response back to the Flutter app
            socket.emit('response', aiResponse);
        } catch (error) {
            console.error('Error processing AI response:', error);
            socket.emit('response', 'Error processing your request');
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Socket.IO is listening for connections...');
});
