import axios from './axios'

// مسودات الموظف الذكي: اعتماد وإرسال، رفض، وإعادة المحادثة للبوت
export default {
  getAll(params = {}) {
    return axios.get('/admin/ai-drafts', { params })
  },
  approve(id, body = null) {
    return axios.post(`/admin/ai-drafts/${id}/approve`, body ? { body } : {})
  },
  reject(id) {
    return axios.post(`/admin/ai-drafts/${id}/reject`)
  },
  resumeBot(conversationId) {
    return axios.post(`/admin/ai-conversations/${conversationId}/resume-bot`)
  },
}
