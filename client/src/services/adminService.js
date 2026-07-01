import api from './api'

/**
 * Admin Services
 */

export const adminService = {
  getDashboardStatistics: async () => {
    const response = await api.get('/admin/dashboard/statistics')
    return response.data
  },

  getAllBookings: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page, limit, ...filters })
    const response = await api.get(`/admin/bookings?${params}`)
    return response.data
  },

  updateBookingStatus: async (id, status, cancellationReason = null) => {
    const response = await api.put(`/admin/bookings/${id}/status`, {
      status,
      cancellation_reason: cancellationReason,
    })
    return response.data
  },

  getTopAttractions: async (limit = 5) => {
    const response = await api.get(`/admin/analytics/top-attractions?limit=${limit}`)
    return response.data
  },

  getTotalRevenue: async () => {
    const response = await api.get('/admin/analytics/revenue')
    return response.data
  },
}
