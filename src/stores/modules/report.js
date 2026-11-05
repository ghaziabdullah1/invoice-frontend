// src/stores/modules/report.js
import axios from '@/api/axios'
import NProgress from 'nprogress'
import i18n from '@/plugins/i18n'

export default {
  namespaced: true,

  state: {
    loading: false,
    exportLoading: false,
    error: null,
    activeTab: 'invoices',
    showExportModal: false,
    showExportedFiles: false,
    clients: [],
    exportedFiles: [],
    filters: {
      start_date: '',
      end_date: '',
      status: '',
      client_id: '',
      user_id: '',
      search: '',
      per_page: 20,
      page: 1,
    },
    reports: {
      invoices: { items: [], stats: {}, pagination: { current_page: 1, last_page: 1, per_page: 20, total: 0, from: 0, to: 0 } },
      clients: { items: [], stats: {}, pagination: { current_page: 1, last_page: 1, per_page: 20, total: 0, from: 0, to: 0 } },
      revenue: { items: [], stats: {}, pagination: { current_page: 1, last_page: 1, per_page: 20, total: 0, from: 0, to: 0 } },
      overdue: { items: [], stats: {}, pagination: { current_page: 1, last_page: 1, per_page: 20, total: 0, from: 0, to: 0 } },
      aging: { items: [], stats: {}, pagination: { current_page: 1, last_page: 1, per_page: 20, total: 0, from: 0, to: 0 } },
    },
  },

  getters: {
    overdueCount: state => {
      return state.reports.overdue.items?.length || 0
    },
  },

  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_EXPORT_LOADING(state, loading) {
      state.exportLoading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_ERROR(state) {
      state.error = null
    },
    SET_ACTIVE_TAB(state, tab) {
      state.activeTab = tab
    },
    SET_FILTERS(state, filters) {
      state.filters = { ...state.filters, ...filters }
    },
    RESET_FILTERS(state) {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)
      state.filters = {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: '',
        client_id: '',
        user_id: '',
        search: '',
        per_page: 20,
        page: 1,
      }
    },
    SET_REPORT_DATA(state, { type, data }) {
      if (state.reports[type]) {
        state.reports[type] = {
          items: data.items || [],
          stats: data.stats || {},
          pagination: data.pagination || { current_page: 1, last_page: 1, per_page: 20, total: 0, from: 0, to: 0 },
        }
      }
    },
    SET_EXPORTED_FILES(state, files) {
      state.exportedFiles = files || []
    },
    SET_SHOW_EXPORT_MODAL(state, show) {
      state.showExportModal = show
    },
    SET_SHOW_EXPORTED_FILES(state, show) {
      state.showExportedFiles = show
    },
    SET_CLIENTS(state, clients) {
      state.clients = clients || []
    },
  },

  actions: {
    // ── Initialization ─────────────────────────────────────
    async init({ dispatch, commit }) {
      commit('RESET_FILTERS')
      await dispatch('fetchClients')
      await dispatch('loadReport')
    },

    // ── Fetch clients for filter dropdown ──────────────────
    async fetchClients({ commit }) {
      try {
        const response = await axios.get('/admin/clients')
        const clients = response.data?.data || response.data || []
        commit('SET_CLIENTS', clients)
      } catch (error) {
        console.error('Failed to fetch clients:', error)
      }
    },

    // ── Load report based on active tab ─────────────────────
    async loadReport({ state, commit }) {
      commit('SET_LOADING', true)
      commit('CLEAR_ERROR')
      NProgress.start()

      try {
        const endpoint = `/admin/reports/${state.activeTab}`
        const params = { ...state.filters }

        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key]
          }
        })

        const response = await axios.get(endpoint, { params })

        if (response.data.success) {
          commit('SET_REPORT_DATA', {
            type: state.activeTab,
            data: response.data.data || {},
          })
        } else {
          throw new Error(response.data.message || i18n.global.t('reports.load_failed'))
        }
      } catch (error) {
        const message = error.response?.data?.message || error.message || i18n.global.t('reports.load_failed')
        commit('SET_ERROR', message)
      } finally {
        NProgress.done()
        commit('SET_LOADING', false)
      }
    },

    // ── Switch tab ──────────────────────────────────────────
    async switchTab({ commit, dispatch }, tab) {
      commit('SET_ACTIVE_TAB', tab)
      commit('SET_FILTERS', { page: 1 })
      await dispatch('loadReport')
    },

    // ── Handle page change ─────────────────────────────────
    async handlePageChange({ commit, dispatch }, page) {
      commit('SET_FILTERS', { page })
      await dispatch('loadReport')
    },

    // ── Reset filters ────────────────────────────────────────
    async resetFilters({ commit, dispatch }) {
      commit('RESET_FILTERS')
      await dispatch('loadReport')
    },

    // ── Search with debounce helper ─────────────────────────────────
    onSearch({ commit, dispatch }, search) {
      commit('SET_FILTERS', { search, page: 1 })
      dispatch('loadReport')
    },

    clearSearch({ commit, dispatch }) {
      commit('SET_FILTERS', { search: '', page: 1 })
      dispatch('loadReport')
    },

    // ── Export modal ────────────────────────────────────────
    openExportModal({ commit }) {
      commit('SET_SHOW_EXPORT_MODAL', true)
    },
    closeExportModal({ commit }) {
      commit('SET_SHOW_EXPORT_MODAL', false)
    },

    // ── Direct export (download) ────────────────────────────
    async handleDirectExport({ state, commit }) {
      commit('SET_EXPORT_LOADING', true)
      try {
        const params = {
          ...state.filters,
          download: 1,
          lang: i18n.global.locale?.value || 'ar',
        }
        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key]
          }
        })

        const response = await axios.get(
          `/admin/reports/export/${state.activeTab}`,
          { params, responseType: 'blob' }
        )

        if (response.data && response.data.type && response.data.type.includes('json')) {
          const body = JSON.parse(await response.data.text())
          throw new Error(body.message || 'export failed')
        }
        const blob = new Blob([response.data])
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        const reportNames = {
          invoices: 'تقرير_الفواتير',
          clients: 'تقرير_العملاء',
          revenue: 'تقرير_الإيرادات',
          overdue: 'تقرير_المتأخرات',
        }
        link.setAttribute('download', `${reportNames[state.activeTab] || 'report'}_${new Date().toISOString().split('T')[0]}.xlsx`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (error) {
        let detail = ''
        try {
          const d = error.response && error.response.data
          detail = d instanceof Blob ? (JSON.parse(await d.text()).message || '') : (error.message || '')
        } catch (e) { }
        commit('SET_ERROR', i18n.global.t('reports.export_failed') + (detail ? ': ' + detail : ''))
        throw error
      } finally {
        commit('SET_EXPORT_LOADING', false)
      }
    },

    // ── Server export (save to server) ──────────────────────
    async handleServerExport({ state, commit, dispatch }) {
      commit('SET_EXPORT_LOADING', true)
      try {
        const params = {
          ...state.filters,
          lang: i18n.global.locale?.value || 'ar',
        }
        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key]
          }
        })

        const response = await axios.get(
          `/admin/reports/export/${state.activeTab}`,
          { params }
        )

        if (response.data.success) {
          await dispatch('refreshExportedFiles')
        } else {
          throw new Error(response.data.message)
        }
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || i18n.global.t('reports.export_failed'))
        throw error
      } finally {
        commit('SET_EXPORT_LOADING', false)
      }
    },

    // ── Exported files ──────────────────────────────────────
    async toggleExportedFiles({ state, commit, dispatch }) {
      const newValue = !state.showExportedFiles
      commit('SET_SHOW_EXPORTED_FILES', newValue)
      if (newValue) {
        await dispatch('refreshExportedFiles')
      }
    },

    async refreshExportedFiles({ commit }) {
      try {
        const response = await axios.get('/admin/reports/exported-files')
        if (response.data.success) {
          commit('SET_EXPORTED_FILES', response.data.data || [])
        }
      } catch (error) {
        console.error('Failed to fetch exported files:', error)
      }
    },

    async deleteExportedFile({ /*commit,*/ dispatch }, fileName) {
      try {
        await axios.delete('/admin/reports/exported-files/delete', {
          data: { file_name: fileName }
        })
        await dispatch('refreshExportedFiles')
      } catch (error) {
        throw new Error(error.response?.data?.message || i18n.global.t('errors.deleteFailed'))
      }
    },

    // ── Send reminder ─────────────────────────────────────
    async sendReminder({ commit, dispatch }, invoiceId) {
      try {
        const response = await axios.post(`/admin/reports/send-reminder/${invoiceId}`)
        if (response.data.success) {
          await dispatch('loadReport')
          return response.data
        }
        throw new Error(response.data.message)
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || i18n.global.t('reports.reminder_failed'))
        throw error
      }
    },

    // ── Mark as paid ────────────────────────────────────────
    async markAsPaid({ commit, dispatch }, invoiceId) {
      try {
        const response = await axios.post(`/admin/reports/mark-paid/${invoiceId}`)
        if (response.data.success) {
          await dispatch('loadReport')
          return response.data
        }
        throw new Error(response.data.message)
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || i18n.global.t('reports.mark_paid_failed'))
        throw error
      }
    },

    clearError({ commit }) {
      commit('CLEAR_ERROR')
    },
  },
}