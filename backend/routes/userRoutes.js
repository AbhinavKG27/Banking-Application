const express = require('express');
const verifyAuth = require('../middleware/authMiddleware');
const { getBalance } = require('../controllers/userController');

const router = express.Router();

router.get('/balance', verifyAuth, getBalance);

module.exports = router;
