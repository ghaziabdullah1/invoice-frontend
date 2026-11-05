<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <!-- إجمالي العملاء -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700/60 p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-slate-400">{{ $t('clients.stats.total') }}</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-2" v-if="!loading">
            {{ clients.total || 0 }}
          </p>
          <div v-else class="h-8 bg-gray-200 rounded animate-pulse mt-2"></div>
        </div>
        <div class="p-3 bg-blue-50 rounded-xl">
          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- عملاء جدد هذا الشهر -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700/60 p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-slate-400">{{ $t('clients.stats.newThisMonth') }}</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-2">0</p>
        </div>
        <div class="p-3 bg-green-50 rounded-xl">
          <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- عملاء نشطين -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700/60 p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-slate-400">{{ $t('clients.stats.active') }}</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-2">0</p>
        </div>
        <div class="p-3 bg-purple-50 rounded-xl">
          <svg
            class="w-6 h-6 text-purple-600"
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
      </div>
    </div>

    <!-- متوسط الفواتير -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700/60 p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600 dark:text-slate-400">{{ $t('clients.stats.avgInvoices') }}</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-slate-100 mt-2">0</p>
        </div>
        <div class="p-3 bg-orange-50 rounded-xl">
          <svg
            class="w-6 h-6 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientStats',
  props: {
    clients: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
