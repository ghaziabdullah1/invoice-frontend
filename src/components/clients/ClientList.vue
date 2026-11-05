<template>
  <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700/60 overflow-hidden">
    <!-- حالة عدم وجود بيانات -->
    <div v-if="!loading && clientsData.length === 0" class="text-center py-12">
      <svg
        class="w-24 h-24 text-gray-300 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 dark:text-slate-100 mb-2">لا يوجد عملاء</h3>
      <p class="text-gray-500">لم يتم إضافة أي عملاء بعد</p>
      <button
        @click="$emit('add')"
        class="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        إضافة عميل جديد
      </button>
    </div>

    <!-- جدول العملاء -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-slate-900">
          <tr>
            <th
              class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              العميل
            </th>
            <th
              class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              البريد الإلكتروني
            </th>
            <th
              class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              الهاتف
            </th>
            <th
              class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              الشركة
            </th>
            <th
              class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              تاريخ التسجيل
            </th>
            <th
              class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              الإجراءات السريعة
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
          <tr v-if="loading">
            <td colspan="6" class="px-6 py-8 text-center">
              <div class="flex justify-center items-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span class="mr-3 text-gray-600 dark:text-slate-400">جاري التحميل...</span>
              </div>
            </td>
          </tr>

          <tr
            v-else
            v-for="client in clientsData"
            :key="client.id"
            class="hover:bg-gray-50 dark:bg-slate-900 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3"
                >
                  <span class="text-blue-600 text-sm font-semibold">{{
                    getInitials(client.name)
                  }}</span>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-slate-100">{{ client.name }}</div>
                  <div class="text-sm text-gray-500">
                    {{ client.tax_number || 'غير متوفر' }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-slate-100">
                {{ client.email || 'غير متوفر' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-slate-100">
                {{ client.phone || 'غير متوفر' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-slate-100">
                {{ client.company_name || 'غير متوفر' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 dark:text-slate-100">{{ formatDate(client.created_at) }}</div>
              <div class="text-sm text-gray-500">
                آخر تحديث: {{ formatDate(client.updated_at) }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center space-x-2 space-x-reverse">
                <button
                  @click="$emit('view', client)"
                  class="text-blue-600 hover:text-blue-900 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                >
                  عرض
                </button>
                <button
                  @click="$emit('edit', client)"
                  class="text-green-600 hover:text-green-900 px-3 py-1 rounded hover:bg-green-50 transition-colors"
                >
                  تعديل
                </button>
                <button
                  @click="$emit('delete', client)"
                  class="text-red-600 hover:text-red-900 px-3 py-1 rounded hover:bg-red-50 transition-colors"
                >
                  حذف
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientList',
  props: {
    clients: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['edit', 'delete', 'view', 'add'],
  computed: {
    clientsData() {
      return this.clients || []
    },
  },
  methods: {
    getInitials(name) {
      if (!name) return '?'
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },
  },
}
</script>
