const jwt = require('jsonwebtoken');
const {
  registerService,
  verifyOTPService,
  resendOTPService,
  loginService,
} = require('./auth.service');
const { successResponse } = require('../../../responses');

const sendTokenCookie = (res, user) => {
  const token = jwt.sign(
    { id: user._id, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const data = await registerService(name, email, password);
    return successResponse(res, data, `OTP sent to ${email}. Please verify your account.`, 201);
  } catch (error) {
    next(error);
  }
};

const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await verifyOTPService(email, otp);
    sendTokenCookie(res, user);
    return successResponse(res, { user }, 'Email verified successfully! Welcome to FlatSell 🎉', 200);
  } catch (error) {
    next(error);
  }
};

const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    await resendOTPService(email);
    return successResponse(res, null, 'New OTP sent to your email.', 200);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await loginService(email, password);
    sendTokenCookie(res, user);
    return successResponse(res, { user }, 'Logged in successfully', 200);
  } catch (error) {
    if (error.details && error.details.needsVerification) {
      return res.status(403).json({
        success: false,
        message: error.message,
        data: error.details,
      });
    }
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    return successResponse(res, { user: req.user }, 'Success', 200);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    return successResponse(res, null, 'Logged out successfully', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, verifyOTP, resendOTP, login, getMe, logout };
