<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <div
      class="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500 mb-1">{{ $t('clients.stats.total_clients') }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-slate-100">{{ stats.total_clients || 0 }}</p>
        </div>
        <div class="p-3 bg-blue-50 rounded-lg">
          <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>
      <!-- <div class="mt-3 text-xs text-gray-400">📈 +12% from last month</div> -->
    </div>

    <div
      class="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500 mb-1">{{ $t('common.active') }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-slate-100">{{ stats.active_clients || 0 }}</p>
        </div>
        <div class="p-3 bg-green-50 rounded-lg">
          <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <!-- <div class="mt-3 text-xs text-gray-400">{{ activeRate }}% active rate</div> -->
    </div>

    <div
      class="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500 mb-1">{{ $t('clients.stats.totalInvoices') }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-slate-100">{{ stats.total_invoices || 0 }}</p>
        </div>
        <div class="p-3 bg-purple-50 rounded-lg">
          <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      </div>
      <!-- <div class="mt-3 text-xs text-gray-400">📄 Total invoices issued</div> -->
    </div>

    <div
      class="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500 mb-1">{{ $t('dashboard.total_revenue') }}</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-slate-100">{{ formatCurrencyShort(stats.total_revenue) }}</p>
        </div>
        <div class="p-3 bg-orange-50 rounded-lg">
          <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <!-- <div class="mt-3 text-xs text-gray-400">💰 Lifetime value</div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientsStatsGrid',

  props: {
    stats: {
      type: Object,
      required: true,
    },
    activeRate: {
      type: [Number, String],
      default: 0,
    },
  },

  methods: {
    formatCurrencyShort(amount) {
      if (!amount && amount !== 0) return '0.00'
      if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)}M`
      }
      if (amount >= 1000) {
        return `${(amount / 1000).toFixed(1)}K`
      }
      return amount.toFixed(2)
    },
  },
}
</script>
