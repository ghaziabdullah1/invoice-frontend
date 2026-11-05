<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-[60] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="!acting && $emit('close')"
    >
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-4xl max-h-[92vh] overflow-y-auto p-6">
        <div v-if="loading || !order" class="py-16 text-center">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
        </div>

        <template v-else>
          <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-slate-100">{{ order.po_number }}</h3>
              <p class="text-sm text-gray-500 dark:text-slate-400">{{ order.supplier ? localName(order.supplier) : '-' }}</p>
            </div>
            <span class="px-4 py-1.5 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400">
              {{ $t(`procurement.status.${order.status}`) }}
            </span>
          </div>

          <div
            v-if="notice"
            class="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
          >
            {{ notice }}
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-5">
            <div>
              <p class="text-xs text-gray-500 dark:text-slate-400">{{ $t('procurement.po.branch') }}</p>
              <p class="font-medium text-gray-900 dark:text-slate-100">{{ order.branch ? localName(order.branch) : '-' }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-slate-400">{{ $t('procurement.po.order_date') }}</p>
              <p class="font-medium text-gray-900 dark:text-slate-100">{{ ymd(order.order_date) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-slate-400">{{ $t('procurement.po.expected_date') }}</p>
              <p class="font-medium text-gray-900 dark:text-slate-100">{{ ymd(order.expected_date) }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500 dark:text-slate-400">{{ $t('procurement.detail.created_by') }}</p>
              <p class="font-medium text-gray-900 dark:text-slate-100">{{ order.creator?.name || '-' }}</p>
            </div>
          </div>

          <h4 class="font-semibold text-gray-900 mb-2 dark:text-slate-100">{{ $t('procurement.detail.items_title') }}</h4>
          <div class="overflow-x-auto border border-gray-200 rounded-xl mb-4 dark:border-slate-700">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 dark:bg-slate-900/50">
                <tr class="text-xs font-semibold text-gray-700 whitespace-nowrap dark:text-slate-300">
                  <th class="px-3 py-2 text-start">#</th>
                  <th class="px-3 py-2 text-start">{{ $t('procurement.form.description') }}</th>
                  <th class="px-3 py-2 text-start">{{ $t('procurement.form.unit') }}</th>
                  <th class="px-3 py-2 text-end">{{ $t('procurement.detail.ordered') }}</th>
                  <th class="px-3 py-2 text-end">{{ $t('procurement.form.unit_price') }}</th>
                  <th class="px-3 py-2 text-end">{{ $t('procurement.form.tax_rate') }}</th>
                  <th class="px-3 py-2 text-end">{{ $t('procurement.form.line_total') }}</th>
                </tr>
              </thead>
              <tbody class="text-gray-800 dark:text-slate-200">
                <tr v-for="(it, idx) in order.items || []" :key="it.id" class="border-t border-gray-200 dark:border-slate-700">
                  <td class="px-3 py-2">{{ idx + 1 }}</td>
                  <td class="px-3 py-2">
                    {{ it.description }}
                    <div v-if="it.item_code" class="text-xs text-gray-500 dark:text-slate-400">{{ it.item_code }}</div>
                  </td>
                  <td class="px-3 py-2">{{ it.unit || '-' }}</td>
                  <td class="px-3 py-2 text-end">{{ qty(it.quantity) }}</td>
                  <td class="px-3 py-2 text-end">{{ money(it.unit_price) }}</td>
                  <td class="px-3 py-2 text-end">{{ money(it.tax_rate) }}%</td>
                  <td class="px-3 py-2 text-end font-medium">{{ money(it.total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex flex-col md:flex-row gap-4 mb-5">
            <div class="flex-1 text-sm text-gray-700 dark:text-slate-300">
              <p v-if="order.notes"><span class="font-semibold">{{ $t('procurement.po.notes') }}:</span> {{ order.notes }}</p>
            </div>
            <div class="md:w-72 rounded-xl border border-gray-200 p-4 space-y-1.5 text-sm dark:border-slate-700">
              <div class="flex justify-between text-gray-700 dark:text-slate-300"><span>{{ $t('procurement.form.subtotal') }}</span><span>{{ money(order.subtotal) }}</span></div>
              <div class="flex justify-between text-gray-700 dark:text-slate-300"><span>{{ $t('procurement.form.tax') }}</span><span>{{ money(order.tax_amount) }}</span></div>
              <div class="flex justify-between text-gray-700 dark:text-slate-300"><span>{{ $t('procurement.form.discount') }}</span><span>{{ money(order.discount_amount) }}</span></div>
              <div class="flex justify-between pt-2 border-t border-gray-200 font-bold text-gray-900 dark:border-slate-700 dark:text-slate-100">
                <span>{{ $t('procurement.form.total') }}</span><span>{{ money(order.total) }} {{ order.currency }}</span>
              </div>
            </div>
          </div>

          <div v-if="order.attachments && order.attachments.length" class="mb-5">
            <h4 class="font-semibold text-gray-900 dark:text-slate-100 mb-2">{{ $t('procurement.attachments.title') }}</h4>
            <ul class="space-y-1">
              <li v-for="att in order.attachments" :key="att.id" class="text-sm">
                <a :href="att.url" target="_blank" rel="noopener" class="text-blue-600 hover:underline dark:text-blue-400">{{ att.original_name }}</a>
              </li>
            </ul>
          </div>

          <ApprovalChain :approvals="order.approvals" />

          <div class="flex flex-wrap justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
            <button
              type="button"
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
              @click="$emit('close')"
            >
              {{ $t('procurement.actions.close') }}
            </button>
            <button
              v-if="canAct"
              type="button"
              :disabled="acting"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
              @click="openSignature('reject')"
            >
              {{ $t('procurement.actions.reject') }}
            </button>
            <button
              v-if="canAct"
              type="button"
              :disabled="acting"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
              @click="openSignature('approve')"
            >
              {{ $t('procurement.actions.approve') }}
            </button>
          </div>
        </template>
      </div>
    </div>

    <SignatureModal
      :show="showSignature"
      :action="signatureAction"
      :loading="acting"
      @close="showSignature = false"
      @submit="submitSignature"
    />
  </Teleport>
</template>

<script>
import { toast } from 'vue3-toastify'
import myApprovalsApi from '@/api/myApprovals'
import ApprovalChain from '@/components/procurement/ApprovalChain.vue'
import SignatureModal from '@/components/procurement/SignatureModal.vue'

const num = (v) => Number(v) || 0

export default {
  name: 'ApprovalReviewModal',
  components: { ApprovalChain, SignatureModal },
  props: {
    show: { type: Boolean, default: false },
    orderId: { type: Number, default: null },
  },
  emits: ['close', 'done'],
  data() {
    return {
      order: null,
      loading: false,
      acting: false,
      showSignature: false,
      signatureAction: 'approve',
    }
  },
  computed: {
    user() { return this.$store.state.auth?.user },
    uid() { return Number(this.user?.id) || 0 },
    isSuper() { return this.user?.admin_group_id === 1 || this.user?.group?.id === 1 },
    currentStep() {
      return (this.order?.approvals || []).find((a) => a.status === 'pending' || a.status === 'escalated') || null
    },
    isMine() {
      const c = this.currentStep
      return !!c && (Number(c.approver_id) === this.uid || Number(c.escalated_to_id) === this.uid)
    },
    isOwn() {
      return [this.order?.created_by, this.order?.requester_id].map(Number).includes(this.uid)
    },
    canAct() {
      return (
        this.hasPerm('approve_purchase_order') &&
        this.order?.status === 'pending_approval' &&
        !!this.currentStep &&
        !this.isOwn &&
        (this.isMine || this.isSuper)
      )
    },
    notice() {
      if (!this.order || this.order.status !== 'pending_approval' || !this.currentStep) return ''
      if (this.isOwn) return ''
      if (this.isMine) return ''
      return this.isSuper
        ? this.$t('procurement.my_approvals.on_behalf')
        : this.$t('procurement.my_approvals.not_your_turn')
    },
  },
  watch: {
    show: {
      immediate: true,
      handler(value) {
        if (value) this.load()
        else this.order = null
      },
    },
  },
  methods: {
    hasPerm(permission) {
      if (this.$store.state.auth?.is_admin) return true
      const getter = this.$store.getters['auth/hasPermission']
      return typeof getter === 'function' ? !!getter(permission) : false
    },
    localName(obj) {
      if (!obj) return '-'
      return this.$i18n.locale === 'en' && obj.name_en ? obj.name_en : obj.name
    },
    money(v) {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num(v))
    },
    qty(v) {
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 3 }).format(num(v))
    },
    ymd(v) {
      return v ? String(v).slice(0, 10) : '-'
    },
    apiError(e) {
      return e?.response?.data?.message || e?.message || this.$t('realty.common.error')
    },
    async load() {
      if (!this.orderId) return
      this.loading = true
      this.order = null
      try {
        const res = await myApprovalsApi.getOne(this.orderId)
        this.order = res.data.data
      } catch (e) {
        toast.error(this.apiError(e))
        this.$emit('close')
      } finally {
        this.loading = false
      }
    },
    openSignature(action) {
      this.signatureAction = action
      this.showSignature = true
    },
    async submitSignature({ signature, reason }) {
      this.acting = true
      try {
        const res = this.signatureAction === 'approve'
          ? await myApprovalsApi.approve(this.order.id, signature)
          : await myApprovalsApi.reject(this.order.id, reason, signature)

        toast.success(res.data?.message || this.$t('realty.common.saved'))
        this.showSignature = false
        window.dispatchEvent(new Event('approvals-changed'))
        this.$emit('done')
      } catch (e) {
        toast.error(this.apiError(e))
      } finally {
        this.acting = false
      }
    },
  },
}
</script>
