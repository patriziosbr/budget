const express = require('express');
const router = express.Router();

const { getAllCategories } = require('../controllers/categorieController');
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getAllCategories)

module.exports = router;