<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 md:py-8">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {{ $t('recurringInvoices.title') || 'الفواتير المتكررة' }}
                </h1>
                <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {{ $t('recurringInvoices.subtitle') || 'قوالب تتكرر تلقائياً أو يدوياً لإنشاء فواتير جديدة' }}
                </p>
              </div>
            </div>
          </div>

          <button
            @click="$router.push('/recurring-invoices/create')"
            class="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group"
          >
            <svg class="" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="font-medium">{{ $t('recurringInvoices.create_new') || 'قالب جديد' }}</span>
          </button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">{{ $t('common.total') || 'الإجمالي' }}</p>
            <p class="text-xl font-bold text-gray-900 dark:text-white">{{ stats.total }}</p>
          </div>
          <div class="bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 shadow-sm p-4">
            <p class="text-sm text-green-700 dark:text-green-400 mb-1">{{ $t('recurringInvoices.active') || 'نشط' }}</p>
            <p class="text-xl font-bold text-green-800 dark:text-green-300">{{ stats.active }}</p>
          </div>
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 shadow-sm p-4">
            <p class="text-sm text-blue-700 dark:text-blue-300 mb-1">{{ $t('recurringInvoices.completed') || 'مكتمل' }}</p>
            <p class="text-xl font-bold text-blue-800 dark:text-blue-300">{{ stats.completed }}</p>
          </div>
          <div class="bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">{{ $t('recurringInvoices.cancelled') || 'ملغى' }}</p>
            <p class="text-xl font-bold text-gray-800 dark:text-gray-200">{{ stats.cancelled }}</p>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 mb-6 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 mb-4"></div>
        <p class="text-gray-700 dark:text-gray-300 font-medium">{{ $t('common.loading') || 'جاري التحميل...' }}</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
        <div class="flex items-start">
          <div class="mr-3 flex-1">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-400">{{ $t('common.error') || 'خطأ' }}</h3>
            <p class="text-sm text-red-700 dark:text-red-400 mt-1">{{ error }}</p>
          </div>
          <button @click="clearError" class="ui-icon-btn">
            <svg class="" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Table -->
      <div v-else class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div v-if="templates.length === 0" class="text-center py-12 px-4">
          <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {{ $t('recurringInvoices.empty_title') || 'لا توجد قوالب فواتير متكررة' }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {{ $t('recurringInvoices.empty_subtitle') || 'أنشئ أول قالب لبدء توليد الفواتير تلقائياً' }}
          </p>
          <button
            @click="$router.push('/recurring-invoices/create')"
            class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            <svg class="" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            {{ $t('recurringInvoices.create_first') || 'أنشئ قالباً' }}
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{{ $t('clients.client') || 'العميل' }}</th>
                <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{{ $t('recurringInvoices.frequency') || 'التكرار' }}</th>
                <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{{ $t('recurringInvoices.next_run') || 'التوليد القادم' }}</th>
                <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{{ $t('recurringInvoices.occurrences') || 'التكرارات' }}</th>
                <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{{ $t('invoices.total') || 'الإجمالي' }}</th>
                <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{{ $t('common.status') || 'الحالة' }}</th>
                <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">{{ $t('common.actions') || 'إجراءات' }}</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-slate-700">
              <tr v-for="template in templates" :key="template.id" class="hover:bg-blue-50/30 transition-colors duration-150">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center ml-3">
                      <span class="text-blue-700 dark:text-blue-300 font-bold text-sm">{{ getInitials(template.client?.name) }}</span>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ template.client?.name || $t('common.notAvailable') }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ template.client?.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                    {{ frequencyLabel(template.frequency) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center text-sm text-gray-700 dark:text-gray-300">
                  {{ template.status === 'active' ? formatDate(template.next_run_date) : '-' }}
                </td>
                <td class="px-6 py-4 text-center text-sm text-gray-700 dark:text-gray-300">
                  {{ template.occurrences_generated }} / {{ template.occurrences_total }}
                </td>
                <td class="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(template.total) }}
                </td>
                <td class="px-6 py-4 text-center">
                  <span :class="statusBadgeClass(template.status)" class="px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                    <span :class="statusDotClass(template.status)" class="w-2 h-2 rounded-full"></span>
                    {{ statusText(template.status) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center gap-1">
                    <button
                      v-if="template.status === 'active'"
                      @click="handleGenerateNow(template)"
                      :disabled="generatingId === template.id"
                      class="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 rounded-lg text-xs font-medium transition-colors duration-200 disabled:opacity-50"
                      :title="$t('recurringInvoices.generate_now') || 'توليد الآن'"
                    >
                      {{ generatingId === template.id ? '...' : ($t('recurringInvoices.generate_now') || 'توليد الآن') }}
                    </button>
                    <button
                      v-if="template.status === 'active'"
                      @click="handleCancel(template)"
                      class="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 rounded-lg text-xs font-medium transition-colors duration-200"
                      :title="$t('common.cancel') || 'إلغاء'"
                    >
                      {{ $t('common.cancel') || 'إلغاء' }}
                    </button>
                    <button
                      @click="confirmDelete(template)"
                      class="ui-icon-btn"
                      :title="$t('common.delete') || 'حذف'"
                    >
                      <svg class="" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'RecurringInvoicesIndex',

  data() {
    return {
      generatingId: null,
    }
  },

  computed: {
    ...mapGetters('recurringInvoices', ['templates', 'loading', 'error', 'templateStats']),
    stats() {
      return this.templateStats
    },
  },

  mounted() {
    this.loadTemplates()
  },

  methods: {
    ...mapActions('recurringInvoices', [
      'fetchTemplates',
      'deleteTemplate',
      'generateNow',
      'cancelTemplate',
      'clearError',
    ]),

    async loadTemplates() {
      try {
        await this.fetchTemplates()
      } catch (error) {
        this.$toast.error(error.message || this.$t('common.error'))
      }
    },

    async handleGenerateNow(template) {
      this.generatingId = template.id
      try {
        await this.generateNow(template.id)
        this.$toast.success(this.$t('recurringInvoices.generate_success') || 'تم توليد الفاتورة بنجاح')
        await this.loadTemplates()
      } catch (error) {
        this.$toast.error(error.message || this.$t('recurringInvoices.generate_failed') || 'فشل التوليد')
      } finally {
        this.generatingId = null
      }
    },

    async handleCancel(template) {
      const result = await this.$swal({
        title: this.$t('recurringInvoices.cancel_confirm_title') || 'إلغاء القالب؟',
        text: this.$t('recurringInvoices.cancel_confirm_text') || 'لن يتم توليد فواتير جديدة من هذا القالب بعد الإلغاء.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F97316',
        cancelButtonColor: '#6B7280',
        confirmButtonText: this.$t('common.confirm') || 'تأكيد',
        cancelButtonText: this.$t('common.back') || 'تراجع',
      })

      if (result.isConfirmed) {
        try {
          await this.cancelTemplate(template.id)
          this.$toast.success(this.$t('recurringInvoices.cancel_success') || 'تم إلغاء القالب')
        } catch (error) {
          this.$toast.error(error.message || this.$t('common.error'))
        }
      }
    },

    async confirmDelete(template) {
      const result = await this.$swal({
        title: this.$t('common.delete_confirm_title') || 'حذف القالب؟',
        text: this.$t('recurringInvoices.delete_confirm_text') || 'هذا الإجراء لا يمكن التراجع عنه.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: this.$t('common.delete') || 'حذف',
        cancelButtonText: this.$t('common.cancel') || 'إلغاء',
      })

      if (result.isConfirmed) {
        try {
          await this.deleteTemplate(template.id)
          this.$toast.success(this.$t('messages.deleteSuccess') || 'تم الحذف بنجاح')
        } catch (error) {
          this.$toast.error(error.message || this.$t('common.error'))
        }
      }
    },

    frequencyLabel(frequency) {
      const map = {
        weekly: this.$t('recurringInvoices.weekly') || 'أسبوعي',
        monthly: this.$t('recurringInvoices.monthly') || 'شهري',
        quarterly: this.$t('recurringInvoices.quarterly') || 'ربع سنوي',
        yearly: this.$t('recurringInvoices.yearly') || 'سنوي',
      }
      return map[frequency] || frequency
    },

    statusBadgeClass(status) {
      const classes = {
        active: 'bg-green-100 text-green-800',
        completed: 'bg-blue-100 text-blue-800',
        cancelled: 'bg-gray-100 text-gray-800',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },

    statusDotClass(status) {
      const classes = {
        active: 'bg-green-500',
        completed: 'bg-blue-500',
        cancelled: 'bg-gray-500',
      }
      return classes[status] || 'bg-gray-500'
    },

    statusText(status) {
      const map = {
        active: this.$t('recurringInvoices.active') || 'نشط',
        completed: this.$t('recurringInvoices.completed') || 'مكتمل',
        cancelled: this.$t('recurringInvoices.cancelled') || 'ملغى',
      }
      return map[status] || status
    },

    getInitials(name) {
      if (!name) return '؟؟'
      return name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2)
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    },

    formatCurrency(amount) {
      if (!amount && amount !== 0) return '0.00 ' + this.$t('common.currency')
      const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'SAR', minimumFractionDigits: 2 })
      return formatter.format(amount)
    },
  },
}
</script>
