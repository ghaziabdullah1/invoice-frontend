<template>
  <div>
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
          {{ $t('reports.aging.totalDue') }}
        </p>
        <p class="text-xl font-bold text-gray-900 dark:text-white">
          {{ formatNumber(stats.total_due) }}
        </p>
      </div>
      <div
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4"
      >
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
          {{ $t('reports.aging.totalClients') }}
        </p>
        <p class="text-xl font-bold text-gray-900 dark:text-white">
          {{ stats.total_clients || 0 }}
        </p>
      </div>
      <div
        class="bg-green-50 dark:bg-green-900/30 rounded-xl border border-green-100 dark:border-green-800/50 shadow-sm p-4"
      >
        <p class="text-sm text-green-700 dark:text-green-300 mb-1">
          0-30 {{ $t('reports.aging.days') }}
        </p>
        <p class="text-xl font-bold text-green-800 dark:text-green-400">
          {{ formatNumber(stats.bucket_0_30_total) }}
        </p>
      </div>
      <div
        class="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl border border-yellow-100 dark:border-yellow-800/50 shadow-sm p-4"
      >
        <p class="text-sm text-yellow-700 dark:text-yellow-300 mb-1">
          31-60 {{ $t('reports.aging.days') }}
        </p>
        <p class="text-xl font-bold text-yellow-800 dark:text-yellow-400">
          {{ formatNumber(stats.bucket_31_60_total) }}
        </p>
      </div>
      <div
        class="bg-orange-50 dark:bg-orange-900/30 rounded-xl border border-orange-100 dark:border-orange-800/50 shadow-sm p-4"
      >
        <p class="text-sm text-orange-700 dark:text-orange-300 mb-1">
          61-90 {{ $t('reports.aging.days') }}
        </p>
        <p class="text-xl font-bold text-orange-800 dark:text-orange-400">
          {{ formatNumber(stats.bucket_61_90_total) }}
        </p>
      </div>
      <div
        class="bg-red-50 dark:bg-red-900/30 rounded-xl border border-red-100 dark:border-red-800/50 shadow-sm p-4"
      >
        <p class="text-sm text-red-700 dark:text-red-300 mb-1">
          90+ {{ $t('reports.aging.days') }}
        </p>
        <p class="text-xl font-bold text-red-800 dark:text-red-400">
          {{ formatNumber(stats.bucket_90_plus_total) }}
        </p>
      </div>
    </div>

    <!-- Clients Aging Table -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
    >
      <div v-if="!clients || clients.length === 0" class="text-center py-12">
        <svg
          class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4"
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
        <p class="text-gray-500 dark:text-gray-400">{{ $t('reports.aging.noOverdue') }}</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                class="px-4 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ $t('clients.title') }}
              </th>
              <th
                class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {{ $t('reports.aging.invoicesCount') }}
              </th>
              <th
                class="px-4 py-3 text-center text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wider"
              >
                0-30
              </th>
              <th
                class="px-4 py-3 text-center text-xs font-medium text-yellow-700 dark:text-yellow-400 uppercase tracking-wider"
              >
                31-60
              </th>
              <th
                class="px-4 py-3 text-center text-xs font-medium text-orange-700 dark:text-orange-400 uppercase tracking-wider"
              >
                61-90
              </th>
              <th
                class="px-4 py-3 text-center text-xs font-medium text-red-700 dark:text-red-400 uppercase tracking-wider"
              >
                90+
              </th>
              <th
                class="px-4 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
              >
                {{ $t('reports.aging.totalDue') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="client in clients"
              :key="client.client_id"
              class="hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-gray-700/50 transition-colors duration-150"
            >
              <td class="px-4 py-3">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ client.client_name }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {{ client.client_email }}
                </div>
              </td>
              <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                {{ client.invoices_count }}
              </td>
              <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                {{ client.bucket_0_30 > 0 ? formatNumber(client.bucket_0_30) : '-' }}
              </td>
              <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                {{ client.bucket_31_60 > 0 ? formatNumber(client.bucket_31_60) : '-' }}
              </td>
              <td class="px-4 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                {{ client.bucket_61_90 > 0 ? formatNumber(client.bucket_61_90) : '-' }}
              </td>
              <td class="px-4 py-3 text-center text-sm font-medium text-red-700 dark:text-red-400">
                {{ client.bucket_90_plus > 0 ? formatNumber(client.bucket_90_plus) : '-' }}
              </td>
              <td class="px-4 py-3 text-center text-sm font-bold text-gray-900 dark:text-white">
                {{ formatNumber(client.total_due) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AgingReportSection',
  props: {
    clients: {
      type: Array,
      default: () => [],
    },
    stats: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    formatNumber(value) {
      const number = Number(value) || 0
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(number)
    },
  },
}
</script>
