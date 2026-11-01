<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 md:py-12"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div class="flex items-center gap-4">
          <div
            class="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-emerald-100/50 dark:shadow-none border border-gray-100/80 dark:border-slate-700"
          >
            <svg
              class="w-7 h-7 text-emerald-600 dark:text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {{ $t('support.tickets_title') || 'تذاكر الدعم' }}
            </h1>
            <p class="text-gray-500 dark:text-slate-400 text-sm mt-1 font-medium">
              {{ $t('support.tickets_subtitle') || 'إدارة ومراقبة جميع طلبات الدعم الفني' }}
            </p>
          </div>
        </div>
        <router-link
          to="/support"
          class="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 flex items-center gap-2.5 font-semibold text-sm transform hover:-translate-y-0.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M12 4v16m8-8H4"
            />
          </svg>
          {{ $t('support.new_ticket') || 'تذكرة جديدة' }}
        </router-link>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div
          class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <div
            class="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-emerald-600 dark:text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9.348 14.652a3.75 3.75 0 010-5.304m5.304 0a3.75 3.75 0 010 5.304m-7.425 2.121a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12z"
              />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-extrabold text-gray-900 dark:text-white">
              {{ openTickets.length }}
            </p>
            <p class="text-sm text-gray-500 dark:text-slate-400 font-medium">
              {{ $t('support.open') || 'مفتوحة' }}
            </p>
          </div>
        </div>
        <div
          class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <div
            class="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center"
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
                stroke-width="1.5"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-extrabold text-gray-900 dark:text-white">
              {{ inProgressTickets.length }}
            </p>
            <p class="text-sm text-gray-500 dark:text-slate-400 font-medium">
              {{ $t('support.in_progress') || 'قيد المعالجة' }}
            </p>
          </div>
        </div>
        <div
          class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <div
            class="w-12 h-12 bg-gray-50 dark:bg-slate-700/50 rounded-xl flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-gray-500 dark:text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-extrabold text-gray-900 dark:text-white">
              {{ closedTickets.length }}
            </p>
            <p class="text-sm text-gray-500 dark:text-slate-400 font-medium">
              {{ $t('support.closed') || 'مغلقة' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Filters Bar -->
      <div
        class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 items-center"
      >
        <div class="flex-1 w-full md:w-auto relative">
          <svg
            class="w-5 h-5 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            v-model="filters.search"
            @input="debouncedSearch"
            type="text"
            :placeholder="$t('support.search_placeholder') || 'ابحث برقم التذكرة أو الموضوع...'"
            class="w-full pl-11 pr-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-all"
          />
        </div>
        <div class="flex gap-3 w-full md:w-auto">
          <select
            v-model="filters.status"
            @change="applyFilters"
            class="px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 text-sm font-medium appearance-none"
          >
            <option value="">{{ $t('support.all_statuses') || 'كل الحالات' }}</option>
            <option value="open">{{ $t('support.open') || 'مفتوحة' }}</option>
            <option value="in_progress">{{ $t('support.in_progress') || 'قيد المعالجة' }}</option>
            <option value="closed">{{ $t('support.closed') || 'مغلقة' }}</option>
          </select>
          <select
            v-model="filters.priority"
            @change="applyFilters"
            class="px-4 py-2.5 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 text-sm font-medium appearance-none"
          >
            <option value="">{{ $t('support.all_priorities') || 'كل الأولويات' }}</option>
            <option value="high">{{ $t('support.high') || 'عالية' }}</option>
            <option value="medium">{{ $t('support.medium') || 'متوسطة' }}</option>
            <option value="low">{{ $t('support.low') || 'منخفضة' }}</option>
          </select>
          <button
            v-if="hasActiveFilters"
            @click="clearAllFilters"
            class="px-4 py-2.5 text-gray-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 border border-gray-200 dark:border-slate-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm font-medium flex items-center gap-1.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            {{ $t('common.clear') || 'مسح' }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-8 text-center"
      >
        <svg
          class="w-12 h-12 text-red-500 mx-auto mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        <h3 class="text-lg font-bold text-red-700 dark:text-red-400 mb-2">
          {{ error === 'Unauthenticated.' ? 'يجب تسجيل الدخول أولاً' : 'خطأ في تحميل التذاكر' }}
        </h3>
        <p class="text-sm text-red-600 dark:text-red-300 mb-4">{{ error }}</p>
        <button
          v-if="error === 'Unauthenticated.'"
          @click="$router.push('/login')"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          تسجيل الدخول
        </button>
        <button
          v-else
          @click="loadTickets(pagination.current_page)"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!hasTickets"
        class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-12 text-center"
      >
        <div
          class="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <svg
            class="w-10 h-10 text-gray-400 dark:text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
            />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {{ $t('support.no_tickets') || 'لا توجد تذاكر' }}
        </h3>
        <p class="text-gray-500 dark:text-slate-400 mb-5">
          {{ $t('support.no_tickets_desc') || 'لم يتم العثور على تذاكر مطابقة للفلاتر المحددة' }}
        </p>
        <router-link
          to="/support"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M12 4v16m8-8H4"
            />
          </svg>
          {{ $t('support.create_first') || 'إنشاء أول تذكرة' }}
        </router-link>
      </div>

      <!-- Tickets Table -->
      <div
        v-else
        class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-slate-700/50">
              <tr>
                <th
                  class="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  {{ $t('support.ticket_number') || 'رقم التذكرة' }}
                </th>
                <th
                  class="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  {{ $t('support.subject') || 'الموضوع' }}
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  {{ $t('support.status') || 'الحالة' }}
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  {{ $t('support.priority') || 'الأولوية' }}
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  {{ $t('support.replies') || 'الردود' }}
                </th>
                <th
                  class="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  {{ $t('support.date') || 'التاريخ' }}
                </th>
                <th
                  class="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  {{ $t('common.actions') || 'الإجراءات' }}
                </th>
              </tr>
            </thead>
            <tbody
              class="bg-white dark:bg-slate-800 divide-y divide-gray-100 dark:divide-slate-700"
            >
              <tr
                v-for="ticket in tickets"
                :key="ticket.id"
                class="hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors group"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="font-mono text-sm font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg"
                    >{{ ticket.ticket_number }}</span
                  >
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    >
                      {{ getInitials(ticket.name) }}
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {{ ticket.subject }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-slate-400 truncate">
                        {{ ticket.name }}
                      </p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span :class="statusBadgeClass(ticket.status)">{{
                    statusLabel(ticket.status)
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span :class="priorityBadgeClass(ticket.priority)">
                    <span class="w-1.5 h-1.5 rounded-full bg-current mr-1.5 inline-block"></span>
                    {{ priorityLabel(ticket.priority) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div
                    class="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-full"
                  >
                    <svg
                      class="w-3.5 h-3.5 text-gray-500 dark:text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                      />
                    </svg>
                    <span class="text-sm font-semibold text-gray-700 dark:text-slate-300">{{
                      ticket.replies_count || 0
                    }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span class="text-sm text-gray-500 dark:text-slate-400 font-mono">{{
                    formatDate(ticket.created_at)
                  }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <div class="flex items-center justify-center gap-1">
                    <router-link
                      :to="`/support/tickets/${ticket.id}`"
                      class="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all"
                      :title="$t('support.view') || 'عرض'"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </router-link>
                    <button
                      v-if="ticket.status !== 'closed'"
                      @click="handleCloseTicket(ticket.id)"
                      class="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      :title="$t('support.close') || 'إغلاق'"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="pagination.last_page > 1"
          class="px-6 py-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between"
        >
          <p class="text-sm text-gray-500 dark:text-slate-400">
            {{ $t('support.showing') || 'عرض' }}
            <span class="font-semibold">{{ tickets.length }}</span> {{ $t('support.of') || 'من' }}
            <span class="font-semibold">{{ pagination.total }}</span>
            {{ $t('support.tickets') || 'تذكرة' }}
          </p>
          <div class="flex items-center gap-2">
            <button
              @click="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {{ $t('common.previous') || 'السابق' }}
            </button>
            <span
              class="px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-700 rounded-lg"
            >
              {{ pagination.current_page }} / {{ pagination.last_page }}
            </span>
            <button
              @click="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {{ $t('common.next') || 'التالي' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { listenStaff } from '@/utils/supportRealtime'

export default {
  name: 'SupportTicketList',

  data() {
    return {
      filters: {
        status: '',
        priority: '',
        search: '',
      },
      searchTimeout: null,
    }
  },

  computed: {
    ...mapState('support', ['tickets', 'loading', 'error', 'pagination']),
    ...mapGetters('support', ['openTickets', 'closedTickets', 'inProgressTickets', 'hasTickets']),
    hasActiveFilters() {
      return this.filters.status || this.filters.priority || this.filters.search
    },
  },

  mounted() {
    this.loadTickets()
    // أي رسالة أو تذكرة جديدة أو تغيّر حالة: نعيد تحميل الصفحة الحالية بصمت
    this.unlisten = listenStaff({
      onMessage: this.scheduleRefresh,
      onTicketCreated: this.scheduleRefresh,
      onTicketUpdated: this.scheduleRefresh,
    })
  },

  beforeUnmount() {
    clearTimeout(this.refreshTimeout)
    clearTimeout(this.searchTimeout)
    if (this.unlisten) this.unlisten()
  },

  methods: {
    ...mapActions('support', ['fetchTickets', 'closeTicket', 'refreshTickets']),

    loadTickets(page = 1) {
      this.fetchTickets({
        page,
        per_page: this.pagination.per_page,
        ...this.filters,
      }).catch(() => {})
    },

    // تجميع الأحداث المتقاربة في طلب واحد
    scheduleRefresh() {
      clearTimeout(this.refreshTimeout)
      this.refreshTimeout = setTimeout(() => {
        this.refreshTickets({
          page: this.pagination.current_page,
          per_page: this.pagination.per_page,
          ...this.filters,
        })
      }, 400)
    },

    async handleCloseTicket(id) {
      if (!confirm(this.$t('support.confirm_close') || 'هل أنت متأكد من إغلاق التذكرة؟')) return
      try {
        await this.closeTicket(id)
      } catch (error) {
        if (error.response?.status === 401) {
          this.$router.push('/login')
        }
      }
    },

    debouncedSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.applyFilters()
      }, 300)
    },

    applyFilters() {
      this.loadTickets(1)
    },

    changePage(page) {
      if (page >= 1 && page <= this.pagination.last_page) {
        this.loadTickets(page)
      }
    },

    clearAllFilters() {
      this.filters = { status: '', priority: '', search: '' }
      this.loadTickets(1)
    },

    getInitials(name) {
      if (!name) return '؟'
      return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return new Intl.DateTimeFormat(this.$i18n.locale === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date)
    },

    statusBadgeClass(status) {
      const classes = {
        open: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50',
        in_progress:
          'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50',
        closed:
          'bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-600',
      }
      return `inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${classes[status] || classes.closed}`
    },

    statusLabel(status) {
      const labels = { open: 'مفتوحة', in_progress: 'قيد المعالجة', closed: 'مغلقة' }
      return labels[status] || status
    },

    priorityBadgeClass(priority) {
      const classes = {
        high: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
        medium: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
        low: 'bg-gray-50 dark:bg-slate-700/50 text-gray-600 dark:text-slate-400',
      }
      return `inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${classes[priority] || classes.low}`
    },

    priorityLabel(priority) {
      const labels = { high: 'عالية', medium: 'متوسطة', low: 'منخفضة' }
      return labels[priority] || priority
    },
  },
}
</script>
