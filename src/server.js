const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes'); // Import auth routes

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes); // Register auth routes under /api/auth

app.get('/api/status', (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Store API is running"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});