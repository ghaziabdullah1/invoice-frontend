<template>
  <div class="report-filters">
    <div
      class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5"
    >
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div class="flex items-center gap-2">
          <svg
            class="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {{ $t('reports.filters') }}
          </h2>
        </div>

        <div class="flex gap-2">
          <button
            @click="applyFilters"
            :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {{ $t('common.search') }}
          </button>
          <button
            @click="resetFilters"
            class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {{ $t('common.reset') }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Start Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('common.fromDate') }}
          </label>
          <div class="relative">
            <input
              type="date"
              v-model="localFilters.start_date"
              class="ui-input"
            />
            <svg
              class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <!-- End Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('common.toDate') }}
          </label>
          <div class="relative">
            <input
              type="date"
              v-model="localFilters.end_date"
              class="ui-input"
            />
            <svg
              class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('reports.invoiceStatus') }}
          </label>
          <div class="relative">
            <select
              v-model="localFilters.status"
              class="ui-input"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option value="draft">{{ $t('invoices.status.draft') }}</option>
              <option value="sent">{{ $t('invoices.status.sent') }}</option>
              <option value="paid">{{ $t('invoices.status.paid') }}</option>
              <option value="overdue">{{ $t('invoices.status.overdue') }}</option>
            </select>
            <svg
              class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        <!-- Client Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {{ $t('clients.title') }}
          </label>
          <div class="relative">
            <select
              v-model="localFilters.client_id"
              class="ui-input"
            >
              <option value="">{{ $t('common.all') }}</option>
              <option
                v-for="client in clients"
                :key="client.id"
                :value="client.id"
                v-if="client && client.id"
              >
                {{ client.name }}
              </option>
            </select>
            <svg
              class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportFilters',
  props: {
    filters: { type: Object, default: () => ({}) },
    clients: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      localFilters: { ...this.filters },
    }
  },
  watch: {
    filters: {
      immediate: true,
      handler(newFilters) {
        this.localFilters = { ...newFilters }
      },
    },
  },
  methods: {
    applyFilters() {
      this.$emit('apply-filters', this.localFilters)
    },
    resetFilters() {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)
      this.localFilters = {
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: '',
        client_id: '',
        user_id: '',
        per_page: 20,
        page: 1,
      }
      this.$emit('apply-filters', this.localFilters)
    },
  },
}
</script>
