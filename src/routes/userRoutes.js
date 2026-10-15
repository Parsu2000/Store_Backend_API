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

router.post('/', createUser);
router.post('/login', loginUser);

// Protected routes: Request -> protect middleware -> controller
router.get('/', protect, getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;