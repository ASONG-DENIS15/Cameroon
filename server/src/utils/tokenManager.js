import jwt from 'jsonwebtoken';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';

/**
 * Verify JWT Token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Generate JWT Token
 */
export const generateToken = (payload, expiresIn = process.env.JWT_EXPIRE) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (payload, expiresIn = process.env.JWT_REFRESH_EXPIRE) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn });
};

/**
 * Decode Token Without Verification
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};
