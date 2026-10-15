const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes'); // Import product routes

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes); // Register product routes

app.get('/api/status', (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Store API is running"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});