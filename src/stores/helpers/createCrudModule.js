import { unwrapList } from '@/api/crud'

const emptyPagination = () => ({
  current_page: 1,
  last_page: 1,
  per_page: 10,
  total: 0,
  from: 0,
  to: 0,
})

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback

// مصنع Vuex module لموارد CRUD — كل مورد له ملف store خاص به يستدعي هذا المصنع
export default function createCrudModule(api) {
  return {
    namespaced: true,

    state: () => ({
      items: [],
      pagination: emptyPagination(),
      loading: false,
      error: null,
    }),

    getters: {
      items: (state) => state.items,
      pagination: (state) => state.pagination,
      loading: (state) => state.loading,
      error: (state) => state.error,
    },

    mutations: {
      SET_ITEMS(state, items) {
        state.items = items
      },
      SET_PAGINATION(state, pagination) {
        state.pagination = pagination
      },
      SET_LOADING(state, loading) {
        state.loading = loading
      },
      SET_ERROR(state, error) {
        state.error = error
      },
    },

    actions: {
      async fetchAll({ commit }, params = {}) {
        commit('SET_LOADING', true)
        commit('SET_ERROR', null)

        try {
          const response = await api.getAll(params)

          if (response?.data?.status === false) {
            throw new Error(response.data.message || 'Request failed')
          }

          const { items, pagination } = unwrapList(response)
          const finalPagination = pagination || {
            ...emptyPagination(),
            total: items.length,
            from: items.length ? 1 : 0,
            to: items.length,
          }

          commit('SET_ITEMS', items)
          commit('SET_PAGINATION', finalPagination)

          return { items, pagination: finalPagination }
        } catch (error) {
          commit('SET_ERROR', errorMessage(error, 'Request failed'))
          throw error
        } finally {
          commit('SET_LOADING', false)
        }
      },

      async fetchOne(_, id) {
        const response = await api.getOne(id)
        if (response?.data?.status === false) {
          throw new Error(response.data.message || 'Request failed')
        }
        return response.data.data
      },

      async create(_, payload) {
        const response = await api.create(payload)
        if (response?.data?.status === false) {
          throw new Error(response.data.message || 'Request failed')
        }
        return response.data.data
      },

      async update(_, { id, payload }) {
        const response = await api.update(id, payload)
        if (response?.data?.status === false) {
          throw new Error(response.data.message || 'Request failed')
        }
        return response.data.data
      },

      async remove(_, id) {
        const response = await api.delete(id)
        if (response?.data?.status === false) {
          throw new Error(response.data.message || 'Request failed')
        }
        return true
      },
    },
  }
}
