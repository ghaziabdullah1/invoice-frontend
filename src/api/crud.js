import axios from './axios'

// مصنع API بسيط لموارد CRUD (عقارات / طوابق / وحدات / مستأجرين)
export function createCrudApi(endpoint) {
  return {
    getAll(params = {}) {
      return axios.get(endpoint, { params })
    },
    getOne(id) {
      return axios.get(`${endpoint}/${id}`)
    },
    create(data) {
      return axios.post(endpoint, data)
    },
    update(id, data) {
      return axios.put(`${endpoint}/${id}`, data)
    },
    delete(id) {
      return axios.delete(`${endpoint}/${id}`)
    },
  }
}

// يستخرج القائمة والترقيم من استجابة الـ API (مصفوفة مباشرة، أو Paginator، أو { items, pagination })
export function unwrapList(response) {
  const payload = response?.data?.data

  if (Array.isArray(payload)) {
    return { items: payload, pagination: null }
  }

  if (payload && Array.isArray(payload.data)) {
    return {
      items: payload.data,
      pagination: {
        current_page: payload.current_page || 1,
        last_page: payload.last_page || 1,
        per_page: payload.per_page || 10,
        total: payload.total || 0,
        from: payload.from || 0,
        to: payload.to || 0,
      },
    }
  }

  // الشكل المستخدم في وحدة المشتريات: { items: [...], pagination: {...} }
  if (payload && Array.isArray(payload.items)) {
    const p = payload.pagination || {}
    const items = payload.items
    return {
      items,
      pagination: payload.pagination
        ? {
            current_page: p.current_page || 1,
            last_page: p.last_page || 1,
            per_page: p.per_page || 10,
            total: p.total ?? items.length,
            from: p.from || (items.length ? 1 : 0),
            to: p.to || items.length,
          }
        : null,
    }
  }

  return { items: [], pagination: null }
}
