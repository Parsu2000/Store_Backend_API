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
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes
router.post('/', createUser);
router.post('/login', loginUser);

// Admin only: Manage users
router.get('/', protect, authorizeRoles('admin'), getUsers);
router.get('/:id', protect, authorizeRoles('admin'), getUserById);
router.put('/:id', protect, authorizeRoles('admin'), updateUser);
router.delete('/:id', protect, authorizeRoles('admin'), deleteUser);

module.exports = router;