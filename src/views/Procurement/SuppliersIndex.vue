<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 py-6 md:py-8">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('procurement.supplier.title') }}</p>
            <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total }}</p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('realty.common.active') }}</p>
            <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.active }}</p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('realty.common.inactive') }}</p>
            <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.inactive }}</p>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('procurement.supplier.orders_count') }}</p>
            <div class="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.withOrders }}</p>
        </div>
      </div>

      <!-- Table -->
      <CrudManager :config="config" @data-loaded="onDataLoaded" />
    </div>
  </div>
</template>

<script>
import CrudManager from '@/components/realty/CrudManager.vue'

export default {
  name: 'SuppliersIndex',
  components: { CrudManager },
  data() {
    return {
      localItems: [],
      config: {
        store: 'suppliers',
        title: 'procurement.supplier.title',
        subtitle: 'procurement.supplier.subtitle',
        addLabel: 'procurement.supplier.add',
        editLabel: 'procurement.supplier.edit',
        emptyLabel: 'procurement.supplier.empty',
        permissions: {
          create: 'create_supplier',
          edit: 'edit_supplier',
          delete: 'delete_supplier',
        },
        columns: [
          { key: 'code', label: 'procurement.supplier.code', type: 'primary', subKey: 'name' },
          { key: 'contact_person', label: 'procurement.supplier.contact_person' },
          { key: 'phone', label: 'procurement.supplier.phone' },
          { key: 'email', label: 'procurement.supplier.email' },
          { key: 'payment_terms_days', label: 'procurement.supplier.payment_terms_days' },
          { key: 'orders_count', label: 'procurement.supplier.orders_count' },
          { key: 'is_active', label: 'realty.common.status', type: 'status' },
        ],
        fields: [
          { key: 'code', label: 'procurement.supplier.code', type: 'text', required: true },
          { key: 'name', label: 'procurement.supplier.name', type: 'text', required: true },
          { key: 'name_en', label: 'procurement.supplier.name_en', type: 'text' },
          { key: 'contact_person', label: 'procurement.supplier.contact_person', type: 'text' },
          { key: 'phone', label: 'procurement.supplier.phone', type: 'text' },
          { key: 'email', label: 'procurement.supplier.email', type: 'email' },
          { key: 'address', label: 'procurement.supplier.address', type: 'text' },
          { key: 'city', label: 'procurement.supplier.city', type: 'text' },
          { key: 'tax_number', label: 'procurement.supplier.tax_number', type: 'text' },
          { key: 'payment_terms_days', label: 'procurement.supplier.payment_terms_days', type: 'number', min: 0, step: 1 },
          { key: 'currency', label: 'procurement.supplier.currency', type: 'text' },
          { key: 'notes', label: 'procurement.supplier.notes', type: 'textarea' },
          { key: 'is_active', label: 'realty.common.active', type: 'checkbox' },
        ],
      },
    }
  },
  computed: {
    stats() {
      const items = this.localItems
      return {
        total: items.length,
        active: items.filter((s) => s.is_active).length,
        inactive: items.filter((s) => !s.is_active).length,
        withOrders: items.filter((s) => (s.orders_count || 0) > 0).length,
      }
    },
  },
  methods: {
    onDataLoaded(payload) {
      this.localItems = payload.items || []
    },
  },
}
</script>
