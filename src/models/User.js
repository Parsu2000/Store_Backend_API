const mongoose = require('mongoose');

// Define the User Schema structure
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 0
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create and export the User Model
const User = mongoose.model('User', userSchema);

module.exports = User;