<template>
  <div>
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div
        class="stats-card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-gray-200 dark:border-gray-700"
      >
        <div class="stats-icon bg-blue-100 dark:bg-blue-900/50">
          <svg
            class="w-6 h-6 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <div>
          <p class="stats-label">{{ $t('reports.totalInvoices') }}</p>
          <p class="stats-value">{{ stats.total_invoices || 0 }}</p>
        </div>
      </div>

      <div
        class="stats-card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-gray-200 dark:border-gray-700"
      >
        <div class="stats-icon bg-green-100 dark:bg-green-900/50">
          <svg
            class="w-6 h-6 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p class="stats-label">{{ $t('reports.totalAmount') }}</p>
          <p class="stats-value">{{ formatCurrency(stats.total_amount) }}</p>
        </div>
      </div>

      <div
        class="stats-card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-gray-200 dark:border-gray-700"
      >
        <div class="stats-icon bg-blue-100 dark:bg-blue-900/50">
          <svg
            class="w-6 h-6 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p class="stats-label">{{ $t('reports.totalPaid') }}</p>
          <p class="stats-value">{{ formatCurrency(stats.total_paid) }}</p>
        </div>
      </div>

      <div
        class="stats-card bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-gray-200 dark:border-gray-700"
      >
        <div class="stats-icon bg-red-100 dark:bg-red-900/50">
          <svg
            class="w-6 h-6 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p class="stats-label">{{ $t('reports.totalDue') }}</p>
          <p class="stats-value">{{ formatCurrency(stats.total_due) }}</p>
        </div>
      </div>
    </div>

    <!-- Invoices Table -->
    <div
      v-if="invoices.length > 0"
      class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
    >
      <div
        class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50"
      >
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {{ $t('reports.invoicesList') }}
            </h3>
            <span
              class="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full"
            >
              {{ pagination.total }} {{ $t('reports.invoice') }}
            </span>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{
              $t('pagination.showing', {
                from: pagination.from,
                to: pagination.to,
                total: pagination.total,
              })
            }}
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th class="table-header text-center">{{ $t('reports.invoice_number') }}</th>
              <th class="table-header text-center">{{ $t('reports.client') }}</th>
              <th class="table-header text-center">{{ $t('reports.issue_date') }}</th>
              <th class="table-header text-center">{{ $t('reports.due_date') }}</th>
              <th class="table-header text-center">{{ $t('reports.amount') }}</th>
              <th class="table-header text-center">{{ $t('reports.status') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="invoice in invoices"
              :key="invoice.id"
              class="hover:bg-blue-50/30 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td class="table-cell text-center">
                <router-link
                  :to="`/invoices/${invoice.id}`"
                  class="invoice-link dark:text-white dark:hover:text-blue-400"
                >
                  {{ invoice.invoice_number || `#${invoice.id}` }}
                </router-link>
              </td>
              <td class="table-cell text-center">
                <div class="client-cell">
                  <div class="client-avatar mr-4">
                    {{ getInitials(invoice.client?.name) }}
                  </div>
                  <div>
                    <div class="client-name text-center">
                      {{ invoice.client?.name || $t('common.notProvided') }}
                    </div>
                    <div class="client-email text-center">
                      {{ invoice.client?.email || $t('common.notProvided') }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="table-cell text-center">
                <div class="date-cell">{{ formatDate(invoice.issue_date) }}</div>
              </td>
              <td class="table-cell text-center">
                <div :class="getDueDateClass(invoice.due_date)" class="due-date-cell">
                  {{ formatDate(invoice.due_date) }}
                </div>
              </td>
              <td class="table-cell text-right">
                <div class="amount-cell">{{ formatCurrency(invoice.total_amount) }}</div>
              </td>
              <td class="table-cell text-center">
                <span :class="getStatusClass(invoice.status)" class="status-badge">
                  <span :class="getStatusDotClass(invoice.status)" class="status-dot"></span>
                  {{ $t(getStatusText(invoice.status)) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        v-if="pagination.last_page > 1"
        class="px-6 py-4 border-t border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            {{
              $t('pagination.pageOf', {
                current: pagination.current_page,
                total: pagination.last_page,
              })
            }}
          </div>
          <div class="flex gap-2">
            <button
              @click="$emit('page-change', pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="pagination-button"
              :class="{ 'opacity-50 cursor-not-allowed': pagination.current_page === 1 }"
            >
              {{ $t('pagination.previous') }}
            </button>
            <button
              @click="$emit('page-change', pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="pagination-button"
              :class="{
                'opacity-50 cursor-not-allowed': pagination.current_page === pagination.last_page,
              }"
            >
              {{ $t('pagination.next') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <svg
        class="empty-icon text-gray-400 dark:text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <h3 class="text-gray-900 dark:text-white">{{ $t('reports.noInvoices') }}</h3>
      <p class="text-gray-600 dark:text-gray-400">{{ $t('reports.noInvoicesMessage') }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvoiceReportSection',
  props: {
    invoices: { type: Array, default: () => [] },
    stats: { type: Object, default: () => ({}) },
    pagination: { type: Object, default: () => ({}) },
  },
  methods: {
    formatCurrency(amount) {
      if (!amount && amount !== 0) return '0.00 ' + this.$t('common.currency')
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 2,
      })
      return formatter.format(amount)
    },
    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
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
    getDueDateClass(dueDate) {
      if (!dueDate) return 'text-gray-600 dark:text-gray-400'
      const today = new Date()
      const due = new Date(dueDate)
      const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
      if (diffDays < 0) return 'text-red-600 font-semibold'
      if (diffDays <= 3) return 'text-yellow-600'
      return 'text-green-600'
    },
    getStatusClass(status) {
      const classes = {
        draft: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
        sent: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
        paid: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
        overdue: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
      }
      return classes[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
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
      const statuses = {
        draft: 'invoices.status.draft',
        sent: 'invoices.status.sent',
        paid: 'invoices.status.paid',
        overdue: 'invoices.status.overdue',
      }
      return statuses[status] || status
    },
  },
}
</script>

<style scoped>
.stats-card {
  @apply rounded-xl p-5 border shadow-sm hover:shadow-md transition-shadow duration-300;
}
.stats-icon {
  @apply p-3 rounded-lg w-fit mb-3;
}
.stats-label {
  @apply text-sm font-medium text-gray-500 dark:text-gray-400 mb-1;
}
.stats-value {
  @apply text-2xl font-bold text-gray-900 dark:text-white;
}
.table-header {
  @apply px-6 py-3 text-start text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider;
}
.table-cell {
  @apply px-6 py-4;
}
.invoice-link {
  @apply text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors;
}
.client-cell {
  @apply flex items-center;
}
.client-avatar {
  @apply w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center ml-3 text-gray-700 dark:text-gray-200 font-bold text-sm;
}
.client-name {
  @apply text-sm font-medium text-gray-900 dark:text-white;
}
.client-email {
  @apply text-xs text-gray-500 dark:text-gray-400 mt-1;
}
.date-cell {
  @apply text-sm text-gray-900 dark:text-gray-200 font-medium;
}
.due-date-cell {
  @apply text-sm font-medium;
}
.amount-cell {
  @apply text-lg font-bold text-gray-900 dark:text-white;
}
.status-badge {
  @apply px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1;
}
.status-dot {
  @apply w-2 h-2 rounded-full;
}
.pagination-button {
  @apply px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200;
}
.empty-state {
  @apply rounded-xl border shadow-sm p-12 text-center;
}
.empty-icon {
  @apply w-16 h-16 mx-auto mb-4;
}
.empty-state h3 {
  @apply text-lg font-semibold mb-2;
}
.empty-state p {
  @apply mb-6 max-w-md mx-auto;
}
</style>
