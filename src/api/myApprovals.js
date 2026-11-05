import axios from '@/api/axios'

const base = '/admin/my-approvals'

export default {
  getAll(params = {}) { return axios.get(base, { params }) },
  count() { return axios.get(`${base}/count`) },
  getOne(id) { return axios.get(`${base}/${id}`) },
  approve(id, signature) { return axios.post(`${base}/${id}/approve`, { signature }) },
  reject(id, reason, signature) { return axios.post(`${base}/${id}/reject`, { reason, signature }) },
}
