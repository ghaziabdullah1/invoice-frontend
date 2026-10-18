<template>
  <div class="min-h-screen bg-slate-100 py-6 md:py-8 dark:bg-slate-900">
    <div class="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
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
          @click="$router.push('/invoices')"
          class="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {{ $t('common.back') || 'رجوع' }}
        </button>
      </div>

      <!-- ============ Loading ============ -->
      <div v-if="loading" class="bg-white rounded-2xl border border-gray-200 shadow-sm py-16 flex flex-col items-center dark:bg-slate-800 dark:border-slate-700">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4 dark:border-blue-900"></div>
        <p class="text-gray-600 dark:text-slate-300">{{ $t('common.loading') || 'جاري التحميل...' }}</p>
      </div>

      <!-- ============ Not found ============ -->
      <div v-else-if="notFound" class="bg-white rounded-2xl border border-yellow-200 shadow-sm p-10 text-center dark:bg-slate-800 dark:border-yellow-800">
        <div class="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-yellow-900/20">
          <svg class="w-8 h-8 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2 dark:text-slate-100">{{ $t('invoices.notFound') || 'الفاتورة غير موجودة' }}</h3>
        <p class="text-gray-600 mb-6 dark:text-slate-300">{{ $t('invoices.notFoundMessage') || 'لم يتم العثور على فاتورة بهذا الرقم' }}</p>
        <button @click="$router.push('/invoices')" class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          {{ $t('common.backToList') || 'العودة إلى القائمة' }}
        </button>
      </div>

      <!-- ============ Error ============ -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-5 dark:bg-red-900/20 dark:border-red-800">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="flex-1">
            <h3 class="text-sm font-semibold text-red-800 dark:text-red-300">{{ $t('common.error') || 'خطأ' }}</h3>
            <p class="text-sm text-red-700 mt-1 dark:text-red-300">{{ error }}</p>
            <button @click="loadInvoice" class="mt-3 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors">
              {{ $t('common.retry') || 'إعادة المحاولة' }}
            </button>
          </div>
          <button @click="clearError" class="p-1.5 text-red-700 hover:text-red-900 dark:text-red-300">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- ============ Invoice ============ -->
      <div v-else-if="invoice" class="space-y-6">
        <!-- ---------- Hero card ---------- -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <div class="h-1.5 bg-gradient-to-r from-blue-700 via-blue-500 to-indigo-500"></div>

          <div class="p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div class="flex items-center gap-4 min-w-0">
              <div class="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 dark:bg-blue-900/30 dark:border-blue-800">
                <svg class="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-slate-500">
                  {{ $t('invoices.invoicedetails') || 'تفاصيل الفاتورة' }}
                </p>
                <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 truncate dark:text-slate-100"># {{ invoice.invoice_number }}</h1>
                <div class="flex flex-wrap items-center gap-2 mt-2">
                  <span
                    :class="getStatusBadgeClass(invoice.status)"
                    class="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5"
                  >
                    <span :class="getStatusDotClass(invoice.status)" class="w-2 h-2 rounded-full"></span>
                    {{ getStatusText(invoice.status) }}
                  </span>
                  <span
                    v-if="invoice.enable_stripe_checkout"
                    class="text-xs bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full font-semibold dark:bg-purple-900/40 dark:text-purple-200"
                  >
                    Stripe
                  </span>
                </div>
              </div>
            </div>

            <div style="text-align: end">
              <p class="text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-slate-500">
                {{ $t('invoices.total') || 'الإجمالي' }}
              </p>
              <p class="text-3xl sm:text-4xl font-extrabold text-blue-700 dark:text-blue-400">{{ formatCurrency(invoice.total) }}</p>
            </div>
          </div>

          <!-- Key dates -->
          <div class="px-5 sm:px-7 pb-5 sm:pb-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="rounded-xl bg-slate-50 border border-gray-100 p-4 dark:bg-slate-700/40 dark:border-slate-700">
              <p class="text-xs text-gray-500 mb-1 dark:text-slate-400">{{ $t('invoices.issueDate') || 'تاريخ الإصدار' }}</p>
              <p class="font-bold text-gray-900 dark:text-slate-100">{{ formatDate(invoice.invoice_date) }}</p>
            </div>
            <div class="rounded-xl bg-slate-50 border border-gray-100 p-4 dark:bg-slate-700/40 dark:border-slate-700">
              <p class="text-xs text-gray-500 mb-1 dark:text-slate-400">{{ $t('invoices.dueDate') || 'تاريخ الاستحقاق' }}</p>
              <p class="font-bold text-gray-900 dark:text-slate-100">{{ formatDate(invoice.due_date) }}</p>
              <p v-if="invoice.status === 'overdue' && invoice.due_date" class="text-xs font-semibold text-red-600 mt-0.5 dark:text-red-400">
                {{ $i18n.locale === 'ar' ? 'متأخرة' : 'Overdue' }}
                {{ Math.max(1, Math.floor((Date.now() - new Date(invoice.due_date).getTime()) / 86400000)) }}
                {{ $i18n.locale === 'ar' ? 'يوم' : 'days' }}
              </p>
              <p
                v-else-if="['draft', 'sent'].includes(invoice.status) && invoice.due_date && new Date(invoice.due_date).getTime() >= Date.now()"
                class="text-xs text-gray-500 mt-0.5 dark:text-slate-400"
              >
                {{ $i18n.locale === 'ar' ? 'متبقي' : 'Due in' }}
                {{ Math.ceil((new Date(invoice.due_date).getTime() - Date.now()) / 86400000) }}
                {{ $i18n.locale === 'ar' ? 'يوم' : 'days' }}
              </p>
            </div>
            <div class="rounded-xl border p-4" :class="invoice.paid_at ? 'bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800' : 'bg-slate-50 border-gray-100 dark:bg-slate-700/40 dark:border-slate-700'">
              <p class="text-xs text-gray-500 mb-1 dark:text-slate-400">{{ $t('invoices.paymentDate') || 'تاريخ الدفع' }}</p>
              <p class="font-bold" :class="invoice.paid_at ? 'text-green-700 dark:text-green-300' : 'text-gray-400 dark:text-slate-500'">
                {{ invoice.paid_at ? formatDate(invoice.paid_at) : '-' }}
              </p>
            </div>
          </div>

          <!-- Paid notice -->
          <div
            v-if="invoice.status === 'paid'"
            class="px-5 sm:px-7 py-3 bg-green-50 border-t border-green-100 flex items-center gap-3 dark:bg-green-900/20 dark:border-green-800"
          >
            <svg class="w-5 h-5 text-green-600 flex-shrink-0 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="text-sm">
              <span class="font-semibold text-green-800 dark:text-green-300">{{ $t('invoices.paidInvoiceNotice') || 'هذه الفاتورة مدفوعة — لا يمكن تعديلها' }}</span>
              <span class="text-green-700 dark:text-green-300"> · {{ $t('invoices.paidInvoiceSubNotice') || 'يمكنك فقط حذفها أو إلغاؤها إذا لزم الأمر' }}</span>
            </div>
          </div>

          <!-- Action toolbar -->
          <div class="px-5 sm:px-7 py-4 bg-slate-50 border-t border-gray-200 flex flex-wrap items-center gap-2 dark:bg-slate-700/40 dark:border-slate-700">
            <button
              v-if="invoice.status !== 'paid' && hasEditPermission"
              @click="markAsPaid"
              :disabled="markPaidLoading"
              class="px-3.5 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="markPaidLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ $t('invoices.markAsPaid') || 'تعليم كمدفوعة' }}
            </button>

            <button
              v-if="invoice.enable_stripe_checkout && invoice.status !== 'paid'"
              @click="payWithStripe"
              :disabled="stripeLoading"
              class="px-3.5 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="stripeLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              {{ stripeLoading ? $t('common.loading') || 'جاري التحميل...' : $t('invoices.payWithStripe') || 'ادفع عبر Stripe' }}
            </button>

            <button
              v-if="invoice.status !== 'paid'"
              @click="openPaymentLinkGenerator"
              class="px-3.5 py-2 text-sm bg-white border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition flex items-center gap-2 dark:bg-slate-800 dark:border-indigo-700 dark:text-indigo-300 dark:hover:bg-indigo-900/30"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5" />
              </svg>
              {{ $t('payment_links.title') || 'رابط دفع' }}
            </button>

            <button
              @click="printInvoice"
              class="px-3.5 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              {{ $t('invoices.print_invoice') || 'طباعة' }}
            </button>

            <button
              v-if="invoice.client?.email"
              @click="sendEmail"
              class="px-3.5 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89-4.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {{ $t('invoices.sendEmail') || 'إرسال بالبريد' }}
            </button>

            <div class="flex-1"></div>

            <router-link
              v-if="hasEditPermission && invoice.status !== 'paid'"
              :to="`/invoices/${invoice.id}/edit`"
              class="px-3.5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {{ $t('common.edit') || 'تعديل' }}
            </router-link>

            <button
              v-if="hasEditPermission && invoice.status === 'paid'"
              @click="confirmCancel"
              :disabled="cancelLoading"
              class="px-3.5 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg v-if="cancelLoading" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              {{ $t('invoices.cancelInvoice') || 'إلغاء الفاتورة' }}
            </button>

            <button
              v-if="hasDeletePermission"
              @click="confirmDelete"
              class="px-3.5 py-2 text-sm bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition flex items-center gap-2 dark:bg-slate-800 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {{ $t('common.delete') || 'حذف' }}
            </button>
          </div>
        </div>

        <!-- ---------- Invoice paper ---------- -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <div class="p-5 sm:p-8">
            <!-- Bill to -->
            <div class="mb-8">
              <p class="text-xs font-bold tracking-wider text-gray-400 uppercase mb-3 dark:text-slate-500">
                {{ $t('clients.client') || 'العميل' }}
              </p>
              <div class="rounded-xl bg-slate-50 border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center gap-4 dark:bg-slate-700/40 dark:border-slate-700">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold flex-shrink-0 dark:from-blue-900/50 dark:to-blue-800/50 dark:text-blue-400">
                    {{ getInitials(invoice.client?.name) }}
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-gray-900 truncate dark:text-slate-100">{{ invoice.client?.name }}</p>
                    <p
                      v-if="invoice.client?.company_name && invoice.client.company_name !== '.'"
                      class="text-sm text-gray-500 truncate dark:text-slate-400"
                    >
                      {{ invoice.client.company_name }}
                    </p>
                  </div>
                </div>
                <div class="text-sm text-gray-700 space-y-1 dark:text-slate-200">
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-gray-400 flex-shrink-0 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89-4.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{{ invoice.client?.email || $t('common.notAvailable') }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-gray-400 flex-shrink-0 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span dir="ltr">{{ invoice.client?.phone || $t('common.notAvailable') }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Items -->
            <p class="text-xs font-bold tracking-wider text-gray-400 uppercase mb-3 dark:text-slate-500">
              {{ $t('invoices.items') || 'عناصر الفاتورة' }}
            </p>
            <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700">
              <table class="min-w-full">
                <thead class="bg-slate-50 dark:bg-slate-700/40">
                  <tr class="text-xs font-bold text-gray-500 uppercase tracking-wider dark:text-slate-400">
                    <th class="px-4 py-3 w-10 text-center">#</th>
                    <th class="px-4 py-3" style="text-align: start">{{ $t('invoices.description') || 'الوصف' }}</th>
                    <th class="px-4 py-3 text-center">{{ $t('invoices.quantity') || 'الكمية' }}</th>
                    <th class="px-4 py-3 text-center">{{ $t('invoices.unitPrice') || 'السعر' }}</th>
                    <th class="px-4 py-3 text-center">{{ $t('invoices.total') || 'الإجمالي' }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-slate-800">
                  <tr
                    v-for="(item, idx) in invoice.items"
                    :key="idx"
                    class="border-t border-gray-100 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:hover:bg-slate-700/50"
                  >
                    <td class="px-4 py-3.5 text-center text-sm text-gray-400 dark:text-slate-500">{{ idx + 1 }}</td>
                    <td class="px-4 py-3.5 text-sm text-gray-900 dark:text-slate-100" style="text-align: start">
                      <span class="font-medium">{{ item.description }}</span>
                      <span v-if="item.notes" class="block text-xs text-gray-500 mt-0.5 dark:text-slate-400">{{ item.notes }}</span>
                    </td>
                    <td class="px-4 py-3.5 text-sm text-center text-gray-700 dark:text-slate-200">{{ item.quantity }}</td>
                    <td class="px-4 py-3.5 text-sm text-center text-gray-700 dark:text-slate-200">{{ formatCurrency(item.unit_price) }}</td>
                    <td class="px-4 py-3.5 text-sm text-center font-bold text-gray-900 dark:text-slate-100">{{ formatCurrency(item.total) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Totals + notes -->
            <div class="mt-6 flex flex-col-reverse md:flex-row md:items-start justify-between gap-6">
              <div class="flex-1 text-sm text-gray-600 dark:text-slate-300">
                <div v-if="invoice.notes" class="rounded-xl bg-amber-50 border border-amber-100 p-4 dark:bg-amber-900/20 dark:border-amber-800">
                  <p class="font-semibold text-amber-900 mb-1 dark:text-amber-200">{{ $i18n.locale === 'ar' ? 'ملاحظات' : 'Notes' }}</p>
                  <p class="whitespace-pre-line text-amber-900/80 dark:text-amber-200/80">{{ invoice.notes }}</p>
                </div>
              </div>

              <div class="w-full md:w-80 rounded-xl border border-gray-200 overflow-hidden dark:border-slate-700">
                <div class="px-4 py-2.5 flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-slate-300">{{ $t('invoices.subtotal') || 'المجموع الفرعي' }}</span>
                  <span class="font-semibold text-gray-900 dark:text-slate-100">{{ formatCurrency(invoice.subtotal) }}</span>
                </div>
                <div v-if="parseFloat(invoice.discount_amount) > 0" class="px-4 py-2.5 flex justify-between text-sm border-t border-gray-100 dark:border-slate-700">
                  <span class="text-gray-600 dark:text-slate-300">{{ $t('invoices.discount') || 'الخصم' }}</span>
                  <span class="font-semibold text-red-600 dark:text-red-400">-{{ formatCurrency(invoice.discount_amount) }}</span>
                </div>
                <div class="px-4 py-2.5 flex justify-between text-sm border-t border-gray-100 dark:border-slate-700">
                  <span class="text-gray-600 dark:text-slate-300">{{ $t('invoices.tax') || 'الضريبة' }} ({{ invoice.tax_rate || 0 }}%)</span>
                  <span class="font-semibold text-gray-900 dark:text-slate-100">{{ formatCurrency(invoice.tax_amount) }}</span>
                </div>
                <div class="px-4 py-3.5 flex justify-between items-center bg-blue-700 text-white">
                  <span class="font-bold">{{ $t('invoices.total') || 'الإجمالي' }}</span>
                  <span class="text-xl font-extrabold">{{ formatCurrency(invoice.total) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Meta footer -->
          <div class="px-5 sm:px-8 py-4 bg-slate-50 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-gray-500 dark:bg-slate-700/40 dark:border-slate-700 dark:text-slate-400">
            <div>
              <span class="block text-gray-400 dark:text-slate-500">{{ $t('reports.created_by') || 'أنشئ بواسطة' }}</span>
              <span class="font-semibold text-gray-700 dark:text-slate-200">{{ invoice.created_by?.name || 'N/A' }}</span>
            </div>
            <div>
              <span class="block text-gray-400 dark:text-slate-500">{{ $t('reports.created_on') || 'تاريخ الإنشاء' }}</span>
              <span class="font-semibold text-gray-700 dark:text-slate-200">{{ formatDateTime(invoice.created_at) }}</span>
            </div>
            <div>
              <span class="block text-gray-400 dark:text-slate-500">{{ $t('reports.printed_by') || 'طبع بواسطة' }}</span>
              <span class="font-semibold text-gray-700 dark:text-slate-200">{{ printedBy }}</span>
            </div>
            <div>
              <span class="block text-gray-400 dark:text-slate-500">{{ $t('reports.printed_on') || 'تاريخ الطباعة' }}</span>
              <span class="font-semibold text-gray-700 dark:text-slate-200">{{ printedOn }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ============ Installment Plan Section ============ -->
      <div v-if="invoice" class="mt-6">
        <InstallmentPlanSection
          :invoice-id="invoice.id"
          :invoice-total="invoice.total"
          :can-manage="canManageInstallments"
          @generate-link="openPaymentLinkForInstallment"
        />
      </div>

      <!-- ============ Payment link generator ============ -->
      <PaymentLinkGenerator
        v-if="invoice"
        :show="showPaymentLinkGenerator"
        :invoice="invoice"
        :initial-installment-number="installmentToPreselect"
        @close="showPaymentLinkGenerator = false"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { nextTick } from 'vue'
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

    /* =========================================================
       ✅ دالة الطباعة الأصلية المُعاد إدراجها (من النسخة القديمة)
       ========================================================= */
    printInvoice() {
      const invoice = this.invoice
      if (!invoice) return

      // ====== بيانات الشركة (عدّلها هنا مرة واحدة، والحقل الفارغ لا يظهر) ======
      const COMPANY = {
        name: '',
        address: '',
        phone: '',
        email: '',
        taxNumber: '',
        logo: '', // رابط الشعار أو data URI
      }

      this.printedOn = moment().format('DD-MM-YYYY hh:mm a')

      const isAr = this.$i18n.locale === 'ar'
      const dir = isAr ? 'rtl' : 'ltr'
      const L = isAr
        ? {
            invoice: 'فاتورة', invoiceInfo: 'بيانات الفاتورة', invoiceNo: 'رقم الفاتورة',
            issueDate: 'تاريخ الإصدار', dueDate: 'تاريخ الاستحقاق', paidAt: 'تاريخ الدفع',
            billTo: 'فاتورة إلى', description: 'الوصف', qty: 'الكمية', unitPrice: 'سعر الوحدة',
            total: 'الإجمالي', subtotal: 'المجموع الفرعي', discount: 'الخصم', tax: 'الضريبة',
            grandTotal: 'الإجمالي المستحق', notes: 'ملاحظات', thanks: 'شكراً لتعاملكم معنا',
            preparedBy: 'توقيع المُعِد', clientSig: 'توقيع العميل / الاستلام',
            createdBy: 'أُنشئت بواسطة', printedBy: 'طُبعت بواسطة', phone: 'الهاتف',
            email: 'البريد', taxNo: 'الرقم الضريبي', paidMark: 'مدفوعة', cancelledMark: 'ملغاة',
            popupBlocked: 'المتصفح منع نافذة الطباعة، اسمح بالنوافذ المنبثقة ثم أعد المحاولة',
          }
        : {
            invoice: 'INVOICE', invoiceInfo: 'Invoice Details', invoiceNo: 'Invoice No.',
            issueDate: 'Issue Date', dueDate: 'Due Date', paidAt: 'Paid On',
            billTo: 'Bill To', description: 'Description', qty: 'Qty', unitPrice: 'Unit Price',
            total: 'Total', subtotal: 'Subtotal', discount: 'Discount', tax: 'Tax',
            grandTotal: 'Total Due', notes: 'Notes', thanks: 'Thank you for your business',
            preparedBy: 'Prepared by', clientSig: 'Client signature / Received by',
            createdBy: 'Created by', printedBy: 'Printed by', phone: 'Phone',
            email: 'Email', taxNo: 'Tax No.', paidMark: 'PAID', cancelledMark: 'CANCELLED',
            popupBlocked: 'The browser blocked the print window. Allow pop-ups and try again',
          }

      const esc = (v) =>
        String(v ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')

      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        this.$toast.warning(L.popupBlocked)
        return
      }

      const statusColors = {
        draft: ['#4b5563', '#f3f4f6', '#d1d5db'],
        sent: ['#1e40af', '#dbeafe', '#93c5fd'],
        paid: ['#166534', '#dcfce7', '#86efac'],
        overdue: ['#991b1b', '#fee2e2', '#fca5a5'],
        cancelled: ['#4b5563', '#e5e7eb', '#9ca3af'],
      }
      const [sc, sbg, sbd] = statusColors[invoice.status] || statusColors.draft

      let watermark = ''
      if (invoice.status === 'paid') {
        watermark = `<div class="watermark" style="color:rgba(22,163,74,.09)">${L.paidMark}</div>`
      } else if (invoice.status === 'cancelled') {
        watermark = `<div class="watermark" style="color:rgba(107,114,128,.12)">${L.cancelledMark}</div>`
      }

      const companyMeta = [
        COMPANY.address,
        COMPANY.phone && `${L.phone}: ${COMPANY.phone}`,
        COMPANY.email && `${L.email}: ${COMPANY.email}`,
        COMPANY.taxNumber && `${L.taxNo}: ${COMPANY.taxNumber}`,
      ]
        .filter(Boolean)
        .map(esc)
        .join(' &nbsp;•&nbsp; ')

      const brandHtml =
        COMPANY.name || COMPANY.logo
          ? `<div class="brand">
              ${COMPANY.logo ? `<img src="${esc(COMPANY.logo)}" alt="" />` : ''}
              <div>
                <div class="brand-name">${esc(COMPANY.name)}</div>
                <div class="brand-meta">${companyMeta}</div>
              </div>
            </div>`
          : ''

      const itemsHtml = (invoice.items || [])
        .map(
          (item, i) => `
        <tr>
          <td class="idx">${i + 1}</td>
          <td class="desc">${esc(item.description)}${item.notes ? `<small>${esc(item.notes)}</small>` : ''}</td>
          <td>${esc(item.quantity)}</td>
          <td>${this.formatCurrency(item.unit_price)}</td>
          <td><strong>${this.formatCurrency(item.total)}</strong></td>
        </tr>`,
        )
        .join('')

      const hasCompany = invoice.client?.company_name && invoice.client.company_name !== '.'

      const styles = `
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
          @page { size: A4; margin: 14mm; }
          * { box-sizing: border-box; }
          html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body { font-family: 'Tajawal', 'Segoe UI', Tahoma, Arial, sans-serif; direction: ${dir}; color: #1f2937; margin: 0; font-size: 13px; line-height: 1.55; background: #fff; }
          .topbar { height: 6px; background: linear-gradient(90deg, #1e3a8a, #2563eb); border-radius: 3px; margin-bottom: 22px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; margin-bottom: 26px; }
          .brand { display: flex; align-items: center; gap: 14px; }
          .brand img { max-height: 64px; max-width: 140px; object-fit: contain; }
          .brand-name { font-size: 20px; font-weight: 800; color: #1e3a8a; }
          .brand-meta { font-size: 11.5px; color: #6b7280; margin-top: 2px; }
          .doc-title { margin-inline-start: auto; text-align: end; }
          .doc-title h1 { margin: 0; font-size: 32px; font-weight: 800; letter-spacing: 1px; color: #1e3a8a; }
          .doc-title .num { font-size: 14px; font-weight: 700; color: #374151; margin-top: 2px; }
          .status { display: inline-block; margin-top: 8px; padding: 3px 14px; border-radius: 999px; font-size: 12px; font-weight: 700; border: 1px solid; }
          .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 22px; }
          .card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; background: #f9fafb; }
          .card h3 { margin: 0 0 8px; font-size: 11px; letter-spacing: .8px; color: #6b7280; font-weight: 700; text-transform: uppercase; }
          .row { display: flex; justify-content: space-between; gap: 12px; padding: 3px 0; }
          .row .k { color: #6b7280; }
          .row .v { font-weight: 700; color: #111827; }
          .client-name { font-size: 15px; font-weight: 800; color: #111827; margin-bottom: 4px; }
          .client-line { color: #4b5563; }
          table.items { width: 100%; border-collapse: separate; border-spacing: 0; margin-bottom: 18px; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
          .items thead { display: table-header-group; }
          .items thead th { background: #1e3a8a; color: #fff; padding: 10px 12px; font-size: 12px; font-weight: 700; text-align: center; }
          .items tbody td { padding: 10px 12px; border-top: 1px solid #eef0f3; text-align: center; vertical-align: top; }
          .items tbody tr:nth-child(even) td { background: #f9fafb; }
          .items tr { page-break-inside: avoid; }
          .items .desc { text-align: start; }
          .items .idx { width: 36px; color: #9ca3af; }
          .items small { display: block; color: #6b7280; font-size: 11px; margin-top: 2px; }
          .bottom { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; page-break-inside: avoid; }
          .notes { flex: 1; font-size: 12px; color: #6b7280; white-space: pre-line; }
          .notes b { display: block; color: #374151; margin-bottom: 4px; }
          .totals { width: 300px; border: 1px solid #e5e7eb; border-radius: 10px; overflow: hidden; }
          .totals .tr { display: flex; justify-content: space-between; padding: 8px 14px; }
          .totals .tr + .tr { border-top: 1px solid #eef0f3; }
          .totals .discount { color: #dc2626; }
          .totals .grand { background: #1e3a8a; color: #fff; font-size: 15px; font-weight: 800; }
          .thanks { text-align: center; margin-top: 26px; font-weight: 700; color: #1e3a8a; }
          .sign { display: flex; gap: 40px; margin-top: 44px; page-break-inside: avoid; }
          .sign div { flex: 1; border-top: 1px solid #9ca3af; padding-top: 6px; text-align: center; font-size: 11.5px; color: #6b7280; }
          .footer { margin-top: 26px; padding-top: 10px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; gap: 12px; font-size: 10.5px; color: #9ca3af; }
          .watermark { position: fixed; top: 40%; left: 0; right: 0; text-align: center; font-size: 110px; font-weight: 800; letter-spacing: 6px; transform: rotate(-24deg); pointer-events: none; z-index: 0; }
        </style>
      `

      const html = `
        <html dir="${dir}">
          <head>
            <meta charset="utf-8" />
            <title>${L.invoice} ${esc(invoice.invoice_number)}</title>
            ${styles}
          </head>
          <body>
            ${watermark}
            <div class="topbar"></div>

            <div class="header">
              ${brandHtml}
              <div class="doc-title">
                <h1>${L.invoice}</h1>
                <div class="num"># ${esc(invoice.invoice_number)}</div>
                <span class="status" style="color:${sc};background:${sbg};border-color:${sbd}">${esc(this.getStatusText(invoice.status))}</span>
              </div>
            </div>

            <div class="meta">
              <div class="card">
                <h3>${L.billTo}</h3>
                <div class="client-name">${esc(invoice.client?.name || '-')}</div>
                ${hasCompany ? `<div class="client-line">${esc(invoice.client.company_name)}</div>` : ''}
                ${invoice.client?.email ? `<div class="client-line">${esc(invoice.client.email)}</div>` : ''}
                ${invoice.client?.phone ? `<div class="client-line">${esc(invoice.client.phone)}</div>` : ''}
              </div>
              <div class="card">
                <h3>${L.invoiceInfo}</h3>
                <div class="row"><span class="k">${L.invoiceNo}</span><span class="v">${esc(invoice.invoice_number)}</span></div>
                <div class="row"><span class="k">${L.issueDate}</span><span class="v">${this.formatDate(invoice.invoice_date)}</span></div>
                <div class="row"><span class="k">${L.dueDate}</span><span class="v">${this.formatDate(invoice.due_date)}</span></div>
                ${invoice.paid_at ? `<div class="row"><span class="k">${L.paidAt}</span><span class="v">${this.formatDate(invoice.paid_at)}</span></div>` : ''}
              </div>
            </div>

            <table class="items">
              <thead>
                <tr>
                  <th>#</th>
                  <th>${L.description}</th>
                  <th>${L.qty}</th>
                  <th>${L.unitPrice}</th>
                  <th>${L.total}</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>

            <div class="bottom">
              <div class="notes">${invoice.notes ? `<b>${L.notes}</b>${esc(invoice.notes)}` : ''}</div>
              <div class="totals">
                <div class="tr"><span>${L.subtotal}</span><span>${this.formatCurrency(invoice.subtotal)}</span></div>
                ${parseFloat(invoice.discount_amount) > 0 ? `<div class="tr discount"><span>${L.discount}</span><span>-${this.formatCurrency(invoice.discount_amount)}</span></div>` : ''}
                <div class="tr"><span>${L.tax} (${invoice.tax_rate || 0}%)</span><span>${this.formatCurrency(invoice.tax_amount)}</span></div>
                <div class="tr grand"><span>${L.grandTotal}</span><span>${this.formatCurrency(invoice.total)}</span></div>
              </div>
            </div>

            <div class="thanks">${L.thanks}</div>

            <div class="sign">
              <div>${L.preparedBy}</div>
              <div>${L.clientSig}</div>
            </div>

            <div class="footer">
              <span>${L.createdBy}: ${esc(invoice.created_by?.name || 'N/A')} — ${this.formatDateTime(invoice.created_at)}</span>
              <span>${L.printedBy}: ${esc(this.printedBy)} — ${this.printedOn}</span>
            </div>
          </body>
        </html>
      `

      printWindow.document.write(html)
      printWindow.document.close()

      const doPrint = () => {
        printWindow.focus()
        printWindow.print()
      }
      if (printWindow.document.fonts && printWindow.document.fonts.ready) {
        printWindow.document.fonts.ready.then(() => setTimeout(doPrint, 200))
      } else {
        setTimeout(doPrint, 600)
      }
      printWindow.onafterprint = () => printWindow.close()
    },

    openPaymentLinkGenerator() {
      this.installmentToPreselect = null
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

    async markAsPaid() {
      const result = await this.$swal.fire({
        title: this.$t('invoices.markPaidConfirmTitle') || 'تعليم الفاتورة كمدفوعة؟',
        text:
          this.$t('invoices.markPaidConfirmText') ||
          'سيتم تحديث حالة الفاتورة إلى "مدفوعة" مباشرة (دفعة يدوية/نقدية).',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#16A34A',
        cancelButtonColor: '#6B7280',
        confirmButtonText: this.$t('invoices.confirmMarkPaid') || 'نعم، تعليم كمدفوعة',
        cancelButtonText: this.$t('common.back') || 'تراجع',
      })
      if (!result.isConfirmed) return

      this.markPaidLoading = true
      try {
        await this.updateInvoiceStatus({ id: this.invoice.id, status: 'paid' })
        this.$toast.success(this.$t('invoices.markPaidSuccess') || 'تم تعليم الفاتورة كمدفوعة')
        await this.loadInvoice()
      } catch (err) {
        this.$toast.error(err.message || 'فشل تحديث حالة الفاتورة')
      } finally {
        this.markPaidLoading = false
      }
    },

    openPaymentLinkForInstallment(inst) {
      this.installmentToPreselect = inst.installment_number
      this.showPaymentLinkGenerator = true
    },

    confirmCancel() {
      this.$swal
        .fire({
          title: this.$t('invoices.cancelConfirmTitle') || 'إلغاء الفاتورة المدفوعة؟',
          html: `
            <p>${this.$t('invoices.cancelConfirmText') || 'سيتم تغيير حالة الفاتورة إلى "ملغاة".'}</p>
            <p class="text-sm text-orange-600 mt-2 font-medium">
              ${this.$t('invoices.cancelWarning') || 'تأكد من معالجة استرجاع المبلغ (Refund) في Stripe إذا لزم.'}
            </p>
          `,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#F97316',
          cancelButtonColor: '#6B7280',
          confirmButtonText: this.$t('invoices.confirmCancel') || 'نعم، إلغاء الفاتورة',
          cancelButtonText: this.$t('common.back') || 'تراجع',
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            await this.cancelInvoice()
          }
        })
    },

    async cancelInvoice() {
      this.cancelLoading = true
      try {
        await this.updateInvoiceStatus({ id: this.invoice.id, status: 'cancelled' })
        this.$toast.success(this.$t('invoices.cancelSuccess') || 'تم إلغاء الفاتورة')
        await this.loadInvoice()
      } catch (err) {
        this.$toast.error(err.message || 'فشل إلغاء الفاتورة')
      } finally {
        this.cancelLoading = false
      }
    },

    clearError() {
      this.error = null
    },

    getInitials(name) {
      if (!name) return '?'
      return name.substring(0, 2).toUpperCase()
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
      return new Intl.NumberFormat('ar-SA', { style: 'currency', currency }).format(amount)
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

    getStatusDotClass(status) {
      const classes = {
        draft: 'bg-gray-500',
        sent: 'bg-blue-500',
        paid: 'bg-green-500',
        overdue: 'bg-red-500',
        cancelled: 'bg-gray-600',
      }
      return classes[status] || 'bg-gray-500'
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

    sendEmail() {
      if (!this.invoice?.client?.email) {
        this.$toast.warning('لا يوجد بريد إلكتروني للعميل')
        return
      }
      const subject = `فاتورة ${this.invoice.invoice_number}`
      const body = `مرحباً،\n\nفاتورة رقم ${this.invoice.invoice_number} بمبلغ ${this.formatCurrency(this.invoice.total)}.\n\nشكراً لتعاملكم.`
      window.location.href = `mailto:${this.invoice.client.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    },

    confirmDelete() {
      const isPaid = this.invoice?.status === 'paid'
      const baseText =
        this.$t('invoices.deleteConfirm', { number: this.invoice.invoice_number }) ||
        `سيتم حذف الفاتورة رقم ${this.invoice.invoice_number}`
      const paidWarn = isPaid
        ? `<br><span style="color:#dc2626;font-weight:600;">⚠️ تنبيه: هذه الفاتورة مدفوعة — تأكد من الاحتفاظ بسجل خارجي قبل الحذف.</span>`
        : ''

      this.$swal
        .fire({
          title: this.$t('common.are_you_sure') || 'هل أنت متأكد؟',
          html: baseText + paidWarn,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#EF4444',
          cancelButtonColor: '#6B7280',
          confirmButtonText: this.$t('common.delete') || 'حذف',
          cancelButtonText: this.$t('common.cancel') || 'إلغاء',
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              await this.deleteInvoice(this.invoice.id)
              this.$toast.success(this.$t('messages.deleteSuccess') || 'تم الحذف بنجاح')
              this.$router.push('/invoices')
            } catch (err) {
              this.$toast.error(err.message || 'فشل الحذف')
            }
          }
        })
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

<style scoped></style>
