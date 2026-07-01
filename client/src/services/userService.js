import api from './api'

/**
 * User Services
 */

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile')
    return response.data
  },

  updateProfile: async (formData) => {
    const response = await api.put('/users/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/users/change-password', {
      currentPassword,
      newPassword,
    })
    return response.data
  },
}
