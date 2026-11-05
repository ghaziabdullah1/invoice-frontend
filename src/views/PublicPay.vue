<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4" dir="rtl">
    <div class="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-8 text-center">
      <div v-if="loading" class="py-10">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
      </div>

      <template v-else-if="info">
        <p class="text-sm text-gray-500 dark:text-slate-400 mb-1">فاتورة رقم</p>
        <h1 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ info.invoice_number || '-' }}</h1>
        <p v-if="info.client_name" class="text-sm text-gray-500 dark:text-slate-400 mb-6">{{ info.client_name }}</p>

        <p class="text-4xl font-extrabold text-gray-900 dark:text-white mb-1">{{ amountText }}</p>
        <p v-if="info.expires_at && info.state === 'active'" class="text-xs text-gray-400 mb-6">
          ينتهي الرابط: {{ dateText }}
        </p>

        <div v-if="justPaid || info.state === 'paid'" class="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 text-sm font-semibold">
          تم استلام الدفعة. شكراً لك.
        </div>
        <div v-else-if="waiting" class="rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 p-4 text-sm">
          جارٍ تأكيد الدفع، لحظات...
        </div>
        <div v-else-if="info.state === 'expired'" class="rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 p-4 text-sm">
          انتهت صلاحية هذا الرابط. تواصل مع الجهة المرسلة للحصول على رابط جديد.
        </div>
        <div v-else-if="info.state === 'cancelled'" class="rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 p-4 text-sm">
          هذا الرابط لم يعد صالحاً (تم استبداله برابط أحدث).
        </div>
        <template v-else>
          <p v-if="$route.query.payment === 'cancelled'" class="text-sm text-amber-600 mb-3">لم تكتمل عملية الدفع.</p>
          <p v-if="error" class="text-sm text-red-500 mb-3">{{ error }}</p>
          <button @click="pay" :disabled="paying"
            class="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/25 disabled:opacity-50">
            {{ paying ? 'جارٍ التحويل...' : 'ادفع الآن' }}
          </button>
        </template>
      </template>

      <div v-else class="py-6 text-gray-600 dark:text-slate-300">
        <p class="font-semibold mb-1">الرابط غير موجود</p>
        <p class="text-sm">تأكد من الرابط أو تواصل مع الجهة المرسلة.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

export default {
  name: 'PublicPay',
  data() {
    return { loading: true, info: null, paying: false, error: null, waiting: false, justPaid: false, pollTimer: null, polls: 0 }
  },
  computed: {
    token() { return this.$route.params.token },
    amountText() {
      if (!this.info) return ''
      const digits = ['KWD', 'BHD', 'OMR', 'JOD', 'TND'].includes(this.info.currency) ? 3 : 2
      return `${Number(this.info.amount).toFixed(digits)} ${this.info.currency}`
    },
    dateText() {
      return new Intl.DateTimeFormat('ar', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(this.info.expires_at))
    },
  },
  async mounted() {
    await this.load()
    // عند العودة من Stripe نتحقق حتى يصل الـ webhook
    if (this.$route.query.payment === 'success' && this.info && this.info.state !== 'paid') {
      this.waiting = true
      this.pollTimer = setInterval(this.poll, 3000)
    }
  },
  beforeUnmount() { clearInterval(this.pollTimer) },
  methods: {
    async load() {
      try {
        const { data } = await axios.get(`/payment-links/${this.token}/public`)
        this.info = data.data
      } catch (e) {
        this.info = null
      } finally {
        this.loading = false
      }
    },
    async poll() {
      this.polls++
      await this.load()
      if (this.info && this.info.state === 'paid') {
        this.justPaid = true; this.waiting = false; clearInterval(this.pollTimer)
      } else if (this.polls >= 10) {
        this.waiting = false; clearInterval(this.pollTimer)
        this.error = 'لم يصلنا التأكيد بعد. إن تم الخصم فسيظهر الدفع قريباً.'
      }
    },
    async pay() {
      this.paying = true; this.error = null
      try {
        const { data } = await axios.post(`/payment-links/${this.token}/checkout`)
        window.location.href = data.data.url
      } catch (e) {
        this.error = e.response?.data?.message || 'تعذر بدء الدفع'
        this.paying = false
      }
    },
  },
}
</script>
