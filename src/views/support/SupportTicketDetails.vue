<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-slate-900 py-6 md:py-8"
  >
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Back Link -->
      <router-link
        to="/support/tickets"
        class="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-6 font-medium"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        {{ $t('support.back_to_tickets') || 'العودة للتذاكر' }}
      </router-link>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>

      <!-- Error -->
      <div
        v-else-if="error"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-8 text-center"
      >
        <svg
          class="w-12 h-12 text-red-500 mx-auto mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        <h3 class="text-lg font-bold text-red-700 dark:text-red-400 mb-2">
          {{ error === 'Unauthenticated.' ? $t('support.must_login') : $t('support.ticket_load_error_desc') }}
        </h3>
        <p class="text-sm text-red-600 dark:text-red-300 mb-4">{{ error }}</p>
        <div class="flex justify-center gap-3">
          <button
            v-if="error === 'Unauthenticated.'"
            @click="$router.push('/login')"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >{{ $t('auth.login') }}</button>
          <button
            v-else
            @click="fetchTicket(ticketId)"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >{{ $t('common.retry') }}</button>
        </div>
      </div>

      <!-- Empty -->
      <div
        v-else-if="!ticket"
        class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-12 text-center"
      >
        <p class="text-gray-500 dark:text-slate-400">{{ $t('support.no_ticket_data') }}</p>
      </div>

      <!-- Ticket Content -->
      <div v-else class="space-y-6">
        <!-- Ticket Header Card -->
        <div
          class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden"
        >
          <div
            class="px-6 py-5 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-gray-50/80 to-white dark:from-slate-800 dark:to-slate-800"
          >
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex items-center gap-3 flex-wrap">
                <span
                  class="font-mono text-sm font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg"
                  >{{ ticket.ticket_number }}</span
                >
                <span :class="statusBadgeClass(ticket.status)">{{
                  statusLabel(ticket.status)
                }}</span>
              </div>
              <div class="flex items-center gap-3 flex-wrap">
                <span :class="priorityBadgeClass(ticket.priority)">
                  <span class="w-1.5 h-1.5 rounded-full bg-current mr-1.5 inline-block"></span>
                  {{ priorityLabel(ticket.priority) }}
                </span>

                <!-- حقل تعديل الحالة + زر الحفظ -->
                <div class="flex items-center gap-2">
                  <div class="relative">
                    <select
                      v-model="pendingStatus"
                      :disabled="submitting"
                      class="pl-9 pr-4 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-50 cursor-pointer appearance-none"
                    >
                      <option value="open">{{ $t('support.open') || 'مفتوحة' }}</option>
                      <option value="in_progress">
                        {{ $t('support.in_progress') || 'قيد المعالجة' }}
                      </option>
                      <option value="closed">{{ $t('support.closed') || 'مغلقة' }}</option>
                    </select>
                    <svg
                      class="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  <!-- زر حفظ التعديلات -->
                  <button
                    v-if="pendingStatus !== ticket.status"
                    @click="handleSaveStatus"
                    :disabled="submitting"
                    class="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <svg
                      v-if="submitting"
                      class="animate-spin w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <svg
                      v-else
                      class="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2.5"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {{ $t('common.save') || 'حفظ' }}
                  </button>

                  <!-- زر إلغاء -->
                  <button
                    v-if="pendingStatus !== ticket.status"
                    @click="pendingStatus = ticket.status"
                    class="px-3 py-2 text-gray-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    {{ $t('common.cancel') || 'إلغاء' }}
                  </button>
                </div>

                <button
                  v-if="ticket.status !== 'closed'"
                  @click="handleClose"
                  class="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  {{ $t('support.close_ticket') || 'إغلاق التذكرة' }}
                </button>
              </div>
            </div>
          </div>
          <div class="p-6 md:p-8">
            <div class="flex items-start gap-4 mb-6">
              <div
                class="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold flex-shrink-0"
              >
                {{ getInitials(ticket.name) }}
              </div>
              <div class="flex-1">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                      {{ ticket.subject }}
                    </h2>
                    <p class="text-sm text-gray-500 dark:text-slate-400 mt-1">
                      {{ ticket.name }} · {{ ticket.email }} ·
                      {{ formatDateTime(ticket.created_at) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-slate-700/30 rounded-xl p-5"
            >
              <p class="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {{ ticket.message }}
              </p>
            </div>
          </div>
        </div>

        <!-- Replies -->
        <div v-if="ticket.replies && ticket.replies.length > 0" class="space-y-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
              />
            </svg>
            {{ $t('support.replies') || 'الردود' }} ({{ ticket.replies.length }})
          </h3>
          <div
            v-for="(reply, idx) in ticket.replies"
            :key="idx"
            class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6"
          >
            <div class="flex items-start gap-4">
              <div
                :class="[
                  'w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0',
                  reply.is_admin_reply
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                    : 'bg-gradient-to-br from-emerald-400 to-teal-500',
                ]"
              >
                {{ reply.is_admin_reply ? 'AD' : getInitials(reply.user?.name || ticket.name) }}
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="font-bold text-sm text-gray-900 dark:text-white">{{
                    reply.is_admin_reply
                      ? $t('support.admin') || 'الدعم الفني'
                      : reply.user?.name || ticket.name
                  }}</span>
                  <span
                    v-if="reply.is_admin_reply"
                    class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full"
                    >{{ $t('support.staff') || 'فريق الدعم' }}</span
                  >
                  <span class="text-xs text-gray-400">{{ formatDateTime(reply.created_at) }}</span>
                  <span v-if="reply.is_internal" class="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full">{{ $t('support.internal_note_short') }}</span>
                </div>
                <p
                  class="text-gray-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap"
                >
                  {{ reply.message }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Reply Form -->
        <div
          v-if="ticket.status !== 'closed'"
          class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 md:p-8"
        >
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg
              class="w-5 h-5 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
            {{ $t('support.add_reply') || 'إضافة رد' }}
          </h3>
          <form @submit.prevent="handleReply">
            <textarea
              v-model="replyMessage"
              rows="4"
              required
              :placeholder="$t('support.reply_placeholder') || 'اكتب ردك هنا...'"
              class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-all resize-none"
            ></textarea>
            <div class="flex justify-between items-center mt-4">
                            <div class="flex items-center gap-4">
                <label class="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300 cursor-pointer select-none">
                  <input type="checkbox" v-model="isInternal" class="rounded border-gray-300 dark:border-slate-600 text-amber-500 focus:ring-amber-500/30" />
                  {{ $t('support.internal_note') }}
                </label>
                <span class="text-xs text-gray-400">{{ replyMessage.length }}/2000</span>
              </div>
              <button
                type="submit"
                :disabled="submitting || !replyMessage.trim()"
                class="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:from-emerald-600 hover:to-teal-700 transition-all font-semibold text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <svg v-if="submitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{
                  submitting
                    ? $t('support.sending') || 'جاري الإرسال...'
                    : $t('support.send_reply') || 'إرسال الرد'
                }}
              </button>
            </div>
          </form>
        </div>

        <!-- Closed Notice -->
        <div
          v-else
          class="bg-gray-50 dark:bg-slate-700/30 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 text-center"
        >
          <svg
            class="w-12 h-12 text-gray-400 mx-auto mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="text-lg font-bold text-gray-700 dark:text-slate-300 mb-1">
            {{ $t('support.ticket_closed') || 'التذكرة مغلقة' }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-slate-400">
            {{
              $t('support.closed_desc') ||
              'تم إغلاق هذه التذكرة. يمكنك فتح تذكرة جديدة إذا كنت بحاجة لمزيد من المساعدة.'
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { listenTicket, listenStaff } from '@/utils/supportRealtime'

export default {
  name: 'SupportTicketDetails',

  data() {
    return {
      replyMessage: '',
      isInternal: false,
      pendingStatus: '',
    }
  },

  computed: {
    ...mapState('support', ['ticket', 'loading', 'submitting', 'error']),
    ticketId() {
      return parseInt(this.$route.params.id)
    },
  },

  watch: {
    // الحالة قد تتغير من البث دون استبدال كائن التذكرة كله
    'ticket.status'(s) {
      if (s) this.pendingStatus = s
    },
    ticket: {
      immediate: true,
      handler(newTicket) {
        if (newTicket) {
          this.pendingStatus = newTicket.status
        }
      },
    },
  },

  mounted() {
    this.fetchTicket(this.ticketId)
    this.unsubs = [
      listenTicket(this.ticketId, {
        onMessage: this.onRealtimeMessage,
        onTicketUpdated: this.onRealtimeTicket,
      }),
      // الملاحظات الداخلية تُبث لقناة الفريق فقط. غير الموظف يُرفض اشتراكه بصمت
      listenStaff({ onMessage: this.onRealtimeMessage }),
    ]
  },

  beforeUnmount() {
    if (this.unsubs) this.unsubs.forEach((u) => u())
  },

  methods: {
    ...mapActions('support', ['fetchTicket', 'replyToTicket', 'closeTicket', 'updateTicketStatus']),

    onRealtimeMessage(msg) {
      if (msg.ticket_id !== this.ticketId) return
      this.$store.commit('support/PUSH_REPLY', msg)
    },

    onRealtimeTicket(data) {
      if (data.id !== this.ticketId) return
      this.$store.commit('support/PATCH_TICKET', data)
    },

    async handleReply() {
      if (!this.replyMessage.trim()) return
      try {
        await this.replyToTicket({ id: this.ticketId, message: this.replyMessage, is_internal: this.isInternal })
        this.isInternal = false
        this.replyMessage = ''
      } catch (error) {
        if (error.response?.status === 401) {
          alert('انتهت الجلسة، سيتم تحويلك لتسجيل الدخول')
          this.$router.push('/login')
        }
      }
    },

    async handleClose() {
      if (!confirm(this.$t('support.confirm_close') || 'هل أنت متأكد من إغلاق التذكرة؟')) return
      try {
        await this.closeTicket(this.ticketId)
        this.pendingStatus = 'closed'
      } catch (error) {
        if (error.response?.status === 401) {
          this.$router.push('/login')
        }
      }
    },

    async handleSaveStatus() {
      try {
        await this.updateTicketStatus({ id: this.ticketId, status: this.pendingStatus })
      } catch (error) {
        if (error.response?.status === 401) {
          this.$router.push('/login')
        }
      }
    },

    getInitials(name) {
      if (!name) return '؟'
      return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },

    formatDateTime(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return new Intl.DateTimeFormat(this.$i18n.locale === 'ar' ? 'en-US' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    },

    statusBadgeClass(status) {
      const classes = {
        open: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50',
        in_progress:
          'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50',
        closed:
          'bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-600',
      }
      return `inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${classes[status] || classes.closed}`
    },

    statusLabel(status) {
      return this.$t('support.' + status) || status
    },

    priorityBadgeClass(priority) {
      const classes = {
        high: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
        medium: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
        low: 'bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-slate-400',
      }
      return `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${classes[priority] || classes.low}`
    },

    priorityLabel(priority) {
      return this.$t('support.' + priority) || priority
    },
  },
}
</script>
