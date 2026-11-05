<template>
  <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mt-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-slate-200">
        {{ $t('installments.title') }}
      </h3>
      <div>
        <button v-if="!plan && canManage" @click="showCreateModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          {{ $t('installments.create_plan') }}
        </button>
        <button v-if="plan && plan.status === 'active' && canManage" @click="confirmCancel"
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
          {{ $t('installments.cancel_plan') }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-4 text-gray-500">
      {{ $t('common.loading') }}
    </div>
    <div v-else-if="!plan" class="text-center py-4 text-gray-500">
      {{ $t('installments.no_plan') }}
    </div>

    <div v-else>
      <!-- بطاقات الملخص -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div class="bg-gray-50 dark:bg-slate-900 rounded-lg p-3">
          <p class="text-sm text-gray-500">{{ $t('installments.original_amount') }}</p>
          <p class="font-bold">{{ formatCurrency(plan.original_amount) }}</p>
        </div>
        <div class="bg-orange-50 rounded-lg p-3">
          <p class="text-sm text-gray-500">
            {{ $t('installments.interest_amount') }} ({{ plan.interest_rate }}%)
          </p>
          <p class="font-bold text-orange-600">{{ formatCurrency(plan.interest_amount) }}</p>
        </div>
        <div class="bg-blue-50 rounded-lg p-3">
          <p class="text-sm text-gray-500">{{ $t('installments.total_amount') }}</p>
          <p class="font-bold text-blue-700">{{ formatCurrency(plan.total_amount) }}</p>
        </div>
        <div class="bg-gray-50 dark:bg-slate-900 rounded-lg p-3">
          <p class="text-sm text-gray-500">{{ $t('common.status') }}</p>
          <p class="font-bold">{{ $t('installments.status.' + plan.status) }}</p>
        </div>
      </div>

      <!-- جدول الأقساط -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead class="bg-gray-50 dark:bg-slate-900">
            <tr>
              <th class="px-4 py-2 text-start text-sm font-medium text-gray-700 dark:text-slate-300">#</th>
              <th class="px-4 py-2 text-start text-sm font-medium text-gray-700 dark:text-slate-300">
                {{ $t('installments.due_date') }}
              </th>
              <th class="px-4 py-2 text-start text-sm font-medium text-gray-700 dark:text-slate-300">
                {{ $t('installments.amount') }}
              </th>
              <th class="px-4 py-2 text-start text-sm font-medium text-gray-700 dark:text-slate-300">
                {{ $t('common.status') }}
              </th>
              <th class="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-slate-300">
                {{ $t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            <tr v-for="inst in plan.installments" :key="inst.id">
              <td class="px-4 py-2 text-sm">{{ inst.installment_number }}</td>
              <td class="px-4 py-2 text-sm">{{ formatDate(inst.due_date) }}</td>
              <td class="px-4 py-2 text-sm font-medium">{{ formatCurrency(inst.amount) }}</td>
              <td class="px-4 py-2">
                <span class="px-2 py-1 rounded-full text-xs font-semibold" :class="statusClass(inst.status)">
                  {{ $t('installments.status.' + inst.status) }}
                </span>
              </td>
              <td class="px-4 py-2 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <!-- زر عرض الفاتورة (إذا كان هناك فاتورة مرتبطة) -->
                  <button v-if="inst.invoice_id" @click="$router.push('/invoices/' + inst.invoice_id)"
                    class="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="عرض الفاتورة">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  <button v-if="['pending', 'overdue'].includes(inst.status) && canManage" @click="pay(inst)"
                    class="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm">
                    {{ $t('installments.mark_paid') }}
                  </button>
                  <span v-else-if="inst.status === 'paid'" class="text-gray-500 text-xs">
                    {{ formatDate(inst.paid_at) }}
                  </span>

                  <!-- رابط دفع لهذا القسط تحديدًا -->
                  <button v-if="inst.status === 'pending' && canManage" @click="$emit('generate-link', inst)"
                    class="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    :title="$t('payment_links.title')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5" />
                    </svg>
                  </button>

                  <!-- حذف القسط + إعادة توزيع المتبقي -->
                  <button v-if="inst.status === 'pending' && canManage" @click="removeInstallment(inst)"
                    class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    :title="$t('installments.delete_and_redistribute')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <CreateInstallmentPlanModal :show="showCreateModal" :invoice-id="invoiceId" :invoice-total="invoiceTotal"
      :submitting="submitting" @close="showCreateModal = false" @created="onCreated" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { formatCurrency, formatDate } from '@/utils/formatters'
import CreateInstallmentPlanModal from './CreateInstallmentPlanModal.vue'

export default {
  components: { CreateInstallmentPlanModal },
  props: {
    invoiceId: { type: [Number, String], required: true },
    invoiceTotal: { type: [Number, String], required: true },
    canManage: { type: Boolean, default: false },
    canCreate: { type: Boolean, default: false },
  },
  emits: ['generate-link'],
  data() {
    return {
      showCreateModal: false,
    }
  },
  computed: {
    ...mapGetters('installments', ['currentPlan', 'loading', 'submitting']),
    plan() {
      return this.currentPlan
    },
  },
  created() {
    this.fetchPlan(this.invoiceId)
  },
  methods: {
    ...mapActions('installments', [
      'fetchPlan',
      'payInstallment',
      'cancelPlan',
      'deleteInstallment',
    ]),
    formatCurrency,
    formatDate,
    statusClass(status) {
      return (
        {
          pending: 'bg-yellow-100 text-yellow-800',
          paid: 'bg-green-100 text-green-800',
          overdue: 'bg-red-100 text-red-800',
          cancelled: 'bg-gray-100 text-gray-600',
        }[status] || 'bg-gray-100'
      )
    },
    onCreated() {
      this.showCreateModal = false
      this.fetchPlan(this.invoiceId)
    },
    async pay(inst) {
      if (
        !confirm(
          this.$t('installments.confirm_pay_message', {
            number: inst.installment_number,
            amount: formatCurrency(inst.amount),
          }),
        )
      )
        return
      try {
        await this.payInstallment({ installmentId: inst.id, paymentMethod: 'cash' })
        this.$toast?.success(this.$t('installments.pay_success'))
        this.fetchPlan(this.invoiceId)
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || this.$t('installments.pay_failed'))
      }
    },
    async removeInstallment(inst) {
      if (
        !confirm(
          this.$t('installments.confirm_delete_redistribute', { number: inst.installment_number }),
        )
      )
        return
      try {
        await this.deleteInstallment(inst.id)
        this.$toast?.success(this.$t('installments.delete_success'))
        this.fetchPlan(this.invoiceId)
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || this.$t('installments.delete_failed'))
      }
    },
    async confirmCancel() {
      if (!confirm(this.$t('installments.confirm_cancel_message'))) return
      try {
        await this.cancelPlan(this.plan.id)
        this.$toast?.success(this.$t('installments.cancel_success'))
        this.fetchPlan(this.invoiceId)
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || this.$t('installments.cancel_failed'))
      }
    },
  },
}
</script>

<style scoped></style>
