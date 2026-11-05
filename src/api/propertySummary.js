import api from './axios'

export default {
  getSummary: (params = {}) => api.get('/admin/properties/summary', { params }),
}
