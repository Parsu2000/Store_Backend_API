const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Add JSON middleware
app.use(express.json());

// Test API endpoint
app.get('/api/status', (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Store API is running"
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});