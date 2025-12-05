// routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Import controllers
const { register } = require('../controllers/auth/registerController');
const { login } = require('../controllers/auth/loginController');
const { verifyEmail, resendVerification } = require('../controllers/auth/verificationController');
const { getMe } = require('../controllers/auth/profileController');

// Import middleware
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;