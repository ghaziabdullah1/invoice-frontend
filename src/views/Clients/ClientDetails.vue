<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-8">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      <!-- Header -->
      <div class="mb-8">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
                <svg
                  class="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100">
                  {{ $t('clients.clientDetails') }}
                </h1>
                <p class="text-gray-600 dark:text-slate-400 text-sm mt-1">{{ $t('clients.clientDetailsDescription') }}</p>
              </div>
            </div>

            <!-- Breadcrumbs -->
            <nav class="flex mt-3" aria-label="Breadcrumb">
              <ol class="flex items-center space-x-1 space-x-reverse">
                <li>
                  <router-link
                    to="/clients"
                    class="text-sm text-gray-500 hover:text-gray-700 dark:text-slate-300 transition-colors"
                  >
                    {{ $t('clients.title') }}
                  </router-link>
                </li>
                <li>
                  <svg class="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </li>
                <li class="text-sm font-medium text-blue-600">
                  {{ client?.name || '...' }}
                </li>
              </ol>
            </nav>
          </div>

          <div class="flex gap-3">
            <button
              @click="$router.push('/clients')"
              class="px-4 py-2.5 bg-white border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-200 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {{ $t('common.back') }}
            </button>
            <BaseButton
              v-if="hasPermission('edit_client')"
              @click="editClient"
              variant="primary"
              icon="edit"
            >
              {{ $t('common.edit') }}
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <LoadingSpinner size="lg" />
        <p class="text-gray-600 dark:text-slate-400 text-lg mt-4">{{ $t('common.loading') }}</p>
      </div>

      <!-- Error State -->
      <BaseAlert
        v-else-if="error"
        type="danger"
        :title="$t('common.error')"
        :message="error"
        :actions="errorActions"
        class="mb-6"
      />

      <!-- Client Details -->
      <div v-else-if="client" class="space-y-6">
        <!-- Client Info Card -->
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <!-- Card Header with gradient -->
          <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-white">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-blue-100 rounded-lg">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-800 dark:text-slate-200">{{ $t('clients.basicInfo') }}</h2>
                <p class="text-sm text-gray-600 dark:text-slate-400">{{ $t('clients.basicInfoDescription') }}</p>
              </div>
            </div>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Column 1: Avatar + Name + Status -->
              <div class="info-section ">
                <div class="flex items-center space-x-4">
                  <div class="client-avatar">
                    {{ getInitials(client.name) }}
                  </div>
                  <div>
                    <h2 class="client-name">{{ client.name }}</h2>
                    <p class="client-email">{{ client.email || $t('common.notAvailable') }}</p>
                  </div>
                </div>
                <div class="mt-4">
                  <StatusBadge :status="client.status === 'active' ? 'paid' : 'overdue'" />
                </div>
              </div>

              <!-- Column 2: Contact Info -->
              <div class="info-section">
                <h3 class="section-title">
                  <font-awesome-icon :icon="['fas', 'address-card']" class="ml-2 text-blue-500" />
                  {{ $t('clients.contactInfo') }}
                </h3>
                <div class="space-y-3">
                  <div class="contact-item">
                    <font-awesome-icon :icon="['fas', 'phone']" class="w-4 text-gray-500" />
                    <span>{{ client.phone || $t('common.notAvailable') }}</span>
                  </div>
                  <div class="contact-item">
                    <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="w-4 text-gray-500" />
                    <span>{{ client.address || $t('common.notAvailable') }}</span>
                  </div>
                  <div class="contact-item">
                    <font-awesome-icon :icon="['fas', 'building']" class="w-4 text-gray-500" />
                    <span>{{ client.company_name || $t('common.notAvailable') }}</span>
                  </div>
                  <div class="contact-item" v-if="client.tax_number">
                    <font-awesome-icon :icon="['fas', 'receipt']" class="w-4 text-gray-500" />
                    <span>{{ $t('clients.taxNumber') }}: {{ client.tax_number }}</span>
                  </div>
                </div>
              </div>

              <!-- Column 3: Stats -->
              <div class="info-section">
                <h3 class="section-title">
                  <font-awesome-icon :icon="['fas', 'chart-bar']" class="ml-2 text-green-500" />
                  {{ $t('clients.clientstats') }}
                </h3>
                <div class="space-y-2">
                  <div class="stat-item">
                    <span>{{ $t('clients.stats.totalInvoices') }}:</span>
                    <span class="font-semibold">{{ stats.totalInvoices }}</span>
                  </div>
                  <div class="stat-item">
                    <span>{{ $t('clients.stats.paidInvoices') }}:</span>
                    <span class="font-semibold text-green-600">{{ stats.paidInvoices }}</span>
                  </div>
                  <div class="stat-item">
                    <span>{{ $t('clients.stats.overdueInvoices') }}:</span>
                    <span class="font-semibold text-red-600">{{ stats.overdueInvoices }}</span>
                  </div>
                  <div class="stat-item">
                    <span>{{ $t('clients.stats.totalAmount') }}:</span>
                    <span class="font-semibold text-blue-600">{{ formatCurrency(stats.totalAmount) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Client Invoices Card -->
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-white">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-blue-100 rounded-lg">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-800 dark:text-slate-200">{{ $t('clients.clientInvoices') }}</h2>
                <p class="text-sm text-gray-600 dark:text-slate-400">{{ $t('clients.clientInvoicesDescription') }}</p>
              </div>
            </div>
          </div>

          <div class="p-6">
            <div v-if="clientInvoices.length === 0" class="text-center py-8">
              <font-awesome-icon
                :icon="['fas', 'file-invoice']"
                class="text-gray-300 text-4xl mb-3"
              />
              <p class="text-gray-500">{{ $t('clients.noInvoicesForClient') }}</p>
            </div>

            <BaseTable
              v-else
              :columns="invoiceColumns"
              :data="clientInvoices"
              bordered
              striped
              class="mt-4"
            >
              <template #cell-invoice_number="{ row }">
                <div class="font-medium text-gray-900 dark:text-slate-100">{{ row.invoice_number }}</div>
                <div class="text-sm text-gray-500">#{{ row.id }}</div>
              </template>

              <template #cell-issue_date="{ row }">
                {{ formatDate(row.issue_date) }}
              </template>

              <template #cell-due_date="{ row }">
                <span :class="getDaysRemainingClass(row.due_date)">
                  {{ getDaysRemaining(row.due_date) }}
                </span>
              </template>

              <template #cell-total_amount="{ row }">
                <span class="font-semibold">{{ formatCurrency(row.total_amount) }}</span>
              </template>

              <template #cell-status="{ row }">
                <StatusBadge :status="row.status" />
              </template>

              <template #actions="{ row }">
                <BaseButton
                  @click="$router.push(`/invoices/${row.id}`)"
                  variant="ghost"
                  size="sm"
                  icon="eye"
                  :title="$t('common.view')"
                />
              </template>
            </BaseTable>
          </div>
        </div>

        <!-- Quick Actions & Notes -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Quick Actions Card -->
          <div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-white">
              <div class="flex items-center gap-3">
                <div class="p-2.5 bg-blue-100 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-800 dark:text-slate-200">{{ $t('common.actions') }}</h2>
                  <p class="text-sm text-gray-600 dark:text-slate-400">{{ $t('clients.quickActionsDescription') }}</p>
                </div>
              </div>
            </div>
            <div class="p-6 space-y-3">
              <BaseButton
                v-if="hasPermission('edit_client')"
                @click="editClient"
                type="success"
                icon="edit"
                block
              >
                {{ $t('common.edit') }}
              </BaseButton>

              <BaseButton
                @click="$router.push(`/invoices/create?client_id=${client.id}`)"
                type=""
                icon="plus"
                block
              >
                {{ $t('invoices.createForClient') }}
              </BaseButton>

              <BaseButton @click="sendEmail" variant="outline" icon="envelope" block>
                {{ $t('clients.sendEmail') }}
              </BaseButton>

              <BaseButton
                v-if="hasPermission('delete_client')"
                @click="confirmDelete"
                type="danger"
                icon="trash"
                block
              >
                {{ $t('common.delete') }}
              </BaseButton>
            </div>
          </div>

          <!-- Notes Card -->
          <div v-if="client.notes" class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-white">
              <div class="flex items-center gap-3">
                <div class="p-2.5 bg-blue-100 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-800 dark:text-slate-200">{{ $t('common.notes') }}</h2>
                  <p class="text-sm text-gray-600 dark:text-slate-400">{{ $t('clients.notesDescription') }}</p>
                </div>
              </div>
            </div>
            <div class="p-6">
              <p class="text-gray-700 dark:text-slate-300 whitespace-pre-line">{{ client.notes }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- No Client Found -->
      <BaseAlert
        v-else
        type="warning"
        :title="$t('clients.notFound')"
        :message="`لم يتم العثور على عميل بالرقم: ${$route.params.id}`"
        :actions="noClientActions"
        class="mt-8"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientDetails',
  data() {
    return {
      loading: true,
      error: null,
      client: null,
      clientInvoices: [],
      stats: {
        totalInvoices: 0,
        paidInvoices: 0,
        overdueInvoices: 0,
        totalAmount: 0,
      },
      invoiceColumns: [
        { key: 'invoice_number', label: this.$t('invoices.number'), align: 'center' },
        { key: 'issue_date', label: this.$t('invoices.issueDate'), align: 'center' },
        { key: 'due_date', label: this.$t('invoices.dueDate'), align: 'center' },
        { key: 'total_amount', label: this.$t('invoices.amount'), align: 'center' },
        { key: 'status', label: this.$t('common.status'), align: 'center' },
      ],
    }
  },
  computed: {
    errorActions() {
      return [
        {
          text: this.$t('common.retry'),
          onClick: this.loadClientDetails,
          type: 'danger',
        },
      ]
    },
    noClientActions() {
      return [
        {
          text: this.$t('common.back'),
          onClick: () => this.$router.push('/clients'),
          type: 'primary',
        },
      ]
    },
  },
  mounted() {
    this.loadClientDetails()
  },
  methods: {
    hasPermission(permission) {
      if (this.$store.state.auth.is_admin) return true
      const permissions = this.$store.state.auth.permissions || []
      return permissions.includes(permission)
    },
    getInitials(name) {
      if (!name) return '?'
      return name.substring(0, 2).toUpperCase()
    },
    formatDate(dateString) {
      if (!dateString) return this.$t('common.notAvailable')
      try {
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        }
        return new Date(dateString).toLocaleDateString(
          this.$i18n.locale === 'ar' ? 'en-US' : 'en-US',
          options,
        )
      } catch (error) {
        console.error('Error formatting date:', error)
        return dateString
      }
    },
    formatCurrency(amount) {
      if (!amount && amount !== 0) return this.$t('common.notAvailable')
      try {
        const formatter = new Intl.NumberFormat(this.$i18n.locale === 'ar' ? 'en-US' : 'en-US', {
          style: 'currency',
          currency: this.$i18n.locale === 'ar' ? 'SAR' : 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
        return formatter.format(amount)
      } catch (error) {
        console.error('Error formatting currency:', error)
        return amount
      }
    },
    getDaysRemaining(dueDate) {
      if (!dueDate) return this.$t('common.notAvailable')
      try {
        const today = new Date()
        const due = new Date(dueDate)
        const diffTime = due - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays < 0) return this.$t('invoices.expired')
        if (diffDays === 0) return this.$t('invoices.today')
        if (diffDays === 1) return this.$t('invoices.tomorrow')
        return this.$t('invoices.days', { days: diffDays })
      } catch (error) {
        console.error('Error calculating days remaining:', error)
        return this.$t('common.notAvailable')
      }
    },
    getDaysRemainingClass(dueDate) {
      if (!dueDate) return 'text-gray-600'
      try {
        const today = new Date()
        const due = new Date(dueDate)
        const diffTime = due - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        if (diffDays < 0) return 'text-red-600 font-semibold'
        if (diffDays <= 3) return 'text-yellow-600 font-semibold'
        return 'text-green-600 font-semibold'
      } catch (error) {
        console.error('Error getting days remaining class:', error)
        return 'text-gray-600'
      }
    },
    async loadClientDetails() {
      this.error = null
      this.loading = true

      const clientId = this.$route.params.id

      if (!clientId) {
        this.error = this.$t('errors.invalidClientId')
        this.loading = false
        return
      }

      try {
        this.client = await this.$store.dispatch('clients/fetchClient', clientId)

        // Load client invoices
        await this.loadClientInvoices()
        this.calculateStats()
      } catch (error) {
        console.error('❌ خطأ في تحميل بيانات العميل:', error)
        this.error = error.message || this.$t('errors.loadClientsError')
      } finally {
        this.loading = false
      }
    },
    async loadClientInvoices() {
      try {
        await this.$store.dispatch('invoices/fetchInvoices', {
          client_id: this.client.id,
        })

        const invoices = this.$store.getters['invoices/invoices'] || []
        this.clientInvoices = invoices.filter(invoice => invoice.client_id == this.client.id)
      } catch (error) {
        console.error('Error loading client invoices:', error)
      }
    },
    calculateStats() {
      this.stats.totalInvoices = this.clientInvoices.length
      this.stats.paidInvoices = this.clientInvoices.filter(i => i.status === 'paid').length
      this.stats.overdueInvoices = this.clientInvoices.filter(i => i.status === 'overdue').length
      this.stats.totalAmount = this.clientInvoices.reduce((sum, invoice) => {
        return sum + (parseFloat(invoice.total_amount) || 0)
      }, 0)
    },
    editClient() {
      if (this.client) {
        this.$router.push(`/clients/${this.client.id}/edit`)
      }
    },
    sendEmail() {
      if (this.client?.email) {
        window.location.href = `mailto:${this.client.email}`
      } else {
        this.$toast.warning(this.$t('clients.noEmail'))
      }
    },
    confirmDelete() {
      this.$toast.confirm(
        this.$t('clients.deleteConfirm', { name: this.client.name }),
        async () => {
          await this.deleteClient()
        }
      )
    },
    async deleteClient() {
      try {
        await this.$store.dispatch('clients/deleteClient', this.client.id)
        this.$toast.success(this.$t('messages.deleteSuccess'))
        this.$router.push('/clients')
      } catch (error) {
        this.$toast.error(error.message || this.$t('errors.deleteError'))
      }
    },
  },
  watch: {
    '$route.params.id': {
      handler(newId) {
        if (newId) {
          this.loadClientDetails()
        }
      },
    },
  },
}
</script>

<style scoped>
.client-avatar {
  @apply w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl shadow-sm border border-blue-300;
}

.section-title {
  @apply text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center;
}

.contact-item {
  @apply flex items-center gap-3 text-gray-700 text-sm;
}

.stat-item {
  @apply flex justify-between items-center py-2 border-b border-gray-100 last:border-0 text-sm;
}

.info-section {
  @apply p-2;
}

/* تحسينات عامة */
button {
  transition: all 0.2s ease-in-out;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}
</style>
