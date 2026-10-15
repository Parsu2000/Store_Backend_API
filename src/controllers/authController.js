const User = require('../models/User');
const bcrypt = require('bcrypt');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, age } = req.body;

        // Basic validation for required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Hash the password using bcrypt (salt rounds = 10)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user with default role 'user'
        const user = new User({
            name,
            email,
            password: hashedPassword,
            age,
            role: 'user' // Default role
        });

        const savedUser = await user.save();

        // Prepare response object without the password field
        const userResponse = savedUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: userResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    registerUser
};