const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        age: {
            type: Number
        },
        role: {
            type: String,
            enum: ['user', 'admin'], // Strictly allow only 'user' or 'admin'
            default: 'user'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);