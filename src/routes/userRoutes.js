const express = require('express');
const { 
    createUser, 
    loginUser, 
    getUsers, 
    getUserById 
} = require('../controllers/userController');

const router = express.Router();

router.post('/', createUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.get('/:id', getUserById);

module.exports = router;