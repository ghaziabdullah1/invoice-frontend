import axios from '@/api/axios'

const base = '/admin/approval-workflows'

export default {
  getAll() { return axios.get(base) },
  getOne(key) { return axios.get(`${base}/${encodeURIComponent(key)}`) },
  save(data) { return axios.post(`${base}/save`, data) },
  remove(key) { return axios.delete(`${base}/${encodeURIComponent(key)}`) },
}
