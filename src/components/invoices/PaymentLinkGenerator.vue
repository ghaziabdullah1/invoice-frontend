<template>
  <transition name="modal-fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="close"
    >
      <div
        class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col"
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex-shrink-0">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-white flex items-center gap-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5"
                />
              </svg>
              {{ $t('payment_links.title') }}
            </h3>
            <button @click="close" class="text-white/80 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6 overflow-y-auto space-y-6">
          <!-- خطأ عام -->
          <div
            v-if="error"
            class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2"
          >
            {{ error }}
          </div>

          <!-- إنشاء رابط جديد -->
          <div class="bg-gray-50 dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
            <p class="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
              {{ $t('payment_links.generate_new') }}
            </p>

            <!-- تبويب: الفاتورة كاملة / قسط محدد -->
            <div v-if="pendingInstallments.length" class="flex gap-2 mb-4">
              <button
                @click="target = 'invoice'"
                :class="[
                  'flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all',
                  target === 'invoice'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400',
                ]"
              >
                {{ $t('payment_links.full_invoice') }}
              </button>
              <button
                @click="target = 'installment'"
                :class="[
                  'flex-1 py-2 rounded-lg text-sm font-medium border-2 transition-all',
                  target === 'installment'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400',
                ]"
              >
                {{ $t('payment_links.specific_installment') }}
              </button>
            </div>

            <div v-if="target === 'installment' && pendingInstallments.length" class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                {{ $t('installments.title') }}
              </label>
              <select
                v-model.number="selectedInstallmentNumber"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm"
              >
                <option
                  v-for="inst in pendingInstallments"
                  :key="inst.id"
                  :value="inst.installment_number"
                >
                  #{{ inst.installment_number }} — {{ formatCurrency(inst.amount) }} ({{
                    formatDate(inst.due_date)
                  }})
                </option>
              </select>
            </div>

            <div v-else class="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{{
                  $t('payment_links.amount')
                }}</label>
                <input
                  v-model.number="form.amount"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{{
                  $t('payment_links.expires_in_days')
                }}</label>
                <input
                  v-model.number="form.expires_in_days"
                  type="number"
                  min="1"
                  max="60"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-sm"
                />
              </div>
            </div>

            <button
              @click="generate"
              :disabled="loading"
              class="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <span
                v-if="loading"
                class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white/40 border-t-white"
              ></span>
              {{ $t('payment_links.generate') }}
            </button>
          </div>

          <!-- الروابط الحالية -->
          <div>
            <p class="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
              {{ $t('payment_links.existing_links') }}
            </p>

            <div v-if="loading && !links.length" class="text-center py-6">
              <div
                class="inline-block animate-spin rounded-full h-6 w-6 border-4 border-indigo-200 border-t-indigo-600"
              ></div>
            </div>

            <div
              v-else-if="!links.length"
              class="text-center py-6 bg-gray-50 dark:bg-slate-900 rounded-xl border border-dashed border-gray-300 dark:border-slate-600"
            >
              <p class="text-gray-400 text-sm">{{ $t('payment_links.no_links') }}</p>
            </div>

            <ul v-else class="space-y-3">
              <li
                v-for="link in links"
                :key="link.id"
                class="border border-gray-200 dark:border-slate-700 rounded-xl p-3"
              >
                <div class="flex items-center justify-between mb-2">
                  <span class="font-semibold text-gray-900 dark:text-slate-100 text-sm">{{
                    formatCurrency(link.amount)
                  }}</span>
                  <span
                    class="px-2 py-0.5 rounded-full text-xs font-semibold"
                    :class="statusBadgeClass(link.status)"
                  >
                    {{ $t('payment_links.status.' + link.status) }}
                  </span>
                </div>

                <div class="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    readonly
                    :value="link.public_url"
                    class="flex-1 min-w-0 px-2 py-1.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-500 truncate"
                    @focus="$event.target.select()"
                  />
                  <button
                    @click="copyLink(link)"
                    class="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex-shrink-0"
                    :title="$t('payment_links.copy_link')"
                  >
                    <svg
                      v-if="copiedLinkId !== link.id"
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <svg
                      v-else
                      class="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                </div>

                <div v-if="link.status === 'active'" class="flex items-center gap-2">
                  <select
                    v-model="sendMethodByLink[link.id]"
                    class="flex-1 px-2 py-1.5 border border-gray-300 dark:border-slate-600 rounded-lg text-xs"
                  >
                    <option value="email">{{ $t('payment_links.via.email') }}</option>
                    <option value="sms">{{ $t('payment_links.via.sms') }}</option>
                    <option value="whatsapp">{{ $t('payment_links.via.whatsapp') }}</option>
                  </select>
                  <button
                    @click="send(link)"
                    class="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors text-xs font-medium"
                  >
                    {{ $t('payment_links.send') }}
                  </button>
                </div>
                <p v-if="link.sent_at" class="text-xs text-gray-400 mt-1">
                  {{ $t('payment_links.sent_via') }}:
                  {{ $t('payment_links.via.' + link.sent_via) }} · {{ formatDate(link.sent_at) }}
                </p>
                <p v-if="link.expires_at" class="text-xs text-gray-400 mt-1">
                  {{ $t('payment_links.expires_at') }}: {{ formatDate(link.expires_at) }}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { formatCurrency, formatDate } from '@/utils/formatters'

