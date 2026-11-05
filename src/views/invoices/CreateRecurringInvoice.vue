<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-6 md:py-8"
  >
    <div class="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
      <!-- Header -->
      <div class="mb-8">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
          <div class="flex items-center gap-3">
            <div
              class="p-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {{ $t('recurringInvoices.create_title') || 'قالب فاتورة متكررة جديد' }}
              </h1>
              <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {{
                  $t('recurringInvoices.create_subtitle') ||
                  'يولّد فاتورة تلقائياً حسب الجدول، أو يدوياً بضغطة زر'
                }}
              </p>
            </div>
          </div>
          <button
            @click="$router.push('/recurring-invoices')"
            class="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-200 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {{ $t('common.back') || 'رجوع' }}
          </button>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
      >
        <div class="p-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- العميل + التكرار -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >{{ $t('invoices.create.client') || 'العميل' }} *</label
                >
                <select
                  v-model="form.client_id"
                  required
                  class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900"
                  :class="{ 'border-red-300': errors.client_id }"
                >
                  <option value="">{{ $t('common.select_client') || 'اختر عميل' }}</option>
                  <option v-for="client in clients" :key="client.id" :value="client.id">
                    {{ client.name }} - {{ client.company_name || $t('common.no_company') }}
                  </option>
                </select>
                <p v-if="errors.client_id" class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {{ errors.client_id }}
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >{{ $t('recurringInvoices.frequency') || 'التكرار' }} *</label
                >
                <select
                  v-model="form.frequency"
                  required
                  class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900"
                >
                  <option value="weekly">{{ $t('recurringInvoices.weekly') || 'أسبوعي' }}</option>
                  <option value="monthly">{{ $t('recurringInvoices.monthly') || 'شهري' }}</option>
                  <option value="quarterly">
                    {{ $t('recurringInvoices.quarterly') || 'ربع سنوي' }}
                  </option>
                  <option value="yearly">{{ $t('recurringInvoices.yearly') || 'سنوي' }}</option>
                </select>
              </div>
            </div>

            <!-- تاريخ البدء + عدد التكرارات + مهلة الاستحقاق -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >{{ $t('recurringInvoices.start_date') || 'تاريخ أول توليد' }} *</label
                >
                <input
                  v-model="form.start_date"
                  type="date"
                  required
                  class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >{{ $t('recurringInvoices.occurrences_total') || 'عدد مرات التكرار' }} *</label
                >
                <input
                  v-model.number="form.occurrences_total"
                  type="number"
                  min="1"
                  max="120"
                  required
                  class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{ 'border-red-300': errors.occurrences_total }"
                />
                <p
                  v-if="errors.occurrences_total"
                  class="mt-1 text-sm text-red-600 dark:text-red-400"
                >
                  {{ errors.occurrences_total }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{
                  $t('recurringInvoices.due_days') || 'مهلة السداد (أيام)'
                }}</label>
                <input
                  v-model.number="form.due_days"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {{
                    $t('recurringInvoices.due_days_hint') ||
                    'عدد الأيام بعد تاريخ إنشاء الفاتورة حتى موعد الاستحقاق'
                  }}
                </p>
              </div>
            </div>

            <!-- عناصر القالب -->
            <div
              class="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-gradient-to-b from-gray-50 to-white"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ $t('invoices.items') || 'العناصر' }}
                </h3>
                <button
                  type="button"
                  @click="addItem"
                  class="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 text-sm"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  {{ $t('invoices.create.add_item') || 'إضافة عنصر' }}
                </button>
              </div>

              <div class="space-y-3">
                <div
                  v-for="(item, index) in form.items"
                  :key="index"
                  class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                >
                  <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div class="md:col-span-5">
                      <label
                        class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >{{ $t('common.description') || 'الوصف' }}</label
                      >
                      <input
                        v-model="item.description"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                      />
                    </div>
                    <div class="md:col-span-2">
                      <label
                        class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >{{ $t('common.quantity') || 'الكمية' }}</label
                      >
                      <input
                        v-model.number="item.quantity"
                        type="number"
                        min="0.01"
                        step="0.01"
                        required
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                      />
                    </div>
                    <div class="md:col-span-2">
                      <label
                        class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >{{ $t('common.unitPrice') || 'السعر' }}</label
                      >
                      <input
                        v-model.number="item.unit_price"
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                      />
                    </div>
                    <div class="md:col-span-2">
                      <label
                        class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >{{ $t('invoices.create.tax') || 'الضريبة %' }}</label
                      >
                      <input
                        v-model.number="item.tax_rate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                      />
                    </div>
                    <div class="md:col-span-1 flex items-end">
                      <button
                        type="button"
                        @click="removeItem(index)"
                        :disabled="form.items.length === 1"
                        class="w-full h-9 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center justify-center disabled:opacity-50"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="text-left mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {{ $t('common.itemTotal') || 'الإجمالي' }}:
                    {{ formatCurrency(itemLineTotal(item)) }}
                  </div>
                </div>
              </div>

              <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <div class="text-left">
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {{ $t('invoices.subtotal') || 'المجموع الفرعي' }}:
                    {{ formatCurrency(computedSubtotal) }}
                  </div>
                  <div class="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                    {{ $t('invoices.total') || 'الإجمالي التقريبي' }}:
                    {{ formatCurrency(computedSubtotal) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- ملاحظات -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{
                $t('common.notes') || 'ملاحظات'
              }}</label>
              <textarea
                v-model="form.notes"
                rows="3"
                class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <!-- Actions -->
            <div
              class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <button
                type="button"
                @click="$router.push('/recurring-invoices')"
                :disabled="submitting"
                class="px-6 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-200"
              >
                {{ $t('common.cancel') || 'إلغاء' }}
              </button>
              <button
                type="submit"
                :disabled="submitting || !isFormValid"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{
                  submitting
                    ? $t('common.saving') || 'جاري الحفظ...'
                    : $t('recurringInvoices.create_button') || 'إنشاء القالب'
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'CreateRecurringInvoice',

  data() {
    return {
      submitting: false,
      errors: {},
      form: {
        client_id: '',
        frequency: 'monthly',
        start_date: new Date().toISOString().split('T')[0],
        occurrences_total: 12,
        due_days: 30,
        notes: '',
        items: [{ description: '', quantity: 1, unit_price: 0, tax_rate: 0 }],
      },
    }
  },

  computed: {
    ...mapGetters('clients', ['clients']),

    computedSubtotal() {
      return this.form.items.reduce((sum, item) => sum + this.itemLineTotal(item), 0)
    },

    isFormValid() {
      return (
        this.form.client_id &&
        this.form.frequency &&
        this.form.start_date &&
        this.form.occurrences_total > 0 &&
        this.form.items.every((i) => i.description && i.quantity > 0 && i.unit_price >= 0)
      )
    },
  },

  mounted() {
    this.loadClients()
  },

  methods: {
    ...mapActions('recurringInvoices', ['createTemplate']),
    ...mapActions('clients', ['fetchClients']),

    async loadClients() {
      try {
        await this.fetchClients({ per_page: 100 })
      } catch (e) {
        console.error(e)
      }
    },

    itemLineTotal(item) {
      const qty = parseFloat(item.quantity) || 0
      const price = parseFloat(item.unit_price) || 0
      const tax = parseFloat(item.tax_rate) || 0
      return qty * price * (1 + tax / 100)
    },

    addItem() {
      this.form.items.push({ description: '', quantity: 1, unit_price: 0, tax_rate: 0 })
    },

    removeItem(index) {
      if (this.form.items.length > 1) {
        this.form.items.splice(index, 1)
      }
    },

    formatCurrency(amount) {
      if (!amount && amount !== 0) return '0.00 ' + this.$t('common.currency')
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 2,
      })
      return formatter.format(amount)
    },

    async handleSubmit() {
      this.errors = {}

      if (!this.form.client_id) {
        this.errors.client_id = this.$t('validation.client_required') || 'الرجاء اختيار عميل'
      }
      if (!this.form.occurrences_total || this.form.occurrences_total < 1) {
        this.errors.occurrences_total =
          this.$t('recurringInvoices.occurrences_required') ||
          'عدد التكرارات يجب أن يكون 1 على الأقل'
      }

      if (Object.keys(this.errors).length) return

      this.submitting = true
      try {
        const payload = {
          ...this.form,
          items: this.form.items.map((i) => ({
            description: i.description,
            quantity: parseFloat(i.quantity),
            unit_price: parseFloat(i.unit_price),
            tax_rate: parseFloat(i.tax_rate) || 0,
          })),
        }

        await this.createTemplate(payload)
        this.$toast.success(this.$t('recurringInvoices.create_success') || 'تم إنشاء القالب بنجاح')
        this.$router.push('/recurring-invoices')
      } catch (error) {
        console.error(error)
        this.$toast.error(
          error.message || this.$t('recurringInvoices.create_failed') || 'فشل إنشاء القالب',
        )
      } finally {
        this.submitting = false
      }
    },
  },
}
</script>
