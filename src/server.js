const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Add JSON middleware
app.use(express.json());

// Mount User Routes
app.use('/api/users', userRoutes);

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