<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-6 md:py-10">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-5">
        <h1 class="text-2xl font-extrabold text-gray-900 dark:text-white">تذاكري</h1>
        <router-link to="/support" class="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/25">
          محادثة جديدة
        </router-link>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 h-[75vh]">
        <!-- القائمة -->
        <div :class="['md:col-span-1 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-y-auto', selected ? 'hidden md:block' : '']">
          <div v-if="loading" class="flex justify-center py-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
          <p v-else-if="listError" class="p-6 text-center text-sm text-red-500">{{ listError }}</p>
          <p v-else-if="!tickets.length" class="p-6 text-center text-sm text-gray-500 dark:text-slate-400">لا توجد تذاكر بعد</p>
          <button
            v-for="t in tickets" :key="t.id" @click="openTicket(t.id)"
            :class="['w-full text-start px-4 py-3 border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/40 transition-colors',
                     selected && selected.id === t.id ? 'bg-emerald-50 dark:bg-emerald-900/20' : '']"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="font-mono text-xs font-bold text-gray-700 dark:text-slate-300">{{ t.ticket_number }}</span>
              <span :class="statusClass(t.status)">{{ statusLabel(t.status) }}</span>
            </div>
            <p class="text-sm font-semibold text-gray-900 dark:text-white truncate mt-1">{{ t.subject }}</p>
            <p class="text-xs text-gray-500 dark:text-slate-400 truncate mt-0.5">{{ t.last_message || t.message }}</p>
          </button>
        </div>

        <!-- المحادثة -->
        <div :class="['md:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden', selected ? '' : 'hidden md:flex']">
          <div v-if="!selected" class="flex-1 flex items-center justify-center text-gray-400 dark:text-slate-500 text-sm">
            اختر تذكرة لعرض المحادثة
          </div>
          <template v-else>
            <div class="px-5 py-3 border-b border-gray-100 dark:border-slate-700 flex items-center gap-3">
              <button class="md:hidden text-gray-500" @click="closeTicket">←</button>
              <div class="min-w-0 flex-1">
                <p class="font-bold text-gray-900 dark:text-white truncate">{{ selected.subject }}</p>
                <p class="text-xs text-gray-500 dark:text-slate-400">
                  {{ selected.ticket_number }}<span v-if="selected.assigned_to_name || (selected.assigned_to && selected.assigned_to.name)"> · يتولاها {{ selected.assigned_to_name || selected.assigned_to.name }}</span>
                </p>
              </div>
              <span :class="statusClass(selected.status)">{{ statusLabel(selected.status) }}</span>
            </div>

            <div ref="msgs" class="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50/60 dark:bg-slate-900/30">
              <div class="flex justify-end">
                <div class="max-w-[80%] rounded-2xl px-4 py-2.5 bg-emerald-600 text-white text-sm whitespace-pre-wrap">{{ selected.message }}</div>
              </div>
              <div v-for="r in selected.replies" :key="r.id" :class="['flex', r.is_admin_reply ? 'justify-start' : 'justify-end']">
                <div :class="['max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap',
                              r.is_admin_reply ? 'bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 border border-gray-100 dark:border-slate-600' : 'bg-emerald-600 text-white']">
                  <p v-if="r.is_admin_reply" class="text-xs font-bold mb-1 opacity-70">{{ (r.user && r.user.name) || 'الدعم الفني' }}</p>
                  {{ r.message }}
                  <p class="text-[10px] opacity-60 mt-1">{{ formatTime(r.created_at) }}</p>
                </div>
              </div>
            </div>

            <div v-if="selected.status !== 'closed'" class="p-3 border-t border-gray-100 dark:border-slate-700">
              <p v-if="sendError" class="text-xs text-red-500 mb-1">{{ sendError }}</p>
              <div class="flex items-end gap-2">
                <textarea
                  v-model="text" rows="2" maxlength="2000" placeholder="اكتب رسالتك... (Enter للإرسال، Shift+Enter لسطر جديد)"
                  @keydown.enter.exact.prevent="send"
                  class="flex-1 px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white text-sm resize-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                ></textarea>
                <button @click="send" :disabled="sending || !text.trim()" class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold disabled:opacity-50">
                  {{ sending ? '...' : 'إرسال' }}
                </button>
              </div>
            </div>
            <div v-else class="p-4 border-t border-gray-100 dark:border-slate-700 text-center text-sm text-gray-500 dark:text-slate-400">
              هذه التذكرة مغلقة. يمكنك بدء محادثة جديدة إذا احتجت مساعدة.
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'
import { listenTicket, listenUser } from '@/utils/supportRealtime'

export default {
  name: 'MyTickets',

  data() {
    return {
      tickets: [], loading: false, listError: null,
      selected: null, text: '', sending: false, sendError: null,
      unlistenUser: null, unlistenTicket: null, refreshTimeout: null,
    }
  },

  mounted() {
    this.loadTickets()
    const userId = this.currentUserId()
    if (userId) {
      this.unlistenUser = listenUser(userId, {
        onTicketCreated: this.scheduleRefresh,
        onTicketUpdated: this.onTicketUpdated,
      })
    }
    if (this.$route.query.id) this.openTicket(Number(this.$route.query.id))
  },

  beforeUnmount() {
    clearTimeout(this.refreshTimeout)
    if (this.unlistenUser) this.unlistenUser()
    if (this.unlistenTicket) this.unlistenTicket()
  },

  methods: {
    currentUserId() {
      try { return JSON.parse(localStorage.getItem('user') || 'null')?.id || null } catch (e) { return null }
    },

    async loadTickets(silent = false) {
      if (!silent) this.loading = true
      try {
        const { data } = await axios.get('/support/my-tickets')
        this.tickets = data.data.items
        this.listError = null
      } catch (e) {
        if (!silent) this.listError = e.response?.data?.message || 'فشل تحميل التذاكر'
      } finally {
        this.loading = false
      }
    },

    scheduleRefresh() {
      clearTimeout(this.refreshTimeout)
      this.refreshTimeout = setTimeout(() => this.loadTickets(true), 400)
    },

    onTicketUpdated(data) {
      if (this.selected && this.selected.id === data.id) {
        this.selected.status = data.status
        this.selected.priority = data.priority
      }
      this.scheduleRefresh()
    },

    async openTicket(id) {
      try {
        const { data } = await axios.get(`/support/my-tickets/${id}`)
        this.selected = data.data
        if (this.unlistenTicket) this.unlistenTicket()
        this.unlistenTicket = listenTicket(id, {
          onMessage: this.onRealtimeMessage,
          onTicketUpdated: this.onTicketUpdated,
        })
        this.sendError = null
        this.scrollDown()
      } catch (e) {
        this.listError = e.response?.data?.message || 'تعذر فتح التذكرة'
      }
    },

    closeTicket() {
      if (this.unlistenTicket) this.unlistenTicket()
      this.unlistenTicket = null
      this.selected = null
    },

    onRealtimeMessage(msg) {
      // احتياط: الملاحظات الداخلية لا تظهر للمستخدم أبدا
      if (msg.is_internal || !this.selected || msg.ticket_id !== this.selected.id) return
      this.addReply({
        id: msg.id, ticket_id: msg.ticket_id, message: msg.message,
        is_admin_reply: msg.is_admin_reply, created_at: msg.created_at,
        user: { id: msg.user_id, name: msg.sender_name },
      })
      this.scheduleRefresh()
    },

    addReply(reply) {
      if (!this.selected.replies) this.selected.replies = []
      if (this.selected.replies.some((r) => r.id === reply.id)) return
      this.selected.replies.push(reply)
      this.scrollDown()
    },

    async send() {
      const message = this.text.trim()
      if (!message || this.sending || !this.selected) return
      this.sending = true
      this.sendError = null
      try {
        const { data } = await axios.post(`/support/my-tickets/${this.selected.id}/replies`, { message })
        this.selected.replies = data.data.replies
        this.text = ''
        this.scrollDown()
        this.scheduleRefresh()
      } catch (e) {
        this.sendError = e.response?.data?.message || 'فشل إرسال الرسالة'
      } finally {
        this.sending = false
      }
    },

    scrollDown() {
      this.$nextTick(() => {
        const el = this.$refs.msgs
        if (el) el.scrollTop = el.scrollHeight
      })
    },

    formatTime(d) {
      if (!d) return ''
      return new Intl.DateTimeFormat(this.$i18n?.locale === 'ar' ? 'ar-SA' : 'en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      }).format(new Date(d))
    },

    statusLabel(s) { return { open: 'مفتوحة', in_progress: 'قيد المعالجة', closed: 'مغلقة' }[s] || s },
    statusClass(s) {
      const c = {
        open: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        in_progress: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        closed: 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400',
      }
      return `inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${c[s] || c.closed}`
    },
  },
}
</script>
