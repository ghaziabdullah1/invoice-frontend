<template>
  <div class="min-h-screen bg-gray-100 dark:bg-slate-800 py-6 md:py-8 print:bg-white dark:bg-slate-800">
    <div class="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
      
      <!-- ============ Top bar (hidden on print) ============ -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-5 print:hidden">
        <nav class="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
          <router-link to="/invoices" class="text-gray-500 hover:text-gray-800 dark:text-slate-200 transition-colors">
            {{ $t('invoices.title') || 'الفواتير' }}
          </router-link>
          <span class="text-gray-300">/</span>
          <span class="font-semibold text-gray-800 dark:text-slate-200">{{ invoice?.invoice_number || '...' }}</span>
        </nav>
        <button
          @click="$router.push('/invoices')"
          class="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 text-sm rounded-lg hover:bg-gray-50 dark:bg-slate-900 transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {{ $t('common.back') || 'رجوع' }}
        </button>
      </div>

      <!-- ============ Loading ============ -->
      <div v-if="loading" class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm py-16 flex flex-col items-center print:hidden">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
        <p class="text-gray-600 dark:text-slate-400">{{ $t('common.loading') || 'جاري التحميل...' }}</p>
      </div>

      <!-- ============ Not found ============ -->
      <div v-else-if="notFound" class="bg-white dark:bg-slate-800 rounded-2xl border border-yellow-200 shadow-sm p-10 text-center print:hidden">
        <div class="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">{{ $t('invoices.notFound') || 'الفاتورة غير موجودة' }}</h3>
        <p class="text-gray-600 dark:text-slate-400 mb-6">{{ $t('invoices.notFoundMessage') || 'لم يتم العثور على فاتورة بهذا الرقم' }}</p>
        <button @click="$router.push('/invoices')" class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          {{ $t('common.backToList') || 'العودة إلى القائمة' }}
        </button>
      </div>

      <!-- ============ Error ============ -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-5 print:hidden">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="flex-1">
            <h3 class="text-sm font-semibold text-red-800">{{ $t('common.error') || 'خطأ' }}</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
            <button @click="loadInvoice" class="mt-3 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
              {{ $t('common.retry') || 'إعادة المحاولة' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ============ Invoice Paper ============ -->
      <div v-else-if="invoice" class="bg-white dark:bg-slate-800 shadow-xl rounded-lg overflow-hidden print:shadow-none print:rounded-none">
        
        <!-- Header -->
        <div class="p-8 border-b-2 border-gray-900 flex justify-between items-start">
          <div class="flex-1">
            <h1 class="text-2xl font-extrabold text-gray-900 dark:text-slate-100">{{ COMPANY.name }}</h1>
            <p class="text-sm text-gray-600 dark:text-slate-400 mt-1">{{ COMPANY.address }}</p>
            <p class="text-sm text-gray-600 dark:text-slate-400" v-if="COMPANY.phone">Phone: {{ COMPANY.phone }}</p>
            <p class="text-sm text-gray-600 dark:text-slate-400" v-if="COMPANY.taxNumber">VAT: {{ COMPANY.taxNumber }}</p>
          </div>
          <div class="flex-1 flex justify-center">
            <img v-if="COMPANY.logo" :src="COMPANY.logo" class="h-20 object-contain" />
            <div v-else class="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500 font-bold">LOGO</div>
          </div>
          <div class="flex-1 text-right">
            <h2 class="text-3xl font-black text-blue-900 uppercase">Invoice</h2>
            <p class="text-lg font-bold text-gray-700 dark:text-slate-300 mt-1"># {{ invoice.invoice_number }}</p>
            <span class="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold" :class="getStatusBadgeClass(invoice.status)">
              {{ getStatusText(invoice.status) }}
            </span>
          </div>
        </div>

        <!-- Client & Dates -->
        <div class="p-8 grid grid-cols-2 gap-8 border-b border-gray-200 dark:border-slate-700">
          <div>
            <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bill To</h3>
            <p class="font-bold text-gray-900 dark:text-slate-100">{{ invoice.client?.name || '-' }}</p>
            <p class="text-sm text-gray-600 dark:text-slate-400" v-if="invoice.client?.company_name && invoice.client.company_name !== '.'">{{ invoice.client.company_name }}</p>
            <p class="text-sm text-gray-600 dark:text-slate-400">{{ invoice.client?.email }}</p>
            <p class="text-sm text-gray-600 dark:text-slate-400">{{ invoice.client?.phone }}</p>
          </div>
          <div class="text-right space-y-2">
            <div>
              <span class="text-xs font-bold text-gray-500 uppercase block">Issue Date</span>
              <span class="text-sm font-semibold text-gray-900 dark:text-slate-100">{{ formatDate(invoice.invoice_date) }}</span>
            </div>
            <div>
              <span class="text-xs font-bold text-gray-500 uppercase block">Due Date</span>
              <span class="text-sm font-semibold text-gray-900 dark:text-slate-100">{{ formatDate(invoice.due_date) }}</span>
            </div>
            <div v-if="invoice.paid_at">
              <span class="text-xs font-bold text-green-600 uppercase block">Paid On</span>
              <span class="text-sm font-semibold text-green-700">{{ formatDate(invoice.paid_at) }}</span>
            </div>
          </div>
        </div>

        <!-- Items -->
        <div class="p-8">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-y-2 border-gray-900">
                <th class="py-3 px-2 text-left text-xs font-bold text-gray-900 dark:text-slate-100 uppercase">#</th>
                <th class="py-3 px-2 text-left text-xs font-bold text-gray-900 dark:text-slate-100 uppercase">Description</th>
                <th class="py-3 px-2 text-center text-xs font-bold text-gray-900 dark:text-slate-100 uppercase">Qty</th>
                <th class="py-3 px-2 text-start text-xs font-bold text-gray-900 dark:text-slate-100 uppercase">Unit Price</th>
                <th class="py-3 px-2 text-start text-xs font-bold text-gray-900 dark:text-slate-100 uppercase">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in invoice.items" :key="idx" class="border-b border-gray-200 dark:border-slate-700">
                <td class="py-3 px-2 text-sm text-gray-600 dark:text-slate-400">{{ idx + 1 }}</td>
                <td class="py-3 px-2 text-sm text-gray-900 dark:text-slate-100">
                  <span class="font-medium">{{ item.description }}</span>
                  <span v-if="item.notes" class="block text-xs text-gray-500">{{ item.notes }}</span>
                </td>
                <td class="py-3 px-2 text-sm text-center text-gray-900 dark:text-slate-100">{{ item.quantity }}</td>
                <td class="py-3 px-2 text-sm text-right text-gray-900 dark:text-slate-100">{{ formatCurrency(item.unit_price) }}</td>
                <td class="py-3 px-2 text-sm font-bold text-right text-gray-900 dark:text-slate-100">{{ formatCurrency(item.total) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Totals & Notes -->
        <div class="p-8 flex flex-col md:flex-row justify-between gap-8 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
          <div class="flex-1 text-sm text-gray-600 dark:text-slate-400">
            <h4 class="font-bold text-gray-900 dark:text-slate-100 mb-1" v-if="invoice.notes">Notes</h4>
            <p class="whitespace-pre-line" v-if="invoice.notes">{{ invoice.notes }}</p>
          </div>
          <div class="w-full md:w-80">
            <div class="flex justify-between py-2 text-sm text-gray-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span class="font-semibold text-gray-900 dark:text-slate-100">{{ formatCurrency(invoice.subtotal) }}</span>
            </div>
            <div v-if="parseFloat(invoice.discount_amount) > 0" class="flex justify-between py-2 text-sm text-gray-600 dark:text-slate-400 border-t border-gray-200 dark:border-slate-700">
              <span>Discount</span>
              <span class="font-semibold text-red-600">-{{ formatCurrency(invoice.discount_amount) }}</span>
            </div>
            <div class="flex justify-between py-2 text-sm text-gray-600 dark:text-slate-400 border-t border-gray-200 dark:border-slate-700">
              <span>Tax ({{ invoice.tax_rate || 0 }}%)</span>
              <span class="font-semibold text-gray-900 dark:text-slate-100">{{ formatCurrency(invoice.tax_amount) }}</span>
            </div>
            <div class="flex justify-between py-3 mt-2 bg-blue-900 text-white px-4 rounded-lg">
              <span class="font-bold">Total Due</span>
              <span class="text-lg font-extrabold">{{ formatCurrency(invoice.total) }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-8 border-t border-gray-200 dark:border-slate-700 flex justify-between text-xs text-gray-500">
          <div>
            <p><strong>Created By:</strong> {{ invoice.created_by?.name || 'System' }}</p>
            <p><strong>Created On:</strong> {{ formatDateTime(invoice.created_at) }}</p>
          </div>
          <div class="text-right">
            <p><strong>Printed By:</strong> {{ printedBy }}</p>
            <p><strong>Printed On:</strong> {{ printedOn }}</p>
          </div>
        </div>
      </div>

      <!-- ============ Action Bar (hidden on print) ============ -->
      <div v-if="invoice" class="mt-6 flex flex-wrap gap-3 print:hidden">
        <!-- 1. تعديل -->
        <router-link v-if="hasEditPermission && invoice.status !== 'paid'" :to="`/invoices/${invoice.id}/edit`" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          {{ $t('common.edit') || 'تعديل' }}
        </router-link>

        <!-- 2. تعليم كمدفوعة -->
        <button v-if="invoice.status !== 'paid' && hasEditPermission" @click="markAsPaid" :disabled="markPaidLoading" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50">
          <svg v-if="markPaidLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {{ $t('invoices.markAsPaid') || 'تعليم كمدفوعة' }}
        </button>

        <!-- 3. دفع عبر Stripe -->
        <button v-if="invoice.enable_stripe_checkout && invoice.status !== 'paid'" @click="payWithStripe" :disabled="stripeLoading" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 disabled:opacity-50">
          <svg v-if="stripeLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          {{ stripeLoading ? 'جاري التحميل...' : 'ادفع عبر Stripe' }}
        </button>

        <!-- 4. رابط دفع -->
        <button v-if="invoice.status !== 'paid'" @click="openPaymentLinkGenerator" class="px-4 py-2 bg-white dark:bg-slate-800 border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5" /></svg>
          {{ $t('payment_links.title') || 'رابط دفع' }}
        </button>

        <!-- 5. طباعة -->
        <button @click="printInvoice" class="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:bg-slate-900 transition flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          {{ $t('invoices.print_invoice') || 'طباعة' }}
        </button>

        <!-- 6. إرسال بالبريد -->
        <button v-if="invoice.client?.email" @click="sendEmail" class="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:bg-slate-900 transition flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89-4.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          {{ $t('invoices.sendEmail') || 'إرسال بالبريد' }}
        </button>

        <!-- 7. إلغاء الفاتورة -->
        <button v-if="hasEditPermission && invoice.status === 'paid'" @click="confirmCancel" :disabled="cancelLoading" class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center gap-2 disabled:opacity-50">
          <svg v-if="cancelLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
          {{ $t('invoices.cancelInvoice') || 'إلغاء الفاتورة' }}
        </button>

        <!-- 8. حذف -->
        <button v-if="hasDeletePermission" @click="confirmDelete" class="px-4 py-2 bg-white dark:bg-slate-800 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          {{ $t('common.delete') || 'حذف' }}
        </button>
      </div>

      <!-- ============ Installment Plan Section ============ -->
      <div v-if="invoice" class="mt-6 print:hidden">
        <InstallmentPlanSection
          :invoice-id="invoice.id"
          :invoice-total="invoice.total"
          :can-manage="canManageInstallments"
          @generate-link="openPaymentLinkForInstallment"
        />
      </div>

    </div>
  </div>
</template>

<script>
import { COMPANY } from '@/config/company'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import InstallmentPlanSection from '@/components/invoices/InstallmentPlanSection.vue'
import PaymentLinkGenerator from '@/components/invoices/PaymentLinkGenerator.vue'

export default {
  components: {
    InstallmentPlanSection,
    PaymentLinkGenerator,
  },
  name: 'InvoiceDetails',

  data() {
    return {
      COMPANY,
      loading: true,
      error: null,
      notFound: false,
      invoice: null,
      printedOn: moment().format('DD-MM-YYYY hh:mm a'),
      printedBy: JSON.parse(localStorage.getItem('userInfo') || '{}')?.user?.name || 'User',
      hasEditPermission: false,
      hasDeletePermission: false,
      stripeLoading: false,
      cancelLoading: false,
      markPaidLoading: false,
      showPaymentLinkGenerator: false,
      installmentToPreselect: null,
    }
  },

  computed: {
    ...mapGetters('auth', ['user', 'permissions']),
    isPaid() {
      return this.invoice?.status === 'paid'
    },
    canManageInstallments() {
      return this.hasEditPermission
    },
  },

  mounted() {
    this.checkPermissions()
    this.loadInvoice()
    this.checkPaymentReturn()
  },

  methods: {
    ...mapActions('invoices', ['fetchInvoice', 'deleteInvoice', 'updateInvoiceStatus']),
    ...mapActions('payments', ['createPaymentSession']),

    checkPermissions() {
      const perms = this.permissions || []
      this.hasEditPermission = perms.includes('edit_invoice')
      this.hasDeletePermission = perms.includes('delete_invoice')
    },

    async loadInvoice() {
      this.loading = true
      this.error = null
      this.notFound = false
      const id = this.$route.params.id
      if (!id) {
        this.error = 'رقم الفاتورة غير صالح'
        this.loading = false
        return
      }
      try {
        const invoice = await this.fetchInvoice(id)
        if (invoice && invoice.id) {
          this.invoice = invoice
        } else {
          this.notFound = true
        }
      } catch (err) {
        if (err.response?.status === 404) {
          this.notFound = true
        } else {
          this.error = err.message || 'حدث خطأ أثناء تحميل الفاتورة'
        }
      } finally {
        this.loading = false
      }
    },

    checkPaymentReturn() {
      const status = this.$route.query.payment
      if (!status) return
      if (status === 'success') {
        this.$toast.success(this.$t('invoices.paymentSuccess') || 'تم الدفع بنجاح!')
        this.loadInvoice()
      } else if (status === 'cancelled') {
        this.$toast.warning(this.$t('invoices.paymentCancelled') || 'تم إلغاء الدفع')
      }
      this.$router.replace({ query: {} })
    },

    printInvoice() {
      const invoice = this.invoice
      if (!invoice) return

      this.printedOn = moment().format('DD-MM-YYYY hh:mm a')
      const isAr = this.$i18n.locale === 'ar'
      const dir = isAr ? 'rtl' : 'ltr'
      
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        this.$toast.warning('المتصفح منع نافذة الطباعة')
        return
      }

      const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

      // هنا نستخدم نفس التصميم الاحترافي للطباعة
      const styles = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
          @page { size: A4; margin: 14mm; }
          * { box-sizing: border-box; }
          html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body { font-family: 'Tajawal', 'Segoe UI', Tahoma, Arial, sans-serif; direction: ${dir}; color: #1f2937; margin: 0; font-size: 13px; line-height: 1.55; background: #fff; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; margin-bottom: 26px; border-bottom: 2px solid #000; padding-bottom: 15px; }
          .brand-name { font-size: 20px; font-weight: 800; color: #1e3a8a; }
          .brand-meta { font-size: 11.5px; color: #6b7280; margin-top: 2px; }
          .doc-title { text-align: end; }
          .doc-title h1 { margin: 0; font-size: 32px; font-weight: 800; color: #1e3a8a; text-transform: uppercase; }
          .doc-title .num { font-size: 14px; font-weight: 700; color: #374151; margin-top: 2px; }
          .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 22px; }
          .card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; background: #f9fafb; }
          .card h3 { margin: 0 0 8px; font-size: 11px; letter-spacing: .8px; color: #6b7280; font-weight: 700; text-transform: uppercase; }
          .client-name { font-size: 15px; font-weight: 800; color: #111827; margin-bottom: 4px; }
          .client-line { color: #4b5563; }
          table.items { width: 100%; border-collapse: collapse; margin-bottom: 18px; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
          .items thead th { background: #1e3a8a; color: #fff; padding: 10px 12px; font-size: 12px; font-weight: 700; text-align: center; }
          .items tbody td { padding: 10px 12px; border-top: 1px solid #eef0f3; text-align: center; }
          .items tbody tr:nth-child(even) td { background: #f9fafb; }
          .items .desc { text-align: start; }
          .totals { width: 300px; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; margin-left: auto; margin-top: 20px; }
          .totals .tr { display: flex; justify-content: space-between; padding: 8px 14px; }
          .totals .tr + .tr { border-top: 1px solid #eef0f3; }
          .totals .grand { background: #1e3a8a; color: #fff; font-size: 15px; font-weight: 800; }
          .footer { margin-top: 40px; padding-top: 10px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 10.5px; color: #9ca3af; }
        </style>
      `

      const itemsHtml = invoice.items.map((item, i) => `
        <tr>
          <td>${i + 1}</td>
          <td class="desc">${esc(item.description)}</td>
          <td>${esc(item.quantity)}</td>
          <td>${this.formatCurrency(item.unit_price)}</td>
          <td><strong>${this.formatCurrency(item.total)}</strong></td>
        </tr>
      `).join('')

      const html = `
        <html dir="${dir}">
          <head><meta charset="utf-8" /><title>Invoice ${esc(invoice.invoice_number)}</title>${styles}</head>
          <body>
            <div class="header">
              <div>
                <div class="brand-name">${esc(COMPANY.name)}</div>
                <div class="brand-meta">${esc(COMPANY.address)}</div>
                <div class="brand-meta">${COMPANY.phone ? 'Phone: ' + esc(COMPANY.phone) : ''}</div>
              </div>
              <div class="doc-title">
                <h1>INVOICE</h1>
                <div class="num"># ${esc(invoice.invoice_number)}</div>
              </div>
            </div>

            <div class="meta">
              <div class="card">
                <h3>Bill To</h3>
                <div class="client-name">${esc(invoice.client?.name || '-')}</div>
                <div class="client-line">${esc(invoice.client?.email || '')}</div>
                <div class="client-line">${esc(invoice.client?.phone || '')}</div>
              </div>
              <div class="card">
                <h3>Details</h3>
                <div style="display:flex;justify-content:space-between"><span>Issue Date</span><strong>${this.formatDate(invoice.invoice_date)}</strong></div>
                <div style="display:flex;justify-content:space-between"><span>Due Date</span><strong>${this.formatDate(invoice.due_date)}</strong></div>
              </div>
            </div>

            <table class="items">
              <thead><tr><th>#</th><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
              <tbody>${itemsHtml}</tbody>
            </table>

            <div class="totals">
              <div class="tr"><span>Subtotal</span><span>${this.formatCurrency(invoice.subtotal)}</span></div>
              <div class="tr"><span>Tax</span><span>${this.formatCurrency(invoice.tax_amount)}</span></div>
              <div class="tr grand"><span>Total</span><span>${this.formatCurrency(invoice.total)}</span></div>
            </div>

            <div class="footer">
              <span>Created By: ${esc(invoice.created_by?.name || 'System')} - ${this.formatDateTime(invoice.created_at)}</span>
              <span>Printed By: ${esc(this.printedBy)} - ${this.printedOn}</span>
            </div>
          </body>
        </html>
      `

      printWindow.document.write(html)
      printWindow.document.close()
      setTimeout(() => { printWindow.focus(); printWindow.print(); }, 500)
      printWindow.onafterprint = () => printWindow.close()
    },

    async markAsPaid() {
      const result = await this.$swal.fire({
        title: 'تعليم الفاتورة كمدفوعة؟',
        text: 'سيتم تحديث حالة الفاتورة إلى "مدفوعة".',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#16A34A',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'نعم، تعليم كمدفوعة',
        cancelButtonText: 'تراجع',
      })
      if (!result.isConfirmed) return

      this.markPaidLoading = true
      try {
        await this.updateInvoiceStatus({ id: this.invoice.id, status: 'paid' })
        this.$toast.success('تم تعليم الفاتورة كمدفوعة')
        await this.loadInvoice()
      } catch (err) {
        this.$toast.error(err.message || 'فشل تحديث حالة الفاتورة')
      } finally {
        this.markPaidLoading = false
      }
    },

    openPaymentLinkGenerator() {
      this.installmentToPreselect = null
      this.showPaymentLinkGenerator = true
    },

    openPaymentLinkForInstallment(inst) {
      this.installmentToPreselect = inst.installment_number
      this.showPaymentLinkGenerator = true
    },

    async payWithStripe() {
      this.stripeLoading = true
      try {
        const data = await this.createPaymentSession(this.invoice.id)
        if (data?.url) {
          window.location.href = data.url
        }
      } catch (err) {
        this.$toast.error(err.message || this.$t('invoices.paymentError') || 'فشل في بدء الدفع')
      } finally {
        this.stripeLoading = false
      }
    },

    confirmCancel() {
      this.$swal.fire({
        title: 'إلغاء الفاتورة المدفوعة؟',
        text: 'سيتم تغيير حالة الفاتورة إلى "ملغاة".',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F97316',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'نعم، إلغاء الفاتورة',
        cancelButtonText: 'تراجع',
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.cancelLoading = true
          try {
            await this.updateInvoiceStatus({ id: this.invoice.id, status: 'cancelled' })
            this.$toast.success('تم إلغاء الفاتورة')
            await this.loadInvoice()
          } catch (err) {
            this.$toast.error(err.message || 'فشل إلغاء الفاتورة')
          } finally {
            this.cancelLoading = false
          }
        }
      })
    },

    confirmDelete() {
      this.$swal.fire({
        title: 'هل أنت متأكد؟',
        text: `سيتم حذف الفاتورة رقم ${this.invoice.invoice_number}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'حذف',
        cancelButtonText: 'إلغاء',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await this.deleteInvoice(this.invoice.id)
            this.$toast.success('تم الحذف بنجاح')
            this.$router.push('/invoices')
          } catch (err) {
            this.$toast.error(err.message || 'فشل الحذف')
          }
        }
      })
    },

    sendEmail() {
      if (!this.invoice?.client?.email) {
        this.$toast.warning('لا يوجد بريد إلكتروني للعميل')
        return
      }
      const subject = `فاتورة ${this.invoice.invoice_number}`
      const body = `مرحباً،\n\nفاتورة رقم ${this.invoice.invoice_number} بمبلغ ${this.formatCurrency(this.invoice.total)}.\n\nشكراً لتعاملكم.`
      window.location.href = `mailto:${this.invoice.client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    },

    formatDate(date) {
      if (!date) return '-'
      return moment(date).format('DD/MM/YYYY')
    },

    formatDateTime(date) {
      if (!date) return '-'
      return moment(date).format('DD/MM/YYYY hh:mm a')
    },

    formatCurrency(amount) {
      if (amount === null || amount === undefined) return '-'
      const currency = this.invoice?.currency || 'SAR'
      return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
    },

    getStatusBadgeClass(status) {
      const classes = {
        draft: 'bg-gray-100 text-gray-800 border border-gray-200',
        sent: 'bg-blue-100 text-blue-800 border border-blue-200',
        paid: 'bg-green-100 text-green-800 border border-green-200',
        overdue: 'bg-red-100 text-red-800 border border-red-200',
        cancelled: 'bg-gray-200 text-gray-700 border border-gray-300',
      }
      return classes[status] || 'bg-gray-100 text-gray-800'
    },

    getStatusText(status) {
      const map = {
        draft: this.$t('invoices.status.draft') || 'مسودة',
        sent: this.$t('invoices.status.sent') || 'مرسلة',
        paid: this.$t('invoices.status.paid') || 'مدفوعة',
        overdue: this.$t('invoices.status.overdue') || 'متأخرة',
        cancelled: this.$t('invoices.status.cancelled') || 'ملغاة',
      }
      return map[status] || status
    },
  },

  watch: {
    '$route.params.id': {
      immediate: false,
      handler(newId) {
        if (newId) this.loadInvoice()
      },
    },
  },
}
</script>
