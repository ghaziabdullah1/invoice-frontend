import axios from '@/api/axios'

const base = '/admin/purchase-orders'

export default {
  getAll(params = {}) { return axios.get(base, { params }) },
  getOne(id) { return axios.get(`${base}/${id}`) },
  create(payload) { return axios.post(base, payload) },
  update(id, payload) { return axios.put(`${base}/${id}`, payload) },
  remove(id) { return axios.delete(`${base}/${id}`) },
  submit(id) { return axios.post(`${base}/${id}/submit`) },
  approve(id, signature) { return axios.post(`${base}/${id}/approve`, { signature }) },
  reject(id, reason, signature) { return axios.post(`${base}/${id}/reject`, { reason, signature }) },
  send(id) { return axios.post(`${base}/${id}/send`) },
  receive(id, payload) { return axios.post(`${base}/${id}/receive`, payload) },
  cancel(id, reason) { return axios.post(`${base}/${id}/cancel`, { reason }) },

  // المرفقات
  attachments(id) { return axios.get(`${base}/${id}/attachments`) },
  uploadAttachment(id, file) {
    const fd = new FormData()
    fd.append('file', file)
    return axios.post(`${base}/${id}/attachments`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  deleteAttachment(id, attachmentId) {
    return axios.delete(`${base}/${id}/attachments/${attachmentId}`)
  },
}
