import { createStore } from 'vuex'

// Import modules
import auth from './modules/auth'
import clients from './modules/clients'
import invoices from './modules/invoices'
import recurringInvoices from './modules/recurringInvoices'
import users from './modules/users'
import adminGroups from './modules/adminGroups'
import permissions from './modules/permissions'
import report from './modules/report'
import dashboard from './modules/dashboard'
import invoiceManagement from './modules/invoiceManagement'
import assignPermissions from './modules/assignPermissions'
import payments from './modules/payments'
import groups from './modules/adminGroups'
import profile from './modules/profile'
import activity from './modules/activity'
import otpLogs from './modules/otpLogs'
import invoiceNotifications from './modules/invoiceNotifications'
import installments from './modules/installments'
import paymentLinks from './modules/paymentLinks'
import support from './modules/support'
import content from './modules/content'
import branch from './modules/branch'
import properties from './modules/properties'
import floors from './modules/floors'
import units from './modules/units'
import tenants from './modules/tenants'
import aiDrafts from './modules/aiDrafts'
import propertyScope from './modules/propertyScope'




export default createStore({
  state: {
    appLoading: false,
    appError: null,
    appSuccess: null,
    theme: localStorage.getItem('theme') || 'light'
  },
  mutations: {
    SET_APP_LOADING(state, loading) {
      state.appLoading = loading
    },
    SET_APP_ERROR(state, error) {
      state.appError = error
    },
    SET_APP_SUCCESS(state, success) {
      state.appSuccess = success
    },
    CLEAR_APP_MESSAGES(state) {
      state.appError = null
      state.appSuccess = null
    },
    SET_THEME(state, theme) {
      state.theme = theme
      localStorage.setItem('theme', theme)
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  },
  actions: {
    setAppLoading({ commit }, loading) {
      commit('SET_APP_LOADING', loading)
    },
    setAppError({ commit }, error) {
      commit('SET_APP_ERROR', error)
    },
    setAppSuccess({ commit }, success) {
      commit('SET_APP_SUCCESS', success)
    },
    clearAppMessages({ commit }) {
      commit('CLEAR_APP_MESSAGES')
    },
    toggleTheme({ commit, state }) {
      const newTheme = state.theme === 'light' ? 'dark' : 'light'
      commit('SET_THEME', newTheme)
    },
    initTheme({ commit, state }) {
      const savedTheme = localStorage.getItem('theme')
      const theme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      commit('SET_THEME', theme)
    }
  },
  getters: {
    appLoading: state => state.appLoading,
    appError: state => state.appError,
    appSuccess: state => state.appSuccess,
    theme: state => state.theme
  },
  modules: {
    auth: auth,
    clients: clients,
    invoices: invoices,
    recurringInvoices: recurringInvoices,
    users: users,
    adminGroups: adminGroups,
    permissions: permissions,
    report: report,
    dashboard: dashboard,
    invoiceManagement: invoiceManagement,
    assignPermissions: assignPermissions,
    payments: payments,
    groups: groups,
    profile: profile,
    activity: activity,
    otpLogs: otpLogs,
    invoiceNotifications: invoiceNotifications,
    installments: installments,
    paymentLinks: paymentLinks,
    support: support,
    content: content,
    branch: branch,
    properties,
    propertyScope,
    floors,
    units,
    tenants,
    aiDrafts,
  }
})
