<template>
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('otpLogs.title') }}</h1>
      <p class="text-gray-600 dark:text-gray-300 mt-2">{{ $t('otpLogs.subtitle') }}</p>
    </div>

    <!-- الفلاتر -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('otpLogs.search') }}</label>
          <input
            v-model="filters.search"
            type="text"
            :placeholder="$t('otpLogs.search_placeholder')"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @keyup.enter="applyFilters"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('otpLogs.status') }}</label>
          <select
            v-model="filters.status"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{{ $t('otpLogs.all') }}</option>
            <option value="sent">{{ $t('otpLogs.sent') }}</option>
            <option value="verified">{{ $t('otpLogs.verified') }}</option>
            <option value="expired">{{ $t('otpLogs.expired') }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('otpLogs.from_date') }}</label>
          <input
            v-model="filters.date_from"
            type="date"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('otpLogs.to_date') }}</label>
          <input
            v-model="filters.date_to"
            type="date"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div class="flex justify-end gap-3 mt-4">
        <button
          type="button"
          @click="resetFilters"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-gray-700 transition"
        >
          {{ $t('otpLogs.reset') }}
        </button>
        <button
          type="button"
          @click="applyFilters"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {{ $t('otpLogs.apply') }}
        </button>
      </div>
    </div>

    <!-- تحميل -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- خطأ -->
    <div
      v-else-if="error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400"
    >
      {{ error }}
    </div>

    <!-- الجدول -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ $t('otpLogs.user') }}</th>
              <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ $t('otpLogs.status') }}</th>
              <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ $t('otpLogs.ip_address') }}</th>
              <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ $t('otpLogs.created_at') }}</th>
              <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ $t('otpLogs.expires_at') }}</th>
              <th class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{{ $t('otpLogs.verified_at') }}</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-gray-700/50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ log.user?.name || $t('otpLogs.unknown_user') }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ log.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="statusClass(log.status)"
                >
                  {{ statusText(log.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ log.ip_address || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDateTime(log.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDateTime(log.expires_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDateTime(log.verified_at) }}
              </td>
            </tr>
            <tr v-if="logs.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                {{ $t('otpLogs.no_results') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- الترقيم -->
      <div
        v-if="pagination.last_page > 1"
        class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            {{ $t('otpLogs.showing', { from: pagination.from || 0, to: pagination.to || 0, total: pagination.total }) }}
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              @click="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-gray-600"
            >
              {{ $t('otpLogs.previous') }}
            </button>
            <span class="px-3 py-1 border border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-sm">
              {{ pagination.current_page }}
            </span>
            <button
              type="button"
              @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-gray-600"
            >
              {{ $t('otpLogs.next') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

export default {
  name: 'OtpLogs',

  data() {
    return {
      filters: { search: '', status: '', date_from: '', date_to: '', page: 1 },
    }
  },

  computed: {
    ...mapGetters('otpLogs', ['logs', 'loading', 'error', 'pagination']),
  },

  created() {
    this.load()
  },

  methods: {
    ...mapActions('otpLogs', ['fetchLogs']),

    load() {
      return this.fetchLogs({ ...this.filters }).catch(() => {})
    },

    applyFilters() {
      this.filters.page = 1
      this.load()
    },

    resetFilters() {
      this.filters = { search: '', status: '', date_from: '', date_to: '', page: 1 }
      this.load()
    },

    changePage(page) {
      if (page >= 1 && page <= this.pagination.last_page) {
        this.filters.page = page
        this.load()
      }
    },

    formatDateTime(date) {
      return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '-'
    },

    statusClass(status) {
      const map = {
        sent: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
        verified: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
        expired: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
      }
      return map[status] || map.expired
    },

    statusText(status) {
      const map = {
        sent: this.$t('otpLogs.sent'),
        verified: this.$t('otpLogs.verified'),
        expired: this.$t('otpLogs.expired'),
      }
      return map[status] || status
    },
  },
}
</script>
