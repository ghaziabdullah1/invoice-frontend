<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
    <div
      class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {{ $t('invoices.stats.total') }}
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.total || 0 }}</p>
        </div>
        <div class="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <svg class="w-6 h-6 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
      </div>
      <!-- <div class="mt-3 text-xs text-gray-400 dark:text-gray-500">📈 Total invoices</div> -->
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {{ $t('invoices.stats.paid') }}
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.paid || 0 }}</p>
        </div>
        <div class="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
          <svg class="w-6 h-6 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <!-- <div class="mt-3 text-xs text-gray-400 dark:text-gray-500">💰 {{ paidRate }}% paid rate</div> -->
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {{ $t('invoices.stats.sent') }}
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.sent || 0 }}</p>
        </div>
        <div class="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
          <svg class="w-6 h-6 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
      </div>
      <!-- <div class="mt-3 text-xs text-gray-400 dark:text-gray-500">✉️ Sent to clients</div> -->
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {{ $t('invoices.stats.overdue') }}
          </p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats.overdue || 0 }}</p>
        </div>
        <div class="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
          <svg class="w-6 h-6 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <!-- <div class="mt-3 text-xs text-gray-400 dark:text-gray-500">⚠️ Requires attention</div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvoicesStatsGrid',
  props: {
    stats: { type: Object, required: true },
    paidRate: { type: [Number, String], default: 0 },
  },
}
</script>
