const express = require('express');
const { body } = require('express-validator');
const { register, verifyOTP, resendOTP, login, getMe, logout } = require('./auth.controller');
const { protect } = require('../../../middleware/auth.middleware');

const router = express.Router();

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

router.post('/register', registerValidation, register);

router.post('/verify-otp', verifyOTP);

router.post('/resend-otp', resendOTP);

router.post('/login', loginValidation, login);

router.get('/me', protect, getMe);

router.post('/logout', protect, logout);

module.exports = router;
