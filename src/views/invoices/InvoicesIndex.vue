<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-8">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-white rounded-xl shadow-sm border border-gray-200">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
                  {{ $t('invoices.title') }}
                </h1>
                <p class="text-gray-600 text-sm mt-1">{{ $t('invoices.subtitle') }}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button v-if="hasPermission('create_invoice')" @click="$router.push('/invoices/create')"
              class="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group">
              <svg class="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span class="font-medium">{{ $t('invoices.create_new') }}</span>
            </button>
          </div>
        </div>

        <!-- Stats Grid -->
        <InvoicesStatsGrid :stats="stats" :paid-rate="paidRate" />
      </div>

      <!-- Filters -->
      <InvoiceFilters v-model="filters" @apply="applyFilters" @search="applyFilters" @clear="handleClearFilters" />

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 mb-6">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4">
          </div>
          <p class="text-gray-700 font-medium">{{ $t('invoices.loading') }}</p>
          <p class="text-sm text-gray-500 mt-2">{{ $t('invoices.loading_subtitle') }}</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <div class="flex items-start">
          <div class="flex-shrink-0 pt-0.5">
            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="mr-3 flex-1">
            <h3 class="text-sm font-medium text-red-800">{{ $t('errors.load_failed') }}</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
          </div>
          <button @click="clearError" class="p-1.5 text-red-700 hover:text-red-900">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Table -->
      <div v-else>
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <!-- Table Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <h3 class="text-lg font-semibold text-gray-800">
                  {{ $t('invoices.table.invoice_list') }}
                </h3>
                <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  {{ pagination.total || 0 }} {{ $t('common.total') }}
                </span>
              </div>

              <div class="text-sm text-gray-600">
                {{ $t('invoices.total_amount') }}:
                <span class="font-bold text-gray-900">{{
                  formatCurrency(stats.totalAmount || 0)
                  }}</span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="invoices.length === 0" class="text-center py-12 px-4">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ $t('invoices.no_invoices') }}
            </h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">
              {{ $t('invoices.start_creating_message') }}
            </p>
            <button v-if="hasPermission('create_invoice')" @click="$router.push('/invoices/create')"
              class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 mx-auto">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              {{ $t('invoices.start_creating') }}
            </button>
          </div>

          <!-- Table Content -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {{ $t('invoices.table.invoice_number') }}
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {{ $t('invoices.table.client') }}
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {{ $t('invoices.table.date') }}
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {{ $t('invoices.table.due_date') }}
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {{ $t('invoices.table.amount') }}
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {{ $t('invoices.table.status') }}
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    {{ $t('invoices.table.actions') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="invoice in invoices" :key="invoice.id"
                  class="hover:bg-blue-50/30 transition-colors duration-150">
                  <!-- Invoice Number -->
                  <td class="px-6 py-4">
                    <router-link :to="`/invoices/${invoice.id}`" class="block group/link">
                      <p class="text-base font-semibold text-gray-900 group-hover/link:text-blue-600 transition-colors">
                        {{
                          invoice.invoice_number ||
                          $t('invoices.invoiceHeading', { number: invoice.id })
                        }}
                      </p>
                      <div class="text-xs text-gray-500 mt-1">#{{ invoice.id }}</div>
                    </router-link>
                  </td>

                  <!-- Client Info -->
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 ml-3">
                        <div
                          class="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mr-4">
                          <span class="text-blue-700 font-bold text-sm">{{
                            getInitials(invoice.client?.name)
                            }}</span>
                        </div>
                      </div>
                      <div class="mr-3">
                        <div class="text-sm font-medium text-gray-900">
                          {{ invoice.client?.name || $t('common.notAvailable') }}
                        </div>
                        <div class="text-xs text-gray-500 mt-1">
                          {{ invoice.client?.email || $t('common.notAvailable') }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Invoice Date -->
                  <td class="px-6 py-4 text-center">
                    <div class="text-sm text-gray-900 font-medium">
                      {{ formatDate(invoice.invoice_date) }}
                    </div>
                    <div class="text-xs text-gray-500 mt-1">Created</div>
                  </td>

                  <!-- Due Date -->
                  <td class="px-6 py-4 text-center">
                    <div :class="getDaysRemainingClass(invoice.due_date)" class="flex flex-col items-center">
                      <span class="text-sm font-medium">
                        {{ formatDate(invoice.due_date) }}
                      </span>
                      <span class="text-xs mt-1 px-2 py-0.5 rounded-full bg-opacity-20"
                        :class="getDaysRemainingBadgeClass(invoice.due_date)">
                        {{ getDaysRemaining(invoice.due_date) }}
                      </span>
                    </div>
                  </td>

                  <!-- Amount -->
                  <td class="px-6 py-4 text-right">
                    <div class="flex flex-col items-end">
                      <span class="text-lg font-bold text-gray-900">
                        {{ formatCurrency(invoice.total) }}
                      </span>
                      <div class="text-xs text-gray-500 mt-1">
                        {{ $t('invoices.table.tax_included') }}
                      </div>
                    </div>
                  </td>

                  <!-- Status -->
                  <td class="px-6 py-4 text-center">
                    <div class="flex flex-col items-center">
                      <span :class="getStatusBadgeClass(invoice.status)"
                        class="px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                        <span :class="getStatusDotClass(invoice.status)" class="w-2 h-2 rounded-full"></span>
                        {{ getStatusText(invoice.status) }}
                      </span>
                    </div>
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4 text-center">
                    <div class="flex items-center justify-center gap-1">
                      <button @click="$router.push(`/invoices/${invoice.id}`)"
                        class="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        :title="$t('buttons.view')">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button v-if="hasPermission('edit_invoice')" @click="$router.push(`/invoices/${invoice.id}/edit`)"
                        class="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        :title="$t('buttons.edit')">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button v-if="hasPermission('delete_invoice')" @click="confirmDelete(invoice)"
                        class="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        :title="$t('buttons.delete')">
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

        <!-- Pagination -->
        <Pagination :pagination="pagination" @change="goToPage" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import InvoicesStatsGrid from '@/components/invoices/InvoicesStatsGrid.vue'
import InvoiceFilters from '@/components/invoices/InvoiceFilters.vue'
import Pagination from '@/components/shared/Pagination.vue'

export default {
  name: 'Invoices',

  components: {
    InvoicesStatsGrid,
    InvoiceFilters,
    Pagination,
  },

  data() {
    return {
      filters: {
        status: '',
        date_from: '',
        date_to: '',
        search: '',
      },
    }
  },

  computed: {
    ...mapGetters('invoices', [
      'invoices',
      'loading',
      'error',
      'pagination',
      'invoiceStats',
      'invoiceFilters',
    ]),

    stats() {
      return (
        this.invoiceStats || {
          total: 0,
          paid: 0,
          sent: 0,
          overdue: 0,
          totalAmount: 0,
        }
      )
    },

    paidRate() {
      if (!this.stats.total) return 0
      return Math.round((this.stats.paid / this.stats.total) * 100)
    },
  },

  mounted() {
    this.filters = { ...this.filters, ...this.invoiceFilters }
    this.loadInvoices()
  },

  methods: {
    ...mapActions('invoices', [
      'fetchInvoices',
      'deleteInvoice',
      'updateFilters',
      'clearError',
    ]),
    ...mapActions('invoices', { resetInvoiceFilters: 'clearFilters' }),

    async loadInvoices() {
      try {
        await this.fetchInvoices(this.filters)
      } catch (error) {
        console.error('❌ ' + this.$t('invoices.loadFailed') + ':', error)
        this.$toast.error(error.message || this.$t('errors.loadFailed'))
      }
    },

    applyFilters() {
      this.updateFilters(this.filters)
      this.loadInvoices()
    },

    handleClearFilters() {
      this.filters = {
        status: '',
        date_from: '',
        date_to: '',
        search: '',
      }
      this.resetInvoiceFilters()
      this.loadInvoices()
      this.$toast.info(this.$t('reports.buttons.reset_filters'))
    },

    async confirmDelete(invoice) {
      const confirmed = await this.$swal({
        title: this.$t('invoices.delete_confirm_title'),
        text: this.$t('invoices.delete_confirm', { number: invoice.invoice_number || invoice.id }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: this.$t('common.delete'),
        cancelButtonText: this.$t('common.cancel'),
        reverseButtons: true,
        focusCancel: true,
      })

      if (confirmed.isConfirmed) {
        await this.deleteInvoiceHandler(invoice.id)
      }
    },

    async deleteInvoiceHandler(id) {
      try {
        await this.deleteInvoice(id)
        this.$toast.success(
          this.$t('invoices.messages.deleteSuccess', { item: this.$t('invoices.invoice') }),
        )
        this.loadInvoices()
      } catch (error) {
        this.$toast.error(error.message || this.$t('invoices.delete_error'))
      }
    },

    goToPage(page) {
      if (page === '...' || page === this.pagination.current_page) return
      this.filters.page = page
      this.loadInvoices()
    },

    hasPermission(permission) {
      if (this.$store.state.auth.is_admin) return true
      const permissions = this.$store.state.auth.permissions || []
      return permissions.includes(permission)
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },

    formatCurrency(amount) {
      if (!amount && amount !== 0) return '0.00 ' + this.$t('common.currency')
      const formatter = new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 2,
      })
      return formatter.format(amount)
    },

    getInitials(name) {
      if (!name) return '؟؟'
      return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },

    getDaysRemaining(dueDate) {
      if (!dueDate) return this.$t('common.notAvailable')
      const today = new Date()
      const due = new Date(dueDate)
      const diffTime = due - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 0) return this.$t('invoices.overdue')
      if (diffDays === 0) return this.$t('invoices.today')
      if (diffDays === 1) return this.$t('invoices.tomorrow')
      return this.$t('invoices.days', { days: diffDays })
    },

    getDaysRemainingClass(dueDate) {
      if (!dueDate) return 'text-gray-600'
      const today = new Date()
      const due = new Date(dueDate)
      const diffTime = due - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 0) return 'text-red-600'
      if (diffDays <= 3) return 'text-yellow-600'
      return 'text-green-600'
    },

    getDaysRemainingBadgeClass(dueDate) {
      if (!dueDate) return 'bg-gray-100 text-gray-800'
      const today = new Date()
      const due = new Date(dueDate)
      const diffTime = due - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 0) return 'bg-red-100 text-red-800'
      if (diffDays <= 3) return 'bg-yellow-100 text-yellow-800'
      return 'bg-green-100 text-green-800'
    },

    getStatusBadgeClass(status) {
      const classes = {
        draft: 'bg-gray-100 text-gray-800',
        sent: 'bg-blue-100 text-blue-800',
        paid: 'bg-green-100 text-green-800',
        overdue: 'bg-red-100 text-red-800',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },

    getStatusDotClass(status) {
      const classes = {
        draft: 'bg-gray-500',
        sent: 'bg-blue-500',
        paid: 'bg-green-500',
        overdue: 'bg-red-500',
      }
      return classes[status] || 'bg-gray-500'
    },

    getStatusText(status) {
      const texts = {
        draft: this.$t('invoices.statuses.draft'),
        sent: this.$t('invoices.statuses.sent'),
        paid: this.$t('invoices.statuses.paid'),
        overdue: this.$t('invoices.statuses.overdue'),
      }
      return texts[status] || status
    },
  },

  watch: {
    invoiceFilters: {
      immediate: true,
      handler(newFilters) {
        this.filters = { ...newFilters }
      },
    },
  },
}
</script>

<style scoped>
/* تحسينات الجدول */
table {
  border-collapse: separate;
  border-spacing: 0;
}

th {
  font-weight: 600;
  letter-spacing: 0.025em;
}

td {
  border-bottom: 1px solid #f3f4f6;
}

tr:last-child td {
  border-bottom: none;
}

/* تحسينات الأيقونات */
svg {
  display: inline-block;
  vertical-align: middle;
}

/* تأثيرات hover محسنة */
tr:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

/* تحسينات الأزرار */
button {
  transition: all 0.2s ease-in-out;
}

button:hover {
  transform: translateY(-1px);
}

/* تخصيص شريط التمرير */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* تحسينات للجوّال */
@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  table {
    min-width: 768px;
  }
}

/* تأثيرات الـ loading */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* تدرجات لونية */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}
</style>
