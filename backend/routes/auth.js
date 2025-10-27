const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation, validate } = require('../middleware/validation');
const {
    register,
    login,
    getMe,
    updateProfile,
    updatePassword,
    forgotPassword,
    resetPassword,
    logout
} = require('../controllers/authController');

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/update-password', protect, updatePassword);
router.post('/logout', protect, logout);

module.exports = router;
