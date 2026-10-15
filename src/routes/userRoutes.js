const express = require('express');
const { 
    createUser, 
    loginUser, 
    getUsers, 
    getUserById,
    updateUser,
    deleteUser 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes (handled via /api/auth, or kept here if needed)
router.post('/', createUser);
router.post('/login', loginUser);

// Protected routes (Require valid Bearer token)
router.get('/', protect, getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;