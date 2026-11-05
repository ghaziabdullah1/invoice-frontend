import axios from './axios'
import { createCrudApi } from './crud'

const base = createCrudApi('/admin/suppliers')

// الباكند يرجع { items, pagination }؛ نحوّله إلى الشكل الذي يفهمه unwrapList (Paginator)
const adapt = (response) => {
  const d = response?.data?.data
  if (d && Array.isArray(d.items)) {
    response.data.data = { data: d.items, ...(d.pagination || {}) }
  }
  return response
}

export default {
  ...base,
  getAll: (params = {}) => axios.get('/admin/suppliers', { params }).then(adapt),
}