export default {
  name: 'PaymentLinkGenerator',
  props: {
    show: { type: Boolean, default: false },
    invoice: { type: Object, required: true },
    // مرّرها من InstallmentPlanSection عند فتح النافذة من زر قسط محدد
    initialInstallmentNumber: { type: [Number, null], default: null },
  },
  emits: ['close'],
  data() {
    return {
      target: 'invoice',
      selectedInstallmentNumber: null,
      form: {
        amount: this.invoice?.total ?? 0,
        expires_in_days: 7,
      },
      copiedLinkId: null,
      sendMethodByLink: {},
    }
  },
  computed: {
    ...mapState('paymentLinks', ['links', 'loading', 'error']),
    // خطة الأقساط الحالية مصدرها getter الموجود فعلاً في module الأقساط
    // (نفس getter الذي تعتمد عليه InstallmentPlanSection: currentPlan) —
    // وليس invoice.installmentPlan، لأن صفحة تفاصيل الفاتورة لا تُحمّل هذا
    // الحقل ضمن كائن invoice نفسه.
    ...mapGetters('installments', ['currentPlan']),
    pendingInstallments() {
      return (this.currentPlan?.installments || []).filter((i) => i.status === 'pending')
    },
  },
  watch: {
    show(value) {
      if (!value) return
      this.clearError()
      this.form.amount = this.invoice?.total ?? 0
      if (
        this.initialInstallmentNumber &&
        this.pendingInstallments.some((i) => i.installment_number === this.initialInstallmentNumber)
      ) {
        this.target = 'installment'
        this.selectedInstallmentNumber = this.initialInstallmentNumber
      } else {
        this.target = 'invoice'
        this.selectedInstallmentNumber = this.pendingInstallments[0]?.installment_number ?? null
      }
      if (this.invoice?.id) this.fetchInvoiceLinks(this.invoice.id)
    },
  },
  methods: {
    formatCurrency,
    formatDate,
    ...mapActions('paymentLinks', [
      'createForInvoice',
      'createForInstallment',
      'sendLink',
      'fetchInvoiceLinks',
      'clearError',
    ]),
    close() {
      this.$emit('close')
    },
    async generate() {
      try {
        if (this.target === 'installment' && this.selectedInstallmentNumber) {
          await this.createForInstallment({
            invoiceId: this.invoice.id,
            installmentNumber: this.selectedInstallmentNumber,
          })
        } else {
          await this.createForInvoice({
            invoiceId: this.invoice.id,
            data: {
              amount: this.form.amount,
              expires_in_days: this.form.expires_in_days,
            },
          })
        }
        this.$toast?.success(this.$t('payment_links.link_created'))
      } catch (e) {
        // الخطأ معروض بالفعل عبر state.error
      }
    },
    async send(link) {
      const method = this.sendMethodByLink[link.id] || 'email'
      try {
        await this.sendLink({ linkId: link.id, method })
        this.$toast?.success(this.$t('payment_links.link_sent'))
        await this.fetchInvoiceLinks(this.invoice.id)
      } catch (e) {
        // الخطأ معروض بالفعل عبر state.error
      }
    },
    async copyLink(link) {
      try {
        await navigator.clipboard.writeText(link.public_url)
        this.copiedLinkId = link.id
        this.$toast?.success(this.$t('payment_links.link_copied'))
        setTimeout(() => {
          if (this.copiedLinkId === link.id) this.copiedLinkId = null
        }, 2000)
      } catch (e) {
        // نسخ الحافظة غير متاح في هذا السياق
      }
    },
    statusBadgeClass(status) {
      const classes = {
        active: 'bg-blue-100 text-blue-700',
        paid: 'bg-green-100 text-green-700',
        expired: 'bg-gray-100 text-gray-500',
        cancelled: 'bg-red-100 text-red-600',
      }
      return classes[status] || 'bg-gray-100 text-gray-600'
    },
  },
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
