import * as User from '../models/User.js';
import { comparePassword, hashPassword } from '../utils/passwordUtils.js';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../config/constants.js';

/**
 * Get User Profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.getUserById(req.user.id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update User Profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bio } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

    await User.updateUser(req.user.id, name, phone, bio, profileImage);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.UPDATE_SUCCESS
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change Password
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.getUserById(req.user.id);

    // Verify current password
    const isValid = await comparePassword(currentPassword, user.password_hash);
    if (!isValid) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);
    await User.updatePassword(req.user.id, passwordHash);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Users (Admin)
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const users = await User.getAllUsers(limit, offset);
    const total = await User.getTotalUserCount();

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete User (Admin)
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await User.deleteUser(id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: SUCCESS_MESSAGES.DELETE_SUCCESS
    });
  } catch (error) {
    next(error);
  }
};
