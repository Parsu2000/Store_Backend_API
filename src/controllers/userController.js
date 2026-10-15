const User = require('../models/User');

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
const createUser = async (req, res) => {
    try {
        const { name, email, password, age, role } = req.body;

        // Check if user with this email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        // Create a new User instance
        const user = new User({
            name,
            email,
            password, // Note: password hashing will be introduced in Part 5
            age,
            role
        });

        // Save the user to MongoDB
        const savedUser = await user.save();

        // Convert Mongoose document to a plain JS object to remove password before sending response
        const userResponse = savedUser.toObject();
        delete userResponse.password;

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: userResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    createUser
};