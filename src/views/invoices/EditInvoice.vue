<template>
  <div class="min-h-screen bg-slate-100 py-6 md:py-8 dark:bg-slate-900">
    <div class="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
      <!-- ============ Top bar ============ -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
        <nav class="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
          <router-link to="/invoices" class="text-gray-500 hover:text-gray-800 transition-colors dark:text-slate-400 dark:hover:text-slate-100">
            {{ $t('invoices.title') || 'الفواتير' }}
          </router-link>
          <span class="text-gray-300 dark:text-slate-600">/</span>
          <span class="font-semibold text-gray-800 dark:text-slate-100">{{ invoice?.invoice_number || '...' }}</span>
        </nav>
        <button
          type="button"
          @click="$router.push(`/invoices/${invoice?.id}`)"
          class="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {{ $t('common.back') }}
        </button>
      </div>

      <!-- ============ Hero ============ -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6 dark:bg-slate-800 dark:border-slate-700">
        <div class="h-1.5 bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-500"></div>
        <div class="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4 min-w-0">
            <div class="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 dark:bg-blue-900/30 dark:border-blue-800">
              <svg class="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div class="min-w-0">
              <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 truncate dark:text-slate-100">{{ $t('invoices.edit') }}</h1>
              <p class="text-gray-500 text-sm mt-0.5 dark:text-slate-400">{{ $t('invoices.editDescription') }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-sm font-bold text-gray-700 dark:text-slate-200"># {{ invoice?.invoice_number }}</span>
            <span
              :class="getStatusBadgeClass(invoice?.status)"
              class="px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5"
            >
              <span :class="getStatusDotClass(invoice?.status)" class="w-2 h-2 rounded-full"></span>
              {{ getStatusText(invoice?.status) }}
            </span>
          </div>
        </div>
      </div>

      <!-- ============ Loading ============ -->
      <div v-if="loading" class="bg-white rounded-2xl border border-gray-200 shadow-sm py-16 flex flex-col items-center dark:bg-slate-800 dark:border-slate-700">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4 dark:border-blue-900"></div>
        <p class="text-gray-700 font-medium dark:text-slate-200">{{ $t('common.loading') }}</p>
        <p class="text-sm text-gray-500 mt-1 dark:text-slate-400">{{ $t('invoices.loadingInvoice') }}</p>
      </div>

      <!-- ============ Error ============ -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-5 dark:bg-red-900/20 dark:border-red-800">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="flex-1">
            <h3 class="text-sm font-semibold text-red-800 dark:text-red-300">{{ $t('common.error') }}</h3>
            <p class="text-sm text-red-700 mt-1 dark:text-red-300">{{ error }}</p>
          </div>
          <button type="button" @click="clearError" class="p-1.5 text-red-700 hover:text-red-900 dark:text-red-300">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- ============ Form ============ -->
      <form v-else @submit.prevent="submitInvoice">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- ---------- Main column ---------- -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Basic info -->
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden dark:bg-slate-800 dark:border-slate-700">
              <div class="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                <h2 class="text-base font-bold text-gray-900 dark:text-slate-100">{{ $t('invoices.basicInfo') }}</h2>
                <p class="text-sm text-gray-500 mt-0.5 dark:text-slate-400">{{ $t('invoices.updateDescription') }}</p>
              </div>
              <div class="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-200">{{ $t('invoices.invoiceNumber') }}</label>
                  <input
                    v-model="form.invoice_number"
                    type="text"
                    :placeholder="$t('invoices.invoiceNumberPlaceholder')"
                    class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
                    :class="{ 'border-red-300': errors.invoice_number }"
                    required
                  />
                  <p v-if="errors.invoice_number" class="text-sm text-red-600 dark:text-red-400">{{ errors.invoice_number }}</p>
                </div>

                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-200">{{ $t('branch.title') || 'الفرع' }}</label>
                  <select
                    v-model="form.branch_id"
                    class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500"
                  >
                    <option class="dark:bg-slate-800 dark:text-slate-100" :value="null">{{ $t('branch.unassigned') || 'بدون فرع' }}</option>
                    <option class="dark:bg-slate-800 dark:text-slate-100" v-for="branch in branches" :key="branch.id" :value="branch.id">
                      {{ branch.name }}
                    </option>
                  </select>
                </div>

                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-200">{{ $t('invoices.issueDate') }}</label>
                  <input
                    v-model="form.invoice_date"
                    type="date"
                    class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:[color-scheme:dark]"
                    :class="{ 'border-red-300': errors.invoice_date }"
                    required
                  />
                  <p v-if="errors.invoice_date" class="text-sm text-red-600 dark:text-red-400">{{ errors.invoice_date }}</p>
                </div>

                <div class="space-y-1.5">
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-200">{{ $t('invoices.dueDate') }}</label>
                  <input
                    v-model="form.due_date"
                    type="date"
                    class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500 dark:[color-scheme:dark]"
                    :class="{ 'border-red-300': errors.due_date }"
                    required
                  />
                  <p v-if="errors.due_date" class="text-sm text-red-600 dark:text-red-400">{{ errors.due_date }}</p>
                </div>
              </div>
            </div>

            <!-- Items -->
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden dark:bg-slate-800 dark:border-slate-700">
              <div class="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3 dark:border-slate-700">
                <h2 class="text-base font-bold text-gray-900 dark:text-slate-100">{{ $t('invoices.items') }}</h2>
                <button
                  type="button"
                  @click="addItem"
                  class="px-3.5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  {{ $t('invoices.addItem') }}
                </button>
              </div>

              <div class="px-5 sm:px-6">
                <!-- Column headers (desktop) -->
                <div class="hidden md:grid md:grid-cols-12 gap-3 py-3 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider dark:border-slate-700 dark:text-slate-400">
                  <div class="md:col-span-5">{{ $t('common.description') }}</div>
                  <div class="md:col-span-2">{{ $t('common.quantity') }}</div>
                  <div class="md:col-span-2">{{ $t('common.unitPrice') }}</div>
                  <div class="md:col-span-2">{{ $t('common.itemTotal') }}</div>
                  <div class="md:col-span-1"></div>
                </div>

                <!-- Rows -->
                <div
                  v-for="(item, index) in form.items"
                  :key="index"
                  class="grid grid-cols-2 md:grid-cols-12 gap-3 py-4 border-b border-gray-100 last:border-b-0 items-start dark:border-slate-700"
                >
                  <div class="col-span-2 md:col-span-5">
                    <label class="md:hidden block text-xs font-medium text-gray-500 mb-1 dark:text-slate-400">{{ $t('common.description') }}</label>
                    <input
                      v-model="item.description"
                      type="text"
                      :placeholder="$t('invoices.itemDescription')"
                      class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
                      required
                    />
                  </div>

                  <div class="col-span-1 md:col-span-2">
                    <label class="md:hidden block text-xs font-medium text-gray-500 mb-1 dark:text-slate-400">{{ $t('common.quantity') }}</label>
                    <input
                      v-model="item.quantity"
                      type="number"
                      min="1"
                      class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
                      @input="calculateTotals"
                      required
                    />
                  </div>

                  <div class="col-span-1 md:col-span-2">
                    <label class="md:hidden block text-xs font-medium text-gray-500 mb-1 dark:text-slate-400">{{ $t('common.unitPrice') }}</label>
                    <input
                      v-model="item.unit_price"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
                      @input="calculateTotals"
                      required
                    />
                  </div>

                  <div class="col-span-1 md:col-span-2 flex flex-col justify-center md:h-10">
                    <span class="md:hidden block text-xs font-medium text-gray-500 mb-1 dark:text-slate-400">{{ $t('common.itemTotal') }}</span>
                    <span class="text-sm font-bold text-gray-900 dark:text-slate-100">{{ formatCurrency(item.total || 0) }}</span>
                  </div>

                  <div class="col-span-1 md:col-span-1 flex items-center justify-end md:justify-center md:h-10">
                    <button
                      type="button"
                      @click="removeItem(index)"
                      :disabled="form.items.length === 1"
                      class="w-10 h-10 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden dark:bg-slate-800 dark:border-slate-700">
              <div class="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-slate-700">
                <h2 class="text-base font-bold text-gray-900 dark:text-slate-100">{{ $t('common.notes') }}</h2>
              </div>
              <div class="p-5 sm:p-6">
                <textarea
                  v-model="form.notes"
                  :placeholder="$t('invoices.notesPlaceholder')"
                  rows="4"
                  class="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-500"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- ---------- Sidebar ---------- -->
          <div class="lg:col-span-1">
            <div class="lg:sticky lg:top-6 space-y-6">
              <!-- Client -->
              <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 dark:bg-slate-800 dark:border-slate-700">
                <p class="text-xs font-bold tracking-wider text-gray-400 uppercase mb-3 dark:text-slate-500">{{ $t('invoices.client') }}</p>
                <div class="flex items-center gap-3">
                  <div class="w-11 h-11 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold flex-shrink-0 dark:from-blue-900/50 dark:to-blue-800/50 dark:text-blue-400">
                    {{ getInitials(invoice?.client?.name) }}
                  </div>
                  <div class="min-w-0">
                    <p class="font-semibold text-gray-900 truncate dark:text-slate-100">{{ invoice?.client?.name || $t('common.notAvailable') }}</p>
                    <p class="text-sm text-gray-500 truncate dark:text-slate-400">{{ invoice?.client?.email || $t('common.notAvailable') }}</p>
                  </div>
                </div>
              </div>

              <!-- Summary + actions -->
              <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden dark:bg-slate-800 dark:border-slate-700">
                <div class="p-5 bg-gradient-to-br from-blue-700 to-indigo-700 text-white">
                  <p class="text-xs font-semibold tracking-wide uppercase text-blue-100">{{ $t('common.total') }}</p>
                  <p class="text-3xl font-extrabold mt-1">{{ formatCurrency(form.total) }}</p>
                </div>
                <div class="p-5 space-y-3 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-slate-300">{{ $t('common.subtotal') }}</span>
                    <span class="font-semibold text-gray-900 dark:text-slate-100">{{ formatCurrency(form.subtotal) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600 dark:text-slate-300">{{ $t('common.tax') }} (15%)</span>
                    <span class="font-semibold text-gray-900 dark:text-slate-100">{{ formatCurrency(form.tax_amount) }}</span>
                  </div>
                </div>
                <div class="p-5 pt-0 flex flex-col gap-2">
                  <button
                    type="submit"
                    :disabled="updating || !isFormValid"
                    class="w-full px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg v-if="!updating" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <svg v-else class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {{ updating ? $t('common.updating') : $t('common.update') }}
                  </button>
                  <button
                    type="button"
                    @click="$router.push(`/invoices/${invoice?.id}`)"
                    :disabled="updating"
                    class="w-full px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    {{ $t('common.cancel') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'EditInvoice',

  data() {
    return {
      form: {
        invoice_number: '',
        invoice_date: '',
        due_date: '',
        branch_id: null,
        items: [
          {
            description: '',
            quantity: 1,
            unit_price: 0,
            total: 0,
          },
        ],
        notes: '',
        subtotal: 0,
        tax_amount: 0,
        total: 0,
      },
      errors: {},
      updating: false,
    }
  },

  computed: {
    ...mapState('branch', ['branches']),
    ...mapGetters('invoices', ['loading', 'error', 'currentInvoice']),

    invoice() {
      return this.currentInvoice
    },

    isFormValid() {
      return (
        this.form.invoice_number &&
        this.form.invoice_date &&
        this.form.due_date &&
        this.form.items.every(
          (item) => item.description && item.quantity > 0 && item.unit_price >= 0,
        )
      )
    },
  },

  mounted() {
    this.loadInvoice()
    // قد تكون هذي الصفحة أول صفحة تُفتح قبل ما BranchSelector (بالنافبار)
    // يجيب الفروع - خصوصاً على الموبايل وين BranchSelector مخفي أصلاً
    this.$store.dispatch('branch/fetchMyBranches')
  },

  methods: {
    ...mapActions('invoices', ['fetchInvoice', 'updateInvoice', 'clearError']),

    async loadInvoice() {
      const invoiceId = this.$route.params.id
      await this.fetchInvoice(invoiceId)

      if (this.invoice) {
        this.form = {
          invoice_number: this.invoice.invoice_number || '',
          invoice_date: this.invoice.invoice_date?.split('T')[0] || '',
          due_date: this.invoice.due_date?.split('T')[0] || '',
          branch_id: this.invoice.branch_id || null,
          items: this.invoice.items?.map((item) => ({
            description: item.description || '',
            quantity: item.quantity || 1,
            unit_price: item.unit_price || 0,
            total: (item.quantity || 1) * (item.unit_price || 0),
          })) || [
            {
              description: '',
              quantity: 1,
              unit_price: 0,
              total: 0,
            },
          ],
          notes: this.invoice.notes || '',
          subtotal: this.invoice.subtotal || 0,
          tax_amount: this.invoice.tax_amount || 0,
          total: this.invoice.total || 0,
        }

        this.calculateTotals()
      }
    },

    calculateTotals() {
      this.form.items.forEach((item) => {
        item.total = (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)
      })

      const subtotal = this.form.items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0)
      const tax_amount = subtotal * 0.15
      const total = subtotal + tax_amount

      this.form.subtotal = subtotal
      this.form.tax_amount = tax_amount
      this.form.total = total
    },

    addItem() {
      this.form.items.push({
        description: '',
        quantity: 1,
        unit_price: 0,
        total: 0,
      })
    },

    removeItem(index) {
      if (this.form.items.length > 1) {
        this.form.items.splice(index, 1)
        this.calculateTotals()
      }
    },

    formatCurrency(amount) {
      if (!amount && amount !== 0) return '0.00 ر.س'
      const formatter = new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 2,
      })
      return formatter.format(amount)
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

    getInitials(name) {
      if (!name) return '؟؟'
      return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
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
        draft: 'مسودة',
        sent: 'مرسلة',
        paid: 'مدفوعة',
        overdue: 'متأخرة',
      }
      return texts[status] || status
    },

    async submitInvoice() {
      this.errors = {}
      this.updating = true

      try {
        if (!this.form.invoice_number.trim()) {
          this.errors.invoice_number = 'الرجاء إدخال رقم الفاتورة'
          return
        }

        if (!this.form.invoice_date) {
          this.errors.invoice_date = 'الرجاء اختيار تاريخ الإصدار'
          return
        }

        if (!this.form.due_date) {
          this.errors.due_date = 'الرجاء اختيار تاريخ الاستحقاق'
          return
        }

        const invoiceData = {
          invoice_number: this.form.invoice_number,
          invoice_date: this.form.invoice_date,
          due_date: this.form.due_date,
          branch_id: this.form.branch_id,
          subtotal: this.form.subtotal,
          tax_amount: this.form.tax_amount,
          total: this.form.total,
          notes: this.form.notes,
          items: this.form.items.map((item) => ({
            description: item.description,
            quantity: parseFloat(item.quantity),
            unit_price: parseFloat(item.unit_price),
          })),
        }

        await this.updateInvoice({
          id: this.invoice.id,
          data: invoiceData,
        })

        this.$toast.success(this.$t('invoices.updateSuccess'), {
          position: 'bottom-left',
          duration: 3000,
        })
        this.$router.push(`/invoices/${this.invoice.id}`)
      } catch (error) {
        console.error('❌ خطأ في تحديث الفاتورة:', error)

        if (error.response?.data?.errors) {
          this.errors = error.response.data.errors
        } else {
          this.$toast.error(error.response?.data?.message || this.$t('invoices.updateError'), {
            position: 'bottom-left',
            duration: 3000,
          })
        }
      } finally {
        this.updating = false
      }
    },
  },

  watch: {
    'form.items': {
      handler() {
        this.calculateTotals()
      },
      deep: true,
    },
  },
}
</script>

<style scoped>
/* تحسينات التصميم */
input:focus,
textarea:focus {
  outline: none;
  ring: 2px;
  ring-color: rgba(59, 130, 246, 0.5);
}

/* تحسينات للجوّال */
@media (max-width: 768px) {
  .grid-cols-12 > * {
    grid-column: span 12;
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

/* تحسينات الظلال والحدود */
.shadow-sm {
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.hover\:shadow-md:hover {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* تحسينات الأزرار */
button {
  transition: all 0.2s ease-in-out;
}

button:hover:not(:disabled) {
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
</style>