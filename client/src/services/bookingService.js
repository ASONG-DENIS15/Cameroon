import api from './api'

/**
 * Booking Services
 */

export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData)
    return response.data
  },

  getUserBookings: async (page = 1, limit = 10) => {
    const response = await api.get(`/bookings?page=${page}&limit=${limit}`)
    return response.data
  },

  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`)
    return response.data
  },

  cancelBooking: async (id, reason) => {
    const response = await api.post(`/bookings/${id}/cancel`, { reason })
    return response.data
  },
}
