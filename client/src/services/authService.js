import api from './api'

/**
 * Authentication Services
 */

export const authService = {
  register: async (name, email, password, phone) => {
    const response = await api.post('/auth/register', { name, email, password, phone })
    return response.data
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    if (response.data.data.tokens) {
      localStorage.setItem('accessToken', response.data.data.tokens.accessToken)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
    }
    return response.data
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  },

  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email', { token })
    return response.data
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  },

  resetPassword: async (token, password, confirmPassword) => {
    const response = await api.post('/auth/reset-password', { token, password, confirmPassword })
    return response.data
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh-token', { refreshToken })
    if (response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken)
    }
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  },
}
