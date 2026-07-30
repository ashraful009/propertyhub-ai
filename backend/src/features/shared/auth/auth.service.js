const { findUserByEmail, createUser, saveUser } = require('./auth.repository');
const generateOTP = require('../../../utils/generateOTP');
const { sendEmail, otpEmailTemplate } = require('../../../utils/sendEmail');
const { ConflictError, NotFoundError, ValidationError, UnauthorizedError, ForbiddenError } = require('../../../errors');

const registerService = async (name, email, password) => {
  if (!name || !email || !password) {
    throw new ValidationError('All fields are required');
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  const user = await createUser({ name, email, password, otp, otpExpiry });

  await sendEmail({
    to: email,
    subject: 'Verify your FlatSell account',
    html: otpEmailTemplate(name, otp),
  });

  return { email };
};

const verifyOTPService = async (email, otp) => {
  if (!email || !otp) {
    throw new ValidationError('Email and OTP are required');
  }

  const user = await findUserByEmail(email, '+otp +otpExpiry');
  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.isVerified) {
    throw new ValidationError('Account already verified');
  }

  if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
    throw new ValidationError('OTP has expired. Please register again.');
  }

  if (user.otp !== otp) {
    throw new ValidationError('Invalid OTP. Please try again.');
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await saveUser(user);

  return user;
};

const resendOTPService = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  if (user.isVerified) {
    throw new ValidationError('Account is already verified');
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await saveUser(user);

  await sendEmail({
    to: email,
    subject: 'Your new FlatSell OTP code',
    html: otpEmailTemplate(user.name, otp),
  });

  return true;
};

const loginService = async (email, password) => {
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const user = await findUserByEmail(email, '+password');
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!user.isVerified) {
    const error = new ForbiddenError('Please verify your email before logging in.');
    error.details = { email, needsVerification: true };
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  return user;
};

const forgotPasswordService = async (email) => {
  if (!email) {
    throw new ValidationError('Email is required');
  }

  const user = await findUserByEmail(email);
  if (!user) {
    // Return true anyway for security (don't reveal if user exists or not)
    return true; 
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await saveUser(user);

  await sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html: otpEmailTemplate(user.name, otp),
  });

  return true;
};

const resetPasswordService = async (email, otp, newPassword) => {
  if (!email || !otp || !newPassword) {
    throw new ValidationError('Email, OTP, and new password are required');
  }

  if (newPassword.length < 6) {
    throw new ValidationError('Password must be at least 6 characters');
  }

  const user = await findUserByEmail(email, '+otp +otpExpiry');
  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (!user.otp || !user.otpExpiry || user.otpExpiry < new Date()) {
    throw new ValidationError('OTP has expired or is invalid. Please request a new one.');
  }

  if (user.otp !== otp) {
    throw new ValidationError('Invalid OTP. Please try again.');
  }

  user.password = newPassword;
  user.otp = null;
  user.otpExpiry = null;
  
  await saveUser(user);
  return true;
};

module.exports = {
  registerService,
  verifyOTPService,
  resendOTPService,
  loginService,
  forgotPasswordService,
  resetPasswordService,
};
