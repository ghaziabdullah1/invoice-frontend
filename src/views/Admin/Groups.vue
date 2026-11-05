<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-slate-900 dark:from-gray-900 dark:to-gray-800 py-6 md:py-8 transition-colors duration-300"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 md:mb-10">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
          <div class="flex-1">
            <div class="flex items-center gap-4 mb-3">
              <div
                class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl shadow-lg"
              >
                <svg
                  class="w-6 h-6 text-white"
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
              </div>
              <div>
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {{ $t('groups.title') }}
                </h1>
                <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {{ $t('groups.subtitle') }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- Dark Mode Toggle -->
            <button
              @click="toggleDarkMode"
              class="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-gray-600 dark:text-yellow-400"
              :title="isDark ? $t('common.light_mode') : $t('common.dark_mode')"
            >
              <svg
                v-if="!isDark"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </button>

            <button
              @click="openAddModal"
              class="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 w-full sm:w-auto"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span class="font-medium">{{ $t('groups.create_new') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <!-- Total Groups -->
        <div
          class="stats-card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 dark:border-blue-800"
        >
          <div class="stats-icon bg-blue-100 dark:bg-blue-900/50">
            <svg
              class="w-6 h-6 text-blue-600 dark:text-blue-400"
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
          </div>
          <div>
            <p class="stats-label dark:text-gray-300">{{ $t('groups.total_groups') }}</p>
            <p class="stats-value dark:text-white">{{ storeGroups.length }}</p>
          </div>
        </div>

        <!-- Active Groups -->
        <div
          class="stats-card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 dark:border-green-800"
        >
          <div class="stats-icon bg-green-100 dark:bg-green-900/50">
            <svg
              class="w-6 h-6 text-green-600 dark:text-green-400"
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
          <div>
            <p class="stats-label dark:text-gray-300">{{ $t('groups.active_groups') }}</p>
            <p class="stats-value dark:text-white">{{ activeGroupsCount }}</p>
          </div>
        </div>

        <!-- Inactive Groups -->
        <div
          class="stats-card bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 dark:border-red-800"
        >
          <div class="stats-icon bg-red-100 dark:bg-red-900/50">
            <svg
              class="w-6 h-6 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636"
              />
            </svg>
          </div>
          <div>
            <p class="stats-label dark:text-gray-300">{{ $t('groups.inactive_groups') }}</p>
            <p class="stats-value dark:text-white">{{ inactiveGroupsCount }}</p>
          </div>
        </div>

        <!-- Total Users in Groups (optional) -->
        <div
          class="stats-card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 dark:border-purple-800"
        >
          <div class="stats-icon bg-purple-100 dark:bg-purple-900/50">
            <svg
              class="w-6 h-6 text-purple-600 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197"
              />
            </svg>
          </div>
          <div>
            <p class="stats-label dark:text-gray-300">{{ $t('groups.total_users') }}</p>
            <p class="stats-value dark:text-white">{{ totalUsersInGroups }}</p>
          </div>
        </div>
      </div>

      <!-- Filters Card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6 transition-colors duration-300"
      >
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <svg
                class="w-5 h-5 text-blue-600 dark:text-blue-400"
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
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
                {{ $t('common.filters') }}
              </h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ $t('groups.filter_subtitle') }}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              @click="loadData"
              class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow transition-colors duration-200 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {{ $t('buttons.search') }}
            </button>
            <button
              @click="resetFilters"
              class="px-4 py-2.5 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {{ $t('reports.buttons.reset_filters') }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.search') }}
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="filters.search"
                :placeholder="$t('groups.search_placeholder')"
                class="w-full px-4 py-2.5 pl-10 pr-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <button
                v-if="filters.search"
                @click="clearSearch"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-gray-300"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.status') }}
            </label>
            <div class="relative">
              <select
                v-model="filters.status"
                class="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none pr-10 text-gray-900 dark:text-white"
              >
                <option value="all">{{ $t('common.all') }}</option>
                <option value="active">{{ $t('groups.status.active') }}</option>
                <option value="inactive">{{ $t('groups.status.inactive') }}</option>
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

          <!-- System Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('groups.system_group') }}
            </label>
            <div class="relative">
              <select
                v-model="filters.is_system"
                class="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none pr-10 text-gray-900 dark:text-white"
              >
                <option value="">{{ $t('common.all') }}</option>
                <option value="1">{{ $t('common.yes') }}</option>
                <option value="0">{{ $t('common.no') }}</option>
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

          <!-- Date Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {{ $t('common.date_from') }}
            </label>
            <div class="relative">
              <input
                type="date"
                v-model="filters.date_from"
                class="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10 text-gray-900 dark:text-white"
              />
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="storeLoading"
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 mb-6 transition-colors duration-300"
      >
        <div class="text-center">
          <div class="inline-block relative">
            <div class="w-14 h-14 border-4 border-blue-100 dark:border-blue-900 rounded-full"></div>
            <div
              class="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"
            ></div>
          </div>
          <p class="text-gray-700 dark:text-gray-200 font-medium mt-4">
            {{ $t('common.loading') }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {{ $t('groups.loading_subtitle') }}
          </p>
        </div>
      </div>

      <!-- Error State -->
      <div
        v-else-if="storeError"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 transition-colors duration-300"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0 pt-0.5">
            <svg
              class="w-5 h-5 text-red-500 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="mr-3 flex-1">
            <h3 class="text-sm font-medium text-red-800 dark:text-red-300">
              {{ $t('errors.load_failed') }}
            </h3>
            <p class="text-sm text-red-700 dark:text-red-400 mt-1">{{ storeError }}</p>
          </div>
          <button
            @click="clearStoreError"
            class="p-1.5 text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Table Section -->
      <div v-else>
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300"
        >
          <!-- Table Header -->
          <div
            class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  {{ $t('groups.group_list') }}
                </h3>
                <span
                  class="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full"
                >
                  {{ storeGroups.length }} {{ $t('common.total') }}
                </span>
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ $t('groups.list_subtitle') }}
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="storeGroups.length === 0" class="text-center py-16 px-4">
            <div class="max-w-sm mx-auto">
              <div
                class="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              >
                <svg
                  class="w-10 h-10 text-blue-400 dark:text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {{ $t('groups.no_groups') }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                {{ $t('groups.start_creating_message') }}
              </p>
              <button
                @click="openAddModal"
                class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow transition-colors duration-200 flex items-center gap-2 mx-auto"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {{ $t('groups.create_first') }}
              </button>
            </div>
          </div>

          <!-- Table Content -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300">
                <tr>
                  <th
                    class="px-6 py-3 text-start text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {{ $t('groups.name') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {{ $t('groups.users_count') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {{ $t('groups.permissions_count') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {{ $t('common.status') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {{ $t('groups.system_group') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {{ $t('common.created_at') }}
                  </th>
                  <th
                    class="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {{ $t('common.actions') }}
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300"
              >
                <tr
                  v-for="group in filteredGroups"
                  :key="group.id"
                  class="hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors duration-150"
                >
                  <!-- Name (locale-aware) -->
                  <td class="px-6 py-4">
                    <div class="text-sm font-semibold text-gray-900 dark:text-white text-start" dir="auto">
                      {{ $i18n.locale === 'ar' ? group.title_ar : group.title_en }}
                    </div>
                    <div
                      class="text-xs text-gray-500 dark:text-gray-400 mt-1"
                      v-if="group.description"
                    >
                      {{ group.description }}
                    </div>
                  </td>

                  <!-- Users Count with Icon -->
                  <td class="px-6 py-4 text-center">
                    <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full border border-blue-100 dark:border-blue-800">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {{ group.users_count || 0 }}
                    </div>
                  </td>

                  <!-- Permissions Count with Icon -->
                  <td class="px-6 py-4 text-center">
                    <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-semibold rounded-full border border-purple-100 dark:border-purple-800">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      {{ group.permissions_count || 0 }}
                    </div>
                  </td>

                  <!-- Status -->
                  <td class="px-6 py-4 text-center">
                    <span
                      :class="
                        group.is_active
                          ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800'
                          : 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
                      "
                      class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border"
                    >
                      <span
                        :class="group.is_active ? 'bg-green-500' : 'bg-red-500'"
                        class="w-2 h-2 rounded-full ml-2"
                      ></span>
                      {{
                        group.is_active ? $t('groups.status.active') : $t('groups.status.inactive')
                      }}
                    </span>
                  </td>

                  <!-- System Group -->
                  <td class="px-6 py-4 text-center">
                    <span
                      v-if="group.is_system"
                      class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
                    >
                      {{ $t('common.yes') }}
                    </span>
                    <span v-else class="text-gray-400 dark:text-gray-500">-</span>
                  </td>

                  <!-- Created Date -->
                  <td class="px-6 py-4 text-center">
                    <div class="text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {{ formatDate(group.created_at) }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {{ $t('common.created') }}
                    </div>
                  </td>

                  <!-- Actions -->
                  <td class="px-6 py-4 text-center">
                    <div class="flex items-center justify-center gap-2">
                      <button
                        @click="editGroup(group)"
                        class="ui-icon-btn"
                        :title="$t('buttons.edit')"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        @click="managePermissions(group)"
                        class="p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors duration-200"
                        :title="$t('groups.manage_permissions')"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </button>
                      <button
                        @click="toggleGroupStatus(group)"
                        :class="
                          group.is_active
                            ? 'hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30'
                            : 'hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30'
                        "
                        class="p-2 text-gray-600 dark:text-gray-400 rounded-lg transition-colors duration-200"
                        :title="group.is_active ? $t('groups.deactivate') : $t('groups.activate')"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            v-if="!group.is_active"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                          <path
                            v-else
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                          />
                        </svg>
                      </button>
                      <button
                        v-if="!group.is_system"
                        @click="confirmDelete(group)"
                        class="ui-icon-btn"
                        :title="$t('buttons.delete')"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Group Form Modal -->
    <GroupForm :show="showModal" :group="editingGroup" @close="closeModal" @saved="onGroupSaved" />

    <!-- Permissions Modal -->
    <transition name="modal-fade">
      <div
        v-if="showPermissionsModal"
        class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50"
        @click.self="closePermissionsModal"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 transition-colors duration-300"
        >
          <!-- Modal Header -->
          <div
            class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300"
          >
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-3">
                <div class="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <svg
                    class="w-5 h-5 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                    {{ $t('groups.manage_permissions') }}: {{ $i18n.locale === 'ar' ? selectedGroup?.title_ar : selectedGroup?.title_en }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {{ $t('groups.permissions_subtitle') }}
                  </p>
                </div>
              </div>
              <button
                @click="closePermissionsModal"
                class="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-6">
            <div v-if="permissionsLoading" class="text-center py-8">
              <div class="inline-block relative">
                <div
                  class="w-10 h-10 border-4 border-purple-100 dark:border-purple-900 rounded-full"
                ></div>
                <div
                  class="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"
                ></div>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mt-4">{{ $t('common.loading') }}</p>
            </div>

            <div v-else>
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('groups.select_permissions') }}
                </label>
                <div
                  class="space-y-3 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 transition-colors duration-300"
                >
                  <div
                    v-for="permission in availablePermissions"
                    :key="permission.id"
                    class="flex items-center"
                  >
                    <input
                      type="checkbox"
                      :id="'perm_' + permission.id"
                      :value="permission.id"
                      v-model="selectedPermissions"
                      class="ml-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                    />
                    <label
                      :for="'perm_' + permission.id"
                      class="text-sm text-gray-700 dark:text-gray-200"
                    >
                      <span dir="auto" class="text-start inline-block">{{ $i18n.locale === 'ar' ? (permission.description_ar || permission.title) : (permission.description_en || permission.title) }}</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400 block" dir="ltr" style="text-align: left;">
                        {{ permission.title }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  @click="closePermissionsModal"
                  class="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200 border border-gray-300 dark:border-gray-600"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  @click="savePermissions"
                  :disabled="permissionsSubmitting"
                  class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg
                    v-if="permissionsSubmitting"
                    class="w-4 h-4 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  <span>{{ $t('common.save') }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import GroupForm from './GroupForm.vue'

export default {
  name: 'AdminGroups',
  components: {
    GroupForm,
  },

  data() {
    return {
      showModal: false,
      showPermissionsModal: false,
      permissionsSubmitting: false,
      permissionsLoading: false,
      editingGroup: null,
      selectedGroup: null,
      filters: {
        search: '',
        status: 'all',
        is_system: '',
        date_from: '',
      },
      availablePermissions: [],
      selectedPermissions: [],
      isDark: false,
    }
  },

  computed: {
    ...mapState('groups', {
      storeGroups: (state) => state.adminGroups,
      storeLoading: (state) => state.isLoading,
      storeError: (state) => state.error,
    }),
    activeGroupsCount() {
      return this.storeGroups.filter((g) => g.is_active).length
    },
    inactiveGroupsCount() {
      return this.storeGroups.filter((g) => !g.is_active).length
    },
    totalUsersInGroups() {
      return this.storeGroups.reduce((sum, g) => sum + (g.users_count || 0), 0)
    },
    filteredGroups() {
      let groups = this.storeGroups
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        groups = groups.filter(
          (g) =>
            (g.title_en || '').toLowerCase().includes(search) ||
            (g.title_ar || '').includes(search) ||
            (g.description && g.description.toLowerCase().includes(search)),
        )
      }
      if (this.filters.status !== 'all') {
        const active = this.filters.status === 'active'
        groups = groups.filter((g) => g.is_active === active)
      }
      if (this.filters.is_system !== '') {
        const isSystem = this.filters.is_system === '1'
        groups = groups.filter((g) => g.is_system === isSystem)
      }
      if (this.filters.date_from) {
        const fromDate = new Date(this.filters.date_from)
        groups = groups.filter((g) => new Date(g.created_at) >= fromDate)
      }
      return groups
    },
  },

  async mounted() {
    // التحقق من الوضع المحفوظ
    const savedMode = localStorage.getItem('darkMode')
    if (
      savedMode === 'true' ||
      (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      this.isDark = true
      document.documentElement.classList.add('dark')
    }
    await this.loadData()
  },

  methods: {
    ...mapActions('groups', [
      'getAdminGroups',
      'createAdminGroup',
      'updateAdminGroup',
      'deleteAdminGroup',
      'updateGroupStatus',
      'getAvailablePermissions',
      'updateGroupPermissions',
      'clearError',
    ]),

    toggleDarkMode() {
      this.isDark = !this.isDark
      if (this.isDark) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('darkMode', 'true')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('darkMode', 'false')
      }
    },

    async loadData() {
      try {
        await this.getAdminGroups()
      } catch (error) {
        console.error('Error loading groups:', error)
        this.$toast.error(this.$t('errors.failed_to_load_data'))
      }
    },

    clearSearch() {
      this.filters.search = ''
      this.loadData()
    },

    resetFilters() {
      this.filters = {
        search: '',
        status: 'all',
        is_system: '',
        date_from: '',
      }
      this.loadData()
      this.$toast.info(this.$t('reports.buttons.reset_filters'))
    },

    clearStoreError() {
      this.clearError()
    },

    formatDate(date) {
      if (!date) return '-'
      const dateObj = new Date(date)
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },

    openAddModal() {
      this.editingGroup = null
      this.showModal = true
    },

    editGroup(group) {
      this.editingGroup = group
      this.showModal = true
    },

    async onGroupSaved() {
      await this.loadData()
    },

    closeModal() {
      this.showModal = false
      this.editingGroup = null
    },

    async toggleGroupStatus(group) {
      const action = group.is_active ? this.$t('groups.deactivate') : this.$t('groups.activate')
      const confirmed = await this.$swal({
        title: this.$t('groups.confirm_status_change_title'),
        text: this.$t('groups.confirm_status_change', { name: group.title_ar, action: action }),
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: group.is_active ? '#EAB308' : '#10B981',
        cancelButtonColor: '#6B7280',
        confirmButtonText: action,
        cancelButtonText: this.$t('common.cancel'),
        reverseButtons: true,
        focusCancel: true,
      })

      if (confirmed.isConfirmed) {
        try {
          await this.updateGroupStatus({
            id: group.id,
            is_active: !group.is_active,
          })
          await this.loadData()
          this.$toast.success(this.$t('groups.messages.status_change_success', { action: action }))
        } catch (error) {
          this.$toast.error(error.message || this.$t('errors.failed_to_change_status'))
        }
      }
    },

    async confirmDelete(group) {
      const confirmed = await this.$swal({
        title: this.$t('groups.delete_confirm_title'),
        text: this.$t('groups.delete_confirm', { name: group.title_ar }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: this.$t('common.delete'),
        cancelButtonText: this.$t('common.cancel'),
        reverseButtons: true,
        focusCancel: true,
      })

      if (confirmed.isConfirmed) {
        try {
          await this.deleteAdminGroup(group.id)
          await this.loadData()
          this.$toast.success(this.$t('groups.messages.delete_success'))
        } catch (error) {
          this.$toast.error(error.message || this.$t('errors.failed_to_delete_group'))
        }
      }
    },

    async managePermissions(group) {
      this.selectedGroup = group
      this.selectedPermissions = []
      this.availablePermissions = []
      this.showPermissionsModal = true
      this.permissionsLoading = true

      try {
        const { permissions, selectedPermissions } = await this.getAvailablePermissions(group.id)
        this.availablePermissions = permissions
        this.selectedPermissions = selectedPermissions
      } catch (error) {
        this.$toast.error(error.message || this.$t('errors.failed_to_load_permissions'))
        this.closePermissionsModal()
      } finally {
        this.permissionsLoading = false
      }
    },

    async savePermissions() {
      if (!this.selectedGroup) return

      this.permissionsSubmitting = true
      try {
        await this.updateGroupPermissions({
          id: this.selectedGroup.id,
          permissions: this.selectedPermissions,
        })
        this.$toast.success(this.$t('groups.messages.permissions_updated'))
        this.closePermissionsModal()
        await this.loadData()
      } catch (error) {
        this.$toast.error(error.message || this.$t('errors.failed_to_update_permissions'))
      } finally {
        this.permissionsSubmitting = false
      }
    },

    closePermissionsModal() {
      this.showPermissionsModal = false
      this.selectedGroup = null
      this.selectedPermissions = []
      this.availablePermissions = []
    },
  },
}
</script>

<style scoped>
/* استيراد أنماط التصميم الموحدة من InvoiceReportSection */
.stats-card {
  @apply rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300;
}
.stats-icon {
  @apply p-3 rounded-lg w-fit mb-3;
}
.stats-label {
  @apply text-sm font-medium text-gray-500 dark:text-gray-400 mb-1;
}
.stats-value {
  @apply text-2xl font-bold text-gray-900 dark:text-white;
}
.table-header {
  @apply px-6 py-4 text-start text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider;
}
.table-cell {
  @apply px-6 py-4;
}
.status-badge {
  @apply px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1;
}
.status-dot {
  @apply w-2 h-2 rounded-full;
}
/* باقي الأنماط من النسخة السابقة */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
table {
  border-collapse: separate;
  border-spacing: 0;
}
th {
  font-weight: 600;
  letter-spacing: 0.025em;
}
td {
  border-bottom: 1px solid #f3f4f6;
}
.dark td {
  border-bottom-color: #374151;
}
tr:last-child td {
  border-bottom: none;
}
tr:hover {
  background-color: rgba(59, 130, 246, 0.05);
}
.dark tr:hover {
  background-color: rgba(59, 130, 246, 0.1);
}
button {
  transition: all 0.15s ease-in-out;
}
button:active {
  transform: translateY(0);
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}
input:focus,
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.dark input:focus,
.dark select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}
@media (max-width: 640px) {
  .container-padding {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .mobile-stack {
    flex-direction: column;
    gap: 0.75rem;
  }
}
.form-input {
  transition: all 0.2s ease;
}
.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.dark .form-input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}
.icon-button {
  transition: all 0.15s ease;
}
.icon-button:hover {
  transform: scale(1.05);
}
.padding-consistent {
  padding: 1rem 1.5rem;
}
.heading-large {
  font-size: 1.875rem;
  line-height: 2.25rem;
}
.heading-medium {
  font-size: 1.25rem;
  line-height: 1.75rem;
}
.heading-small {
  font-size: 1.125rem;
  line-height: 1.75rem;
}
.text-body {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.text-small {
  font-size: 0.75rem;
  line-height: 1rem;
}
.card-shadow {
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
.dark .card-shadow {
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.3),
    0 1px 2px 0 rgba(0, 0, 0, 0.2);
}
.card-shadow-lg {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
.dark .card-shadow-lg {
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.3),
    0 4px 6px -2px rgba(0, 0, 0, 0.2);
}
.text-primary {
  color: #1f2937;
}
.dark .text-primary {
  color: #f9fafb;
}
.text-secondary {
  color: #6b7280;
}
.dark .text-secondary {
  color: #9ca3af;
}
.text-accent {
  color: #3b82f6;
}
.bg-primary {
  background-color: #ffffff;
}
.dark .bg-primary {
  background-color: #111827;
}
.bg-secondary {
  background-color: #f9fafb;
}
.dark .bg-secondary {
  background-color: #1f2937;
}
.bg-accent {
  background-color: #3b82f6;
}
.border-light {
  border-color: #e5e7eb;
}
.dark .border-light {
  border-color: #374151;
}
.border-medium {
  border-color: #d1d5db;
}
.dark .border-medium {
  border-color: #4b5563;
}
.rounded-sm {
  border-radius: 0.25rem;
}
.rounded-md {
  border-radius: 0.375rem;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.rounded-xl {
  border-radius: 0.75rem;
}
.rounded-2xl {
  border-radius: 1rem;
}

/* تحسينات إضافية للوضع الداكن */
.dark ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.dark ::-webkit-scrollbar-track {
  background: #1f2937;
}
.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}
.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
