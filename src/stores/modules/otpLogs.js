// src/stores/modules/otpLogs.js
import axios from '@/api/axios'
import NProgress from 'nprogress'
import i18n from '@/plugins/i18n'

export default {
  namespaced: true,

  state: {
    logs: [],
    loading: false,
    error: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0,
    },
  },

  getters: {
    logs: (state) => state.logs,
    loading: (state) => state.loading,
    error: (state) => state.error,
    pagination: (state) => state.pagination,
  },

  mutations: {
    SET_LOGS(state, payload) {
      state.logs = payload.data || []
      state.pagination = {
        current_page: payload.current_page || 1,
        last_page: payload.last_page || 1,
        per_page: payload.per_page || 15,
        total: payload.total || 0,
        from: payload.from || 0,
        to: payload.to || 0,
      }
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
  },

  actions: {
    async fetchLogs({ commit }, params = {}) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)
      NProgress.start()

      try {
        const response = await axios.get('/admin/otp-logs', { params })

        if (response.data?.status) {
          commit('SET_LOGS', response.data.data)
        } else {
          commit('SET_ERROR', response.data?.message || i18n.global.t('otpLogs.fetch_error'))
        }
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || i18n.global.t('otpLogs.fetch_error'))
        throw error
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },
  },
}
