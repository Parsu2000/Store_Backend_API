const express = require('express');
const { createUser } = require('../controllers/userController');

const router = express.Router();

// POST /api/users
router.post('/', createUser);

module.exports = router;