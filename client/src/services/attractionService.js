import api from './api'

/**
 * Attraction Services
 */

export const attractionService = {
  getAllAttractions: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters,
    })
    const response = await api.get(`/attractions?${params}`)
    return response.data
  },

  getFeaturedAttractions: async (limit = 6) => {
    const response = await api.get(`/attractions/featured?limit=${limit}`)
    return response.data
  },

  getAttractionById: async (id) => {
    const response = await api.get(`/attractions/${id}`)
    return response.data
  },

  searchAttractions: async (q, limit = 10) => {
    const response = await api.get(`/attractions/search?q=${q}&limit=${limit}`)
    return response.data
  },

  createAttraction: async (formData) => {
    const response = await api.post('/attractions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  updateAttraction: async (id, formData) => {
    const response = await api.put(`/attractions/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  deleteAttraction: async (id) => {
    const response = await api.delete(`/attractions/${id}`)
    return response.data
  },
}
