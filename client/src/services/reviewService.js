import api from './api'

/**
 * Review Services
 */

export const reviewService = {
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData)
    return response.data
  },

  getAttractionReviews: async (attractionId, page = 1, limit = 10) => {
    const response = await api.get(`/reviews/attraction/${attractionId}?page=${page}&limit=${limit}`)
    return response.data
  },

  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData)
    return response.data
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`)
    return response.data
  },
}
