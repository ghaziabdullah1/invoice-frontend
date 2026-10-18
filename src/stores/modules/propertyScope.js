import axios from '@/api/axios'
import propertyAccessApi from '@/api/propertyAccess'

const STORAGE_KEY = 'selectedPropertyId'

const applyHeader = (id) => {
  if (id) {
    axios.defaults.headers.common['X-Property-Id'] = id
  } else {
    delete axios.defaults.headers.common['X-Property-Id']
  }
}

const initialId = localStorage.getItem(STORAGE_KEY) || null
applyHeader(initialId)

export default {
  namespaced: true,

  state: () => ({
    properties: [],
    selectedPropertyId: initialId,
    defaultPropertyId: null,
    isSuperAdmin: false,
    loading: false,
  }),

  getters: {
    selectedProperty: (state) => state.properties.find((p) => p.id == state.selectedPropertyId) || null,
  },

  mutations: {
    SET_PROPERTIES(state, properties) {
      state.properties = properties
    },
    SET_DEFAULT(state, id) {
      state.defaultPropertyId = id
    },
    SET_IS_SUPER_ADMIN(state, value) {
      state.isSuperAdmin = value
    },
    SET_LOADING(state, value) {
      state.loading = value
    },
    SET_SELECTED(state, id) {
      state.selectedPropertyId = id
      if (id) {
        localStorage.setItem(STORAGE_KEY, id)
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
      applyHeader(id)
    },
  },

  actions: {
    async fetchMyProperties({ commit, state }) {
      commit('SET_LOADING', true)
      try {
        const { data } = await propertyAccessApi.getMyProperties()
        const payload = data?.data || {}
        const properties = payload.properties || []
        commit('SET_PROPERTIES', properties)
        commit('SET_DEFAULT', payload.default_property || null)
        commit('SET_IS_SUPER_ADMIN', !!payload.is_super_admin)

        const stillValid = properties.some((p) => p.id == state.selectedPropertyId)
        if (!stillValid) {
          commit('SET_SELECTED', properties.length ? payload.default_property || properties[0].id : null)
        }
      } finally {
        commit('SET_LOADING', false)
      }
    },

    selectProperty({ commit }, id) {
      commit('SET_SELECTED', id)
    },

    async fetchAssignable() {
      const { data } = await propertyAccessApi.getAssignable()
      return data?.data || []
    },
  },
}
