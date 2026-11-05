<template>
  <div class="container mx-auto px-4 py-8">
    <!-- رأس الصفحة -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('activity.title') }}</h1>
      <p class="text-gray-600 dark:text-gray-300 mt-2">{{ $t('activity.subtitle') }}</p>
    </div>

    <!-- شريط التصفية والبحث -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- بحث عام -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{
            $t('activity.search')
          }}</label>
          <input
            v-model="filters.search"
            type="text"
            :placeholder="$t('activity.search_placeholder')"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @keyup.enter="applyFilters"
          />
        </div>

        <!-- تصفية حسب نوع الإجراء -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{
            $t('activity.action')
          }}</label>
          <select
            v-model="filters.action"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">{{ $t('activity.all') }}</option>
            <option value="CREATE">{{ $t('activity.create') }}</option>
            <option value="UPDATE">{{ $t('activity.update') }}</option>
            <option value="DELETE">{{ $t('activity.delete') }}</option>
            <option value="LOGIN">{{ $t('activity.login') }}</option>
            <option value="LOGOUT">{{ $t('activity.logout') }}</option>
            <option value="CHANGE_PASSWORD">{{ $t('activity.change_password') }}</option>
          </select>
        </div>

        <!-- تصفية حسب التاريخ -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{
            $t('activity.from_date')
          }}</label>
          <input
            v-model="filters.date_from"
            type="date"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{
            $t('activity.to_date')
          }}</label>
          <input
            v-model="filters.date_to"
            type="date"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- أزرار التصفية -->
      <div class="flex justify-end gap-3 mt-4">
        <button
          @click="resetFilters"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-gray-700 transition"
        >
          <i class="fas fa-undo ml-2"></i>
          {{ $t('activity.reset') }}
        </button>
        <button
          @click="applyFilters"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <i class="fas fa-search ml-2"></i>
          {{ $t('activity.apply') }}
        </button>
      </div>
    </div>

    <!-- حالة التحميل -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- حالة الخطأ -->
    <div
      v-else-if="error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400"
    >
      <i class="fas fa-exclamation-circle ml-2"></i>
      {{ error }}
    </div>

    <!-- جدول النشاطات -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {{ $t('activity.user') }}
              </th>
              <th
                class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {{ $t('activity.action') }}
              </th>
              <th
                class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {{ $t('activity.description') }}
              </th>
              <th
                class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {{ $t('activity.model') }}
              </th>
              <th
                class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {{ $t('activity.ip_address') }}
              </th>
              <th
                class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {{ $t('activity.date_time') }}
              </th>
              <th
                class="px-6 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              ></th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="log in logs"
              :key="log.id"
              class="hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-gray-700/50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="flex-shrink-0 h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold"
                  >
                    {{ log.user ? log.user.name.charAt(0).toUpperCase() : '?' }}
                  </div>
                  <div class="mr-3">
                    <div class="text-sm font-medium text-gray-900 dark:text-white ml-4">
                      {{ log.user ? log.user.name : $t('activity.unknown_user') }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 ml-4">
                      {{ log.user ? log.user.email : '' }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300':
                      log.action === 'CREATE',
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300':
                      log.action === 'UPDATE',
                    'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300':
                      log.action === 'DELETE',
                    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300': [
                      'LOGIN',
                      'LOGOUT',
                    ].includes(log.action),
                    'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300':
                      log.action === 'CHANGE_PASSWORD',
                  }"
                >
                  {{ log.action }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-gray-100">{{ log.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ log.model_type ? log.model_type.split('\\').pop() : '-' }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ log.model_id || '' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ log.ip_address || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <div>{{ formatDate(log.created_at) }}</div>
                <div class="text-xs">{{ formatTime(log.created_at) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="showDetails(log)"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 ml-3"
                  :title="$t('activity.details')"
                >
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
            <tr v-if="logs.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                {{ $t('activity.no_results') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ترقيم الصفحات -->
      <div
        v-if="pagination.last_page > 1"
        class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            {{
              $t('activity.showing', {
                from: pagination.from || 0,
                to: pagination.to || 0,
                total: pagination.total,
              })
            }}
          </div>
          <div class="flex gap-2">
            <button
              @click="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-gray-600"
            >
              {{ $t('activity.previous') }}
            </button>
            <span
              class="px-3 py-1 border border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-sm"
            >
              {{ pagination.current_page }}
            </span>
            <button
              @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-gray-600"
            >
              {{ $t('activity.next') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- نافذة عرض التفاصيل (modal) -->
    <div
      v-if="selectedLog"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ $t('activity.details') }}
            </h3>
            <button
              @click="selectedLog = null"
              class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">{{
                  $t('activity.action')
                }}</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ selectedLog.action }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">{{
                  $t('activity.user')
                }}</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ selectedLog.user ? selectedLog.user.name : $t('activity.unknown_user') }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">{{
                  $t('activity.model')
                }}</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ selectedLog.model_type ? selectedLog.model_type.split('\\').pop() : '-' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">{{
                  $t('activity.model_id')
                }}</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ selectedLog.model_id || '-' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">{{
                  $t('activity.ip_address')
                }}</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ selectedLog.ip_address || '-' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">{{
                  $t('activity.date_time')
                }}</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ formatDateTime(selectedLog.created_at) }}
                </p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">{{
                $t('activity.description')
              }}</label>
              <p
                class="mt-1 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
              >
                {{ selectedLog.description }}
              </p>
            </div>

            <div
              v-if="selectedLog.old_values"
              class="border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{{
                $t('activity.old_values')
              }}</label>
              <pre
                class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-xs text-gray-900 dark:text-gray-100 overflow-auto max-h-40"
                >{{ JSON.stringify(selectedLog.old_values, null, 2) }}</pre
              >
            </div>

            <div
              v-if="selectedLog.new_values"
              class="border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              <label class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{{
                $t('activity.new_values')
              }}</label>
              <pre
                class="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-xs text-gray-900 dark:text-gray-100 overflow-auto max-h-40"
                >{{ JSON.stringify(selectedLog.new_values, null, 2) }}</pre
              >
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              @click="selectedLog = null"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              {{ $t('activity.close') }}
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
import axios from '@/api/axios'

export default {
  name: 'ActivityLogs',
  data() {
    return {
      filters: {
        search: '',
        action: '',
        user_id: '',
        date_from: '',
        date_to: '',
        page: 1,
      },
      users: [],
      selectedLog: null,
    }
  },
  computed: {
    ...mapGetters('activity', ['logs', 'loading', 'error', 'pagination']),
  },
  methods: {
    ...mapActions('activity', ['fetchLogs', 'updateFilters', 'resetFilters']),

    applyFilters() {
      this.filters.page = 1
      this.updateFilters(this.filters)
      this.fetchLogs()
    },

    changePage(page) {
      if (page >= 1 && page <= this.pagination.last_page) {
        this.filters.page = page
        this.updateFilters({ page })
        this.fetchLogs()
      }
    },

    formatDate(date) {
      return date ? moment(date).format('YYYY-MM-DD') : '-'
    },
    formatTime(date) {
      return date ? moment(date).format('HH:mm:ss') : '-'
    },
    formatDateTime(date) {
      return date ? moment(date).format('YYYY-MM-DD HH:mm:ss') : '-'
    },

    showDetails(log) {
      this.selectedLog = log
    },

    async loadUsers() {
      try {
        const response = await axios.get('/admin/users?per_page=1000')
        this.users = response.data.data || []
      } catch (error) {
        console.error('فشل تحميل قائمة المستخدمين', error)
      }
    },
  },
  created() {
    this.fetchLogs()
    this.loadUsers()
  },
}
</script>
