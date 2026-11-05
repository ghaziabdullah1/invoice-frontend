import aiDraftApi from '@/api/aiDraft'

const errorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback

const emptyPagination = () => ({
  current_page: 1,
  last_page: 1,
  per_page: 20,
  total: 0,
  from: 0,
  to: 0,
})

// استجابة الـ API هنا: { status, message, data: { items, pagination } }
// لذلك لا نستخدم unwrapList الخاصة بالـ Paginator
export default {
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
        const response = await aiDraftApi.getAll(params)
        if (response?.data?.status === false) {
          throw new Error(response.data.message || 'Request failed')
        }

        const payload = response?.data?.data || {}
        const items = payload.items || []
        const p = payload.pagination || {}
        const from = items.length ? (p.current_page - 1) * p.per_page + 1 : 0

        commit('SET_ITEMS', items)
        commit('SET_PAGINATION', {
          ...emptyPagination(),
          ...p,
          from,
          to: items.length ? from + items.length - 1 : 0,
        })
      } catch (error) {
        commit('SET_ERROR', errorMessage(error, 'Request failed'))
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async approve(_, { id, body }) {
      const response = await aiDraftApi.approve(id, body)
      if (response?.data?.status === false) {
        throw new Error(response.data.message || 'Request failed')
      }
      return response.data.data
    },

    async reject(_, id) {
      const response = await aiDraftApi.reject(id)
      if (response?.data?.status === false) {
        throw new Error(response.data.message || 'Request failed')
      }
      return response.data.data
    },

    async resumeBot(_, conversationId) {
      const response = await aiDraftApi.resumeBot(conversationId)
      if (response?.data?.status === false) {
        throw new Error(response.data.message || 'Request failed')
      }
      return response.data.data
    },
  },
}
