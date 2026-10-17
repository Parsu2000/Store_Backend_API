require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Initialize Express App
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Root Health Check Route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Store Backend API is running",
        allowedAtlasIPs: ["0.0.0.0/0"]
    });
});

// Define Port and Host IP
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Listen on all network interfaces (localhost / 127.0.0.1 / LAN IP)

// Connect to MongoDB first, then start the Express server
connectDB().then(() => {
    app.listen(PORT, HOST, () => {
        console.log(`Server is running on http://localhost:${PORT} (Bound to IP: ${HOST})`);
    });
});