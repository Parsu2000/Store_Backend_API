const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role: role }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Create a new user (Register)
// @route   POST /api/users
// @access  Public
const createUser = async (req, res) => {
    try {
        const { name, email, password, age, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        const user = new User({
            name,
            email,
            password,
            age,
            role
        });

        const savedUser = await user.save();

        const userResponse = savedUser.toObject();
        delete userResponse.password;

        const token = generateToken(savedUser._id, savedUser.role);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
            data: userResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Authenticate user & login
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user._id, user.role);

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: userResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public (or Protected later)
const getUsers = async (req, res) => {
    try {
        // Fetch all users and exclude the password field
        const users = await User.find({}).select('-password');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public (or Protected later)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        // Handle case where ID format is invalid for MongoDB ObjectId
        res.status(400).json({
            success: false,
            message: "Invalid User ID format"
        });
    }
};

module.exports = {
    createUser,
    loginUser,
    getUsers,
    getUserById
};