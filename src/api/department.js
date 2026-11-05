import axios from '@/api/axios'

const base = '/admin/departments'

export default {
  getAll(params = {}) { return axios.get(base, { params }) },
  getOne(id) { return axios.get(`${base}/${id}`) },
  create(data) { return axios.post(base, data) },
  update(id, data) { return axios.put(`${base}/${id}`, data) },
  remove(id) { return axios.delete(`${base}/${id}`) },
}
