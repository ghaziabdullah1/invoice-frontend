import axios from './axios'

export default {
  getAll: (params = {}) => axios.get('/admin/contracts', { params }),
  getOne: (id) => axios.get(`/admin/contracts/${id}`),
  create: (data) => axios.post('/admin/contracts', data),
  update: (id, data) => axios.put(`/admin/contracts/${id}`, data),
  remove: (id) => axios.delete(`/admin/contracts/${id}`),
  renew: (id, data) => axios.post(`/admin/contracts/${id}/renew`, data),
  terminate: (id, data) => axios.post(`/admin/contracts/${id}/terminate`, data),
  uploadDocument: (id, file) => {
    const form = new FormData()
    form.append('document', file)
    // الترويسة الصريحة تمنع تحويل FormData إلى JSON بسبب الترويسة الافتراضية للنسخة
    return axios.post(`/admin/contracts/${id}/document`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  downloadDocument: (id) => axios.get(`/admin/contracts/${id}/document`, { responseType: 'blob' }),
  schedule: (id) => axios.get(`/admin/contracts/${id}/schedule`),
  generateInvoice: (id, number, data = {}) => axios.post(`/admin/contracts/${id}/invoices/${number}`, data),
}
