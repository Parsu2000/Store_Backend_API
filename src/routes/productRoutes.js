const express = require('express');
const { createProduct } = require('../controllers/productController');

const router = express.Router();

// POST /api/products
router.post('/', createProduct);

module.exports = router;