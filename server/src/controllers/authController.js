import * as User from '../models/User.js';
import * as Token from '../models/Token.js';
import { hashPassword, comparePassword, generateRandomPassword } from '../utils/passwordUtils.js';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokenManager.js';
import { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailSender.js';
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../config/constants.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Register User
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: ERROR_MESSAGES.EMAIL_EXISTS
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const userId = await User.createUser(name, email, passwordHash, phone);

    // Send welcome email
    await sendWelcomeEmail(email, name);

    // Generate verification token
    const verificationToken = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await Token.createToken(userId, verificationToken, 'email_verification', expiresAt);

    // Send verification email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(email, verificationLink);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
      data: {
        id: userId,
        name,
        email
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login User
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Get user
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Account is inactive'
      });
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS
      });
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate tokens
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token
    const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await Token.createToken(user.id, refreshToken, 'refresh', refreshTokenExpiry);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profile_image
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Email
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    // Get token
    const tokenRecord = await Token.getToken(token);
    if (!tokenRecord) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Verify user
    await User.verifyUserEmail(tokenRecord.user_id);
    await Token.markTokenAsUsed(tokenRecord.id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Forgot Password
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Get user
    const user = await User.getUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'If email exists, password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await Token.createToken(user.id, resetToken, 'password_reset', expiresAt);

    // Send reset email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(email, resetLink);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Password reset link has been sent to your email'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset Password
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Get token
    const tokenRecord = await Token.getToken(token);
    if (!tokenRecord) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update password
    await User.updatePassword(tokenRecord.user_id, passwordHash);
    await Token.markTokenAsUsed(tokenRecord.id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh Token
 */
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Get user
    const user = await User.getUserById(decoded.id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      });
    }

    // Generate new access token
    const payload = { id: user.id, email: user.email, role: user.role };
    const newAccessToken = generateToken(payload);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: {
        accessToken: newAccessToken
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Current User Profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.getUserById(req.user.id);
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: ERROR_MESSAGES.USER_NOT_FOUND
      });
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
