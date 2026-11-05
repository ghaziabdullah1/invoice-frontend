<template>
  <div class="min-h-screen py-6 md:py-8 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div
                class="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg shadow-purple-200/50 dark:shadow-purple-900/30 border border-purple-100 dark:border-purple-800"
              >
                <svg
                  class="w-7 h-7 text-white"
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
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {{ $t('assign_permissions.title') }}
                </h1>
                <p class="text-gray-600 dark:text-gray-400 text-sm mt-1 flex items-center gap-2">
                  <span class="w-1 h-1 bg-purple-400 rounded-full"></span>
                  {{ $t('assign_permissions.subtitle') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <!-- Total Groups -->
        <div
          class="stats-card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-700"
        >
          <div class="stats-icon bg-blue-100 dark:bg-blue-900/30">
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
            <p class="stats-label text-gray-500 dark:text-gray-400">{{ $t('nav.groups') }}</p>
            <p class="stats-value text-gray-900 dark:text-white">{{ adminGroups.length }}</p>
          </div>
        </div>

        <!-- Total Permissions -->
        <div
          class="stats-card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-700"
        >
          <div class="stats-icon bg-purple-100 dark:bg-purple-900/30">
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <p class="stats-label text-gray-500 dark:text-gray-400">{{ $t('permissions.list') }}</p>
            <p class="stats-value text-gray-900 dark:text-white">{{ permissions.length }}</p>
          </div>
        </div>

        <!-- Selected Permissions (if group selected) -->
        <div
          class="stats-card bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-700"
        >
          <div class="stats-icon bg-green-100 dark:bg-green-900/30">
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
            <p class="stats-label text-gray-500 dark:text-gray-400">
              {{ $t('assign_permissions.selected') }}
            </p>
            <p class="stats-value text-gray-900 dark:text-white">
              {{ selectedPermissionIds.length }}
            </p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="mb-8">
        <div
          class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-gray-700 shadow-lg p-12"
        >
          <div class="text-center space-y-4">
            <div class="relative inline-block">
              <div
                class="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 rounded-full"
              ></div>
              <div
                class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"
              ></div>
            </div>
            <div>
              <p class="text-lg font-semibold text-gray-800 dark:text-white">
                {{ $t('common.loading') }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {{ $t('assign_permissions.loading_subtitle') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="mb-8">
        <div
          class="bg-gradient-to-r from-red-50/80 to-red-100/50 dark:from-red-900/20 dark:to-red-800/20 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 rounded-2xl p-6 shadow-lg"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="mr-4 flex-1">
              <h3 class="text-lg font-semibold text-red-800 dark:text-red-400">
                {{ $t('errors.load_failed') }}
              </h3>
              <p class="text-red-700 dark:text-red-400 mt-2">{{ error }}</p>
            </div>
            <button
              @click="loadData"
              class="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Groups List Card -->
        <div
          class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-gray-700 shadow-xl shadow-blue-100/20 dark:shadow-black/20 overflow-hidden"
        >
          <div
            class="px-6 py-5 border-b border-gray-200/50 dark:border-gray-700 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-gray-700/80 dark:to-gray-800/80"
          >
            <div class="flex items-center gap-2">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
                {{ $t('nav.groups') }}
              </h2>
            </div>
          </div>

          <div class="p-6">
            <div class="space-y-3">
              <div
                v-for="group in adminGroups"
                :key="group.id"
                @click="selectGroup(group)"
                :class="[
                  'p-4 border rounded-xl cursor-pointer transition-all duration-200 group hover:-translate-y-0.5',
                  selectedGroup?.id === group.id
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50/80 to-blue-100/30 dark:from-blue-900/20 dark:to-blue-800/20 transform scale-[1.02] shadow-lg shadow-blue-100/30 dark:shadow-blue-900/20'
                    : 'border-gray-200/50 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-gray-100/30 dark:hover:from-gray-700/50 dark:hover:to-gray-600/30',
                ]"
              >
                <div class="flex items-center">
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center ml-3 shadow-md group-hover:scale-105 transition-transform duration-200 mr-4"
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
                  <div class="mr-3 flex-1">
                    <h3
                      dir="auto"
                      class="font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 text-start"
                    >
                      {{ $i18n.locale === 'ar' ? group.title_ar : group.title_en }}
                    </h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 text-start" dir="auto">
                      {{ $i18n.locale === 'ar' ? group.title_en : group.title_ar }}
                    </p>
                  </div>
                </div>
                <div class="mt-4 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span
                      class="px-2.5 py-1 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full inline-flex items-center gap-1 border border-blue-200/50 dark:border-blue-700/50"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      {{ group.permissions_count || 0 }} {{ $t('permissions.permission') }}
                    </span>
                    <span
                      class="px-2.5 py-1 bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full inline-flex items-center gap-1 border border-green-200/50 dark:border-green-700/50"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      {{ group.users_count || 0 }} {{ $t('common.user') }}
                    </span>
                  </div>
                  <div
                    v-if="selectedGroup?.id === group.id"
                    class="w-2 h-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full animate-pulse"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Permissions Card -->
        <div class="lg:col-span-2">
          <div
            class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-gray-700 shadow-xl shadow-purple-100/20 dark:shadow-black/20 overflow-hidden"
          >
            <div
              class="px-6 py-5 border-b border-gray-200/50 dark:border-gray-700 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 dark:from-gray-700/80 dark:to-gray-800/80"
            >
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2">
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
                    <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
                      {{ $t('permissions.list') }}
                      <span v-if="selectedGroup" class="text-purple-600 dark:text-purple-400">
                        - {{ $i18n.locale === 'ar' ? selectedGroup.title_ar : selectedGroup.title_en }}
                      </span>
                    </h2>
                  </div>
                  <p v-if="selectedGroup" class="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {{
                      $t('permissions.manage_for', {
                        group: $i18n.locale === 'ar' ? selectedGroup.title_ar : selectedGroup.title_en,
                      })
                    }}
                  </p>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button
                    @click="selectAllPermissions"
                    class="px-5 py-2.5 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-gradient-to-r hover:from-blue-200 hover:to-blue-100 dark:hover:from-blue-800/40 dark:hover:to-blue-700/30 transition-all duration-200 flex items-center gap-2 text-sm font-semibold transform hover:-translate-y-0.5 border border-blue-200/50 dark:border-blue-700/50"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {{ $t('buttons.select_all') }}
                  </button>
                  <button
                    @click="deselectAllPermissions"
                    class="px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600/50 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-500/50 transition-all duration-200 flex items-center gap-2 text-sm font-semibold transform hover:-translate-y-0.5 border border-gray-200/50 dark:border-gray-600/50"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    {{ $t('buttons.deselect_all') }}
                  </button>
                </div>
              </div>
            </div>

            <div class="p-6">
              <!-- No Group Selected -->
              <div v-if="!selectedGroup" class="text-center py-12">
                <div class="max-w-md mx-auto">
                  <div class="relative mb-6">
                    <div
                      class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg"
                    >
                      <svg
                        class="w-12 h-12 text-gray-400 dark:text-gray-500"
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
                  </div>
                  <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {{ $t('assign_permissions.select_group_first') }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 mb-8">
                    {{ $t('assign_permissions.select_group_message') }}
                  </p>
                </div>
              </div>

              <div v-else>
                <!-- Search -->
                <div class="relative mb-6">
                  <input
                    type="text"
                    v-model="searchQuery"
                    :placeholder="$t('common.search_permissions')"
                    class="w-full px-4 py-3 pr-11 bg-white/80 dark:bg-gray-700/80 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                  />
                  <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      class="w-5 h-5 text-gray-400 dark:text-gray-500"
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
                  </div>
                  <button
                    v-if="searchQuery"
                    @click="searchQuery = ''"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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

                <!-- Filter Chips -->
                <div class="flex items-center gap-2 flex-wrap mb-4">
                  <button
                    @click="filterMode = 'all'"
                    :class="[
                      'px-4 py-1.5 rounded-full text-sm font-semibold transition-all',
                      filterMode === 'all'
                        ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600',
                    ]"
                  >
                    {{ $t('common.all') }} · {{ permissions.length }}
                  </button>
                  <button
                    @click="filterMode = 'assigned'"
                    :class="[
                      'px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5',
                      filterMode === 'assigned'
                        ? 'bg-green-600 text-white shadow-sm shadow-green-500/30'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600',
                    ]"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    {{ $t('assign_permissions.selected') }} · {{ selectedPermissionIds.length }}
                  </button>
                  <button
                    @click="filterMode = 'unassigned'"
                    :class="[
                      'px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5',
                      filterMode === 'unassigned'
                        ? 'bg-gray-700 text-white shadow-sm shadow-gray-500/30'
                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400',
                    ]"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {{ $i18n.locale === 'ar' ? 'غير الممنوحة' : 'Unassigned' }} · {{ permissions.length - selectedPermissionIds.length }}
                  </button>
                </div>

                <!-- Permissions Loading -->
                <div v-if="permissionsLoading" class="text-center py-12">
                  <div class="relative inline-block">
                    <div
                      class="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 rounded-full"
                    ></div>
                    <div
                      class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"
                    ></div>
                  </div>
                  <p class="text-lg font-semibold text-gray-800 dark:text-white mt-4">
                    {{ $t('common.loading') }}
                  </p>
                </div>

                <!-- Permissions List -->
                <div v-else>
                  <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      class="bg-gradient-to-br from-blue-50 to-blue-100/30 dark:from-gray-700 dark:to-gray-600/50 rounded-xl border border-blue-200/50 dark:border-gray-600/50 p-5"
                    >
                      <div class="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {{ selectedPermissionIds.length }}
                      </div>
                      <div class="text-sm text-blue-800 dark:text-blue-300 font-medium">
                        {{ $t('assign_permissions.selected') }}
                      </div>
                    </div>
                    <div
                      class="bg-gradient-to-br from-gray-50 to-gray-100/30 dark:from-gray-700 dark:to-gray-600/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50 p-5"
                    >
                      <div class="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-1">
                        {{ filteredPermissions.length }}
                      </div>
                      <div class="text-sm text-gray-800 dark:text-gray-300 font-medium">
                        {{ $t('assign_permissions.filtered') }}
                      </div>
                    </div>
                    <div
                      class="bg-gradient-to-br from-purple-50 to-purple-100/30 dark:from-gray-700 dark:to-gray-600/50 rounded-xl border border-purple-200/50 dark:border-gray-600/50 p-5"
                    >
                      <div class="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                        {{ permissions.length }}
                      </div>
                      <div class="text-sm text-purple-800 dark:text-purple-300 font-medium">
                        {{ $t('assign_permissions.total') }}
                      </div>
                    </div>
                  </div>

                  <div
                    class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto p-1"
                  >
                    <div
                      v-for="permission in filteredPermissions"
                      :key="permission.id"
                      :class="[
                        'bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-700 dark:to-gray-800/50 rounded-xl border p-5 transition-all duration-200 cursor-pointer hover:-translate-y-0.5',
                        selectedPermissionIds.includes(permission.id)
                          ? 'border-blue-400 dark:border-blue-500 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-900/20 dark:to-blue-800/20 shadow-lg shadow-blue-100/30 dark:shadow-blue-900/20'
                          : 'border-gray-200/50 dark:border-gray-600/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg hover:shadow-blue-100/20 dark:hover:shadow-blue-900/10',
                      ]"
                    >
                      <div class="flex items-start">
                        <input
                          type="checkbox"
                          :id="`perm-${permission.id}`"
                          :value="permission.id"
                          v-model="selectedPermissionIds"
                          class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded ml-3 mr-3 mt-0.5"
                        />
                        <label :for="`perm-${permission.id}`" class="flex-1 cursor-pointer">
                          <div class="flex justify-between items-start">
                            <div class="mr-3 flex-1">
                              <h4 class="font-semibold text-gray-900 dark:text-white mb-1 text-start" dir="auto">
                                {{ $i18n.locale === 'ar' 
                                  ? (permission.description_ar || permission.title) 
                                  : (permission.description_en || permission.title) }}
                              </h4>
                              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 text-start" dir="auto">
                                {{ $i18n.locale === 'ar' 
                                  ? (permission.description_en || '') 
                                  : (permission.description_ar || '') }}
                              </p>
                              <p class="text-xs text-gray-400 dark:text-gray-500 font-mono mb-3 text-left" dir="ltr">
                                {{ permission.title }}
                              </p>
                              <span
                                :class="[
                                  'status-badge',
                                  permission.is_parent
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
                                ]"
                              >
                                <span
                                  :class="[
                                    'status-dot',
                                    permission.is_parent ? 'bg-green-500' : 'bg-blue-500',
                                  ]"
                                ></span>
                                {{
                                  permission.is_parent
                                    ? $t('permissions.parent')
                                    : $t('permissions.child')
                                }}
                              </span>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <!-- No Results -->
                  <div v-if="filteredPermissions.length === 0" class="text-center py-12">
                    <div class="max-w-md mx-auto">
                      <div class="relative mb-6">
                        <div
                          class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg"
                        >
                          <svg
                            class="w-12 h-12 text-gray-400 dark:text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="1.5"
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                        </div>
                      </div>
                      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {{ $t('common.no_results') }}
                      </h3>
                      <p class="text-gray-600 dark:text-gray-400 mb-8">
                        {{ filterMode === 'assigned'
                          ? ($i18n.locale === 'ar' ? 'لم يتم منح أي صلاحية لهذه المجموعة بعد' : 'No permissions assigned to this group yet')
                          : filterMode === 'unassigned'
                            ? ($i18n.locale === 'ar' ? 'جميع الصلاحيات ممنوحة لهذه المجموعة' : 'All permissions are assigned to this group')
                            : $t('assign_permissions.no_results_message') }}
                      </p>
                      <button
                        @click="searchQuery = ''"
                        class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto transform hover:-translate-y-0.5"
                      >
                        {{ $t('assign_permissions.clear_search') }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Stats and Actions -->
                <div class="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700">
                  <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                      <!--{{
                        $t('permissions.selected_count', {
                          selected: selectedPermissionIds.length,
                          total: permissions.length,
                        })
                      }}-->
                    </div>
                    <div class="flex gap-3">
                      <button
                        @click="resetSelection"
                        :disabled="saving"
                        class="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-600/50 hover:from-gray-200 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-500/50 text-gray-700 dark:text-gray-300 rounded-xl hover:shadow transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 border border-gray-200/50 dark:border-gray-600/50"
                      >
                        {{ $t('common.cancel') }}
                      </button>
                      <button
                        @click="savePermissions"
                        :disabled="saving"
                        class="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <svg
                          v-if="saving"
                          class="w-5 h-5 animate-spin"
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
                        <svg
                          v-else
                          class="w-5 h-5"
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
                        <span class="font-semibold">
                          {{ saving ? $t('common.saving') : $t('buttons.save') }}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AssignPermissions',

  data() {
    return {
      searchQuery: '',
      saving: false,
      permissionsLoading: false,
      selectedGroup: null,
      selectedPermissionIds: [],
      permissions: [],
      filterMode: 'all',
    }
  },

  computed: {
    ...mapState('adminGroups', {
      adminGroups: (state) => state.adminGroups || [],
      loading: (state) => state.isLoading,
      error: (state) => state.error,
    }),

    ...mapState('permissions', {
      allPermissions: (state) => state.permissions || [],
    }),

    filteredPermissions() {
      let result = this.permissions

      if (this.searchQuery.trim()) {
        const search = this.searchQuery.toLowerCase()
        result = result.filter(
          (permission) =>
            (permission.title && permission.title.toLowerCase().includes(search)) ||
            (permission.description_ar && permission.description_ar.toLowerCase().includes(search)) ||
            (permission.description_en && permission.description_en.toLowerCase().includes(search)),
        )
      }

      if (this.filterMode === 'assigned') {
        result = result.filter((p) => this.selectedPermissionIds.includes(p.id))
      } else if (this.filterMode === 'unassigned') {
        result = result.filter((p) => !this.selectedPermissionIds.includes(p.id))
      }

      return result
    },
  },

  async mounted() {
    await this.loadData()
  },

  methods: {
    ...mapActions('adminGroups', ['getAdminGroups', 'updateGroupPermissions']),

    ...mapActions('permissions', ['fetchPermissions']),

    async loadData() {
      try {
        await Promise.all([this.getAdminGroups(), this.fetchPermissions({ per_page: 100 })])
        this.permissions = this.allPermissions
      } catch (error) {
        console.error('❌ خطأ في تحميل البيانات:', error)
        this.$toast.error(this.$t('errors.load_failed'), {
          icon: '❌',
          position: 'top-right',
        })
      }
    },

    async selectGroup(group) {
      this.selectedGroup = group
      this.selectedPermissionIds = []
      this.permissionsLoading = true

      try {
        // تحميل صلاحيات المجموعة المحددة
        if (group.permissions && Array.isArray(group.permissions)) {
          this.selectedPermissionIds = group.permissions.map((p) => p.id)
        } else {
          this.selectedPermissionIds = []
        }
      } catch (error) {
        console.error('❌ خطأ في تحميل صلاحيات المجموعة:', error)
        this.$toast.error(this.$t('errors.load_failed'), {
          icon: '❌',
          position: 'top-right',
        })
      } finally {
        this.permissionsLoading = false
      }
    },

    selectAllPermissions() {
      this.selectedPermissionIds = this.permissions.map((p) => p.id)
    },

    deselectAllPermissions() {
      this.selectedPermissionIds = []
    },

    resetSelection() {
      this.selectedGroup = null
      this.selectedPermissionIds = []
      this.searchQuery = ''
    },

    async savePermissions() {
      if (!this.selectedGroup) {
        this.$toast.warning(this.$t('assign_permissions.select_group_first'), {
          icon: '⚠️',
          position: 'top-right',
        })
        return
      }

      this.saving = true
      try {
        await this.updateGroupPermissions({
          id: this.selectedGroup.id,
          permissions: this.selectedPermissionIds,
        })

        this.$toast.success(this.$t('assign_permissions.messages.update_success'), {
          icon: '✅',
          position: 'top-right',
        })

        // تحديث بيانات المجموعات
        await this.getAdminGroups()

        // إعادة تحديد المجموعة الحالية
        const updatedGroup = this.adminGroups.find((g) => g.id === this.selectedGroup.id)
        if (updatedGroup) {
          this.selectedGroup = updatedGroup
        }
      } catch (error) {
        console.error('❌ خطأ في حفظ الصلاحيات:', error)
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          this.$t('assign_permissions.messages.update_error')
        this.$toast.error(errorMsg, {
          icon: '❌',
          position: 'top-right',
        })
      } finally {
        this.saving = false
      }
    },
  },

  watch: {
    searchQuery() {
      // البحث الفوري
    },
  },
}
</script>

<style scoped>
/* استيراد أنماط التصميم الموحدة من InvoiceReportSection */
.stats-card {
  @apply rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300;
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
.status-badge {
  @apply px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1;
}
.status-dot {
  @apply w-2 h-2 rounded-full;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* تأثيرات hover محسنة */
button {
  transition: all 0.2s ease-in-out;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

/* تأثيرات الـ loading */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* تحسينات الاستجابة */
@media (max-width: 640px) {
  .table-responsive {
    margin: 0 -1rem;
    width: calc(100% + 2rem);
  }

  .mobile-stack {
    flex-direction: column;
    gap: 1rem;
  }
}

/* تحسينات شريط التمرير */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
