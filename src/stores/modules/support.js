import axios from '@/api/axios'

const state = {
  tickets: [],
  ticket: null,
  loading: false,
  submitting: false,
  error: null,
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  },
}

const getters = {
  openTickets: (state) => state.tickets.filter((t) => t.status === 'open'),
  closedTickets: (state) => state.tickets.filter((t) => t.status === 'closed'),
  inProgressTickets: (state) => state.tickets.filter((t) => t.status === 'in_progress'),
  hasTickets: (state) => state.tickets.length > 0,
}

const actions = {
  async fetchTickets({ commit }, params = {}) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const { data } = await axios.get('/admin/support/tickets', { params })
      // ✅ الشكل الموحّد: { status, message, data: { items, pagination } }
      commit('SET_TICKETS', data.data.items)
      commit('SET_PAGINATION', data.data.pagination)
    } catch (error) {
      commit('SET_ERROR', resolveErrorMessage(error, 'فشل في تحميل التذاكر'))
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // تحديث صامت للقائمة (بدون spinner) عند وصول حدث لحظي
  async refreshTickets({ commit }, params = {}) {
    try {
      const { data } = await axios.get('/admin/support/tickets', { params })
      commit('SET_TICKETS', data.data.items)
      commit('SET_PAGINATION', data.data.pagination)
    } catch (e) {
      // فشل التحديث الصامت لا يجب أن يزعج المستخدم
    }
  },

  async assignTicket({ commit }, { id, assigned_to }) {
    const { data } = await axios.patch(`/admin/support/tickets/${id}/assign`, { assigned_to })
    commit('SET_TICKET_ASSIGNEE', { id, assignedTo: data.data.assigned_to })
    return data
  },
  async trackTicket(_, { ticket_number, email }) {
    const { data } = await axios.get('/support/tickets/track', { params: { ticket_number, email } })
    return data.data
  },

  async fetchTicket({ commit }, id) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const { data } = await axios.get(`/admin/support/tickets/${id}`)
      commit('SET_TICKET', data.data)
    } catch (error) {
      commit('SET_ERROR', resolveErrorMessage(error, 'فشل في تحميل التذكرة'))
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createTicket({ commit }, ticketData) {
    commit('SET_SUBMITTING', true)
    try {
      const { data } = await axios.post('/support/tickets', ticketData)
      commit('ADD_TICKET', data.data)
      return data
    } catch (error) {
      commit('SET_ERROR', resolveErrorMessage(error, 'فشل في انشاء التذكرة'))
      throw error
    } finally {
      commit('SET_SUBMITTING', false)
    }
  },

  async replyToTicket({ commit }, { id, message, is_internal = false }) {
    commit('SET_SUBMITTING', true)
    try {
      const { data } = await axios.post(`/admin/support/tickets/${id}/replies`, { message, is_internal })
      // repository.reply() يرجّع data: { reply, replies, status }
      commit('SET_TICKET_REPLIES', { id, replies: data.data.replies || [] })
      if (data.data.status) commit('SET_TICKET_STATUS', { id, status: data.data.status })
      return data
    } catch (error) {
      commit('SET_ERROR', resolveErrorMessage(error, 'فشل في رد التذكرة'))
      throw error
    } finally {
      commit('SET_SUBMITTING', false)
    }
  },

  async closeTicket({ commit }, id) {
    try {
      const { data } = await axios.patch(`/admin/support/tickets/${id}/close`)
      // repository.updateStatus() يرجّع data: التذكرة كاملة
      const status = data.data?.status || 'closed'
      commit('UPDATE_TICKET_IN_LIST', { id, status })
      commit('SET_TICKET_STATUS', { id, status })
      return data
    } catch (error) {
      commit('SET_ERROR', resolveErrorMessage(error, 'فشل في تحديث حالة التذكرة'))
      throw error
    }
  },

  async updateTicketStatus({ commit }, { id, status }) {
    commit('SET_SUBMITTING', true)
    try {
      const { data } = await axios.patch(`/admin/support/tickets/${id}/status`, { status })
      const newStatus = data.data?.status || status
      commit('UPDATE_TICKET_IN_LIST', { id, status: newStatus })
      commit('SET_TICKET_STATUS', { id, status: newStatus })
      return data
    } catch (error) {
      commit('SET_ERROR', resolveErrorMessage(error, 'فشل في تحديث حالة التذكرة'))
      throw error
    } finally {
      commit('SET_SUBMITTING', false)
    }
  },
}

const mutations = {
  SET_TICKETS(state, tickets) { state.tickets = tickets },
  SET_TICKET(state, ticket) { state.ticket = ticket },
  ADD_TICKET(state, ticket) { state.tickets.unshift(ticket) },
  SET_TICKET_REPLIES(state, { id, replies }) {
    if (state.ticket && state.ticket.id === id) state.ticket.replies = replies
  },
  SET_TICKET_STATUS(state, { id, status }) {
    if (state.ticket && state.ticket.id === id) state.ticket.status = status
  },
  UPDATE_TICKET_IN_LIST(state, { id, status }) {
    const ticket = state.tickets.find((t) => t.id === id)
    if (ticket) ticket.status = status
  },
  // رد وارد من البث: يُضاف للتذكرة المفتوحة فقط، ويتجاهل المكرر
  PUSH_REPLY(state, msg) {
    if (!state.ticket || state.ticket.id !== msg.ticket_id) return
    if (!state.ticket.replies) state.ticket.replies = []
    if (state.ticket.replies.some((r) => r.id === msg.id)) return
    state.ticket.replies.push({
      id: msg.id,
      ticket_id: msg.ticket_id,
      user_id: msg.user_id,
      user: { id: msg.user_id, name: msg.sender_name },
      message: msg.message,
      is_admin_reply: msg.is_admin_reply,
      is_internal: msg.is_internal,
      created_at: msg.created_at,
    })
  },
  // تحديث حالة/أولوية/إسناد من البث
  PATCH_TICKET(state, data) {
    const fields = {
      status: data.status,
      priority: data.priority,
      assigned_to: data.assigned_to,
    }
    const inList = state.tickets.find((t) => t.id === data.id)
    if (inList) Object.assign(inList, fields)
    if (state.ticket && state.ticket.id === data.id) Object.assign(state.ticket, fields)
  },
  SET_LOADING(state, status) { state.loading = status },
  SET_SUBMITTING(state, status) { state.submitting = status },
  SET_ERROR(state, error) { state.error = error },
  SET_PAGINATION(state, pagination) { state.pagination = pagination },
}

function resolveErrorMessage(error, fallback) {
  if (error.response?.status === 401) return 'Unauthenticated.'
  return error.response?.data?.message || fallback
}

export default { namespaced: true, state, getters, actions, mutations }
