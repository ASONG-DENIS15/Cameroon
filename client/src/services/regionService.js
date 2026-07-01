import api from './api'

/**
 * Region Services
 */

export const regionService = {
  getAllRegions: async () => {
    const response = await api.get('/regions')
    return response.data
  },

  getRegionById: async (id) => {
    const response = await api.get(`/regions/${id}`)
    return response.data
  },
}
