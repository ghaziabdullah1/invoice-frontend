<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 md:py-8 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div
                class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl shadow-lg shadow-blue-200/50 dark:shadow-blue-900/30 border border-blue-100 dark:border-blue-800"
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
                  {{ $t('permissions.title') }}
                </h1>
                <p class="text-gray-600 dark:text-gray-400 text-sm mt-1 flex items-center gap-2">
                  <span class="w-1 h-1 bg-blue-400 rounded-full"></span>
                  {{ $t('permissions.subtitle') }}
                </p>
              </div>
            </div>
          </div>
          <div class="flex gap-3">
            <button
              @click="openCreateModal"
              class="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group transform hover:-translate-y-0.5"
            >
              <svg
                class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span class="font-semibold">{{ $t('permissions.add_permission') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div class="stats-card bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 dark:border-blue-800">
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <p class="stats-label dark:text-gray-300">{{ $t('permissions.total_permissions') }}</p>
            <p class="stats-value dark:text-white">{{ pagination.total || 0 }}</p>
          </div>
        </div>
        <div class="stats-card bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 dark:border-green-800">
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div>
            <p class="stats-label dark:text-gray-300">{{ $t('permissions.parent_permissions') }}</p>
            <p class="stats-value dark:text-white">{{ parentPermissionsCount }}</p>
          </div>
        </div>
        <div class="stats-card bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 dark:border-purple-800">
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
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
          <div>
            <p class="stats-label dark:text-gray-300">{{ $t('permissions.child_permissions') }}</p>
            <p class="stats-value dark:text-white">{{ childPermissionsCount }}</p>
          </div>
        </div>
      </div>

      <!-- Search Card -->
      <div
        class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-blue-100/30 dark:shadow-black/20 p-6 mb-8 transition-colors duration-300"
      >
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div
              class="p-2 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50"
            >
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-800 dark:text-white">{{ $t('common.search') }}</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('permissions.search_subtitle') }}</p>
            </div>
          </div>
          <div class="flex-1 max-w-lg">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                :placeholder="$t('permissions.search_placeholder')"
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
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-gray-300 transition-colors"
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
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="mb-8">
        <div class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-12 transition-colors duration-300">
          <div class="text-center space-y-4">
            <div class="relative inline-block">
              <div class="w-16 h-16 border-4 border-blue-100 dark:border-blue-900 rounded-full"></div>
              <div
                class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"
              ></div>
            </div>
            <div>
              <p class="text-lg font-semibold text-gray-800 dark:text-gray-200">{{ $t('common.loading') }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">{{ $t('permissions.loading_subtitle') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="mb-8">
        <div
          class="bg-gradient-to-r from-red-50/80 to-red-100/50 dark:from-red-900/20 dark:to-red-800/20 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 rounded-2xl p-6 shadow-lg transition-colors duration-300"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
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
              <h3 class="text-lg font-semibold text-red-800 dark:text-red-300">{{ $t('errors.load_failed') }}</h3>
              <p class="text-red-700 dark:text-red-400 mt-2">{{ error }}</p>
            </div>
            <button
              @click="clearError"
              class="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
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
      </div>

      <!-- Permissions Table -->
      <div v-else>
        <div
          class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl shadow-blue-100/20 dark:shadow-black/20 overflow-hidden transition-colors duration-300"
        >
          <div
            class="px-6 py-5 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-white dark:from-blue-900/20 dark:to-gray-800 transition-colors duration-300"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                    {{ $t('permissions.permission_list') }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ $t('permissions.list_subtitle') }}</p>
                </div>
              </div>
              <!-- عرض عدد الصلاحيات -->
              <div
                class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-sm"
              >
                <span class="font-bold">{{ pagination.total || 0 }}</span>
                <span class="text-blue-100 mr-1">{{ $t('common.total') }}</span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="permissions.length === 0" class="text-center py-16 px-4">
            <div class="max-w-md mx-auto">
              <div class="relative mb-6">
                <div
                  class="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-3xl mx-auto flex items-center justify-center shadow-lg"
                >
                  <svg
                    class="w-12 h-12 text-blue-400 dark:text-blue-500"
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
                {{ $t('permissions.no_permissions') }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-8">{{ $t('permissions.start_creating_message') }}</p>
              <button
                @click="openCreateModal"
                class="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto transform hover:-translate-y-0.5"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {{ $t('permissions.create_first') }}
              </button>
            </div>
          </div>

          <!-- Filter Chips -->
          <div v-if="permissions.length > 0" class="px-6 py-3 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center gap-2 flex-wrap bg-gray-50/50 dark:bg-gray-900/20">
            <button
              @click="filterMode = 'all'"
              :class="[
                'px-4 py-1.5 rounded-full text-sm font-semibold transition-all',
                filterMode === 'all'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600',
              ]"
            >
              {{ $t('common.all') }} · {{ permissions.length }}
            </button>
            <button
              @click="filterMode = 'parents'"
              :class="[
                'px-4 py-1.5 rounded-full text-sm font-semibold transition-all',
                filterMode === 'parents'
                  ? 'bg-green-600 text-white shadow-sm shadow-green-500/30'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600',
              ]"
            >
              {{ $t('permissions.parent') }} · {{ parentPermissionsCount }}
            </button>
            <button
              @click="filterMode = 'children'"
              :class="[
                'px-4 py-1.5 rounded-full text-sm font-semibold transition-all',
                filterMode === 'children'
                  ? 'bg-blue-500 text-white shadow-sm shadow-blue-400/30'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600',
              ]"
            >
              {{ $t('permissions.child') }} · {{ childPermissionsCount }}
            </button>
          </div>

          <!-- Table Content -->
          <div v-if="permissions.length > 0" class="overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
                <thead>
                  <tr class="bg-gradient-to-r from-gray-50 to-gray-100/30 dark:from-gray-900/50 dark:to-gray-800/30 transition-colors duration-300">
                    <th class="table-header text-start dark:text-gray-300">{{ $t('permissions.permission_name') }}</th>
                    <th class="table-header text-start dark:text-gray-300">{{ $t('permissions.description') }}</th>
                    <th class="table-header text-center dark:text-gray-300">{{ $t('permissions.type') }}</th>
                    <th class="table-header text-center dark:text-gray-300">{{ $t('common.actions') }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200/30 dark:divide-gray-700/30 bg-white dark:bg-gray-800 transition-colors duration-300">
                  <tr
                    v-for="permission in displayedPermissions"
                    :key="'perm-' + permission.id"
                    class="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors"
                  >
                    <td class="table-cell">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 ml-4">
                          <div
                            class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl flex items-center justify-center shadow-md mr-4"
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
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div class="mr-4">
                          <div class="text-base font-bold text-gray-900 dark:text-white text-left" dir="ltr">
                            {{ permission.title }}
                          </div>
                          <div class="flex items-center gap-2 mt-1 text-left" dir="ltr">
                            <span class="text-xs text-gray-500 dark:text-gray-400">ID: {{ permission.id }}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td class="table-cell">
                      <div class="flex flex-col">
                        <span class="text-sm text-gray-900 dark:text-gray-100 font-medium text-start inline-block w-full" dir="auto">{{
                          $i18n.locale === 'ar'
                            ? (permission.description_ar || $t('common.notAvailable'))
                            : (permission.description_en || $t('common.notAvailable'))
                        }}</span>
                      </div>
                    </td>

                    <td class="table-cell text-center">
                      <span
                        :class="[
                          'status-badge',
                          permission.is_parent
                            ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300'
                            : 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
                        ]"
                      >
                        <span
                          :class="[
                            'status-dot',
                            permission.is_parent ? 'bg-green-500' : 'bg-blue-500',
                          ]"
                        ></span>
                        {{
                          permission.is_parent ? $t('permissions.parent') : $t('permissions.child')
                        }}
                      </span>
                    </td>

                    <td class="table-cell text-center">
                      <div class="flex items-center justify-center gap-2">
                        <button
                          @click="openEditModal(permission)"
                          class="p-2.5 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-all duration-200 transform hover:scale-110"
                          :title="$t('buttons.edit')"
                        >
                          <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          @click="confirmDelete(permission)"
                          class="ui-icon-btn"
                          :title="$t('buttons.delete')"
                        >
                          <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
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
            <div v-if="displayedPermissions.length === 0" class="text-center py-12 px-4">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('common.no_results') }}</p>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="hasPagination"
          class="mt-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-4 transition-colors duration-300"
        >
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              {{
                $t('pagination.showing', {
                  from: pagination.from || 1,
                  to: pagination.to || pagination.total,
                  total: pagination.total,
                })
              }}
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="previousPage"
                :disabled="pagination.current_page === 1"
                class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-gray-700 dark:text-gray-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span class="hidden sm:inline">{{ $t('pagination.previous') }}</span>
              </button>

              <div class="flex items-center gap-1">
                <button
                  v-for="page in paginationRange"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200',
                    page === pagination.current_page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200',
                    page === '...' ? 'cursor-default hover:bg-transparent dark:hover:bg-transparent' : '',
                  ]"
                  :disabled="page === '...'"
                >
                  {{ page }}
                </button>
              </div>

              <button
                @click="nextPage"
                :disabled="pagination.current_page === pagination.last_page"
                class="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-gray-700 dark:text-gray-200"
              >
                <span class="hidden sm:inline">{{ $t('pagination.next') }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Permission Form Modal -->
    <PermissionForm
      :show="showModal"
      :permission="editingPermission"
      :menus="menus"
      :parent-permissions="parentPermissions"
      @close="closeModal"
      @saved="refreshPermissions"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import PermissionForm from './PermissionForm.vue'

export default {
  name: 'AdminPermissions',
  components: { PermissionForm },
  data() {
    return {
      searchQuery: '',
      showModal: false,
      editingPermission: null,
      searchTimeout: null,
      filterMode: 'all',
    }
  },

  computed: {
    ...mapState('permissions', {
      permissions: (state) => state.permissions || [],
      menus: (state) => state.menus || [],
      parentPermissions: (state) => state.parentPermissions || [],
      loading: (state) => state.isLoading,
      error: (state) => state.error,
      pagination: (state) => {
        // تأكد من وجود كائن pagination بخصائص افتراضية
        const defaultPagination = {
          current_page: 1,
          last_page: 1,
          total: 0,
          per_page: 15,
          from: 1,
          to: 15,
        }
        return state.pagination ? { ...defaultPagination, ...state.pagination } : defaultPagination
      },
    }),

    parentPermissionsCount() {
      return this.permissions.filter((p) => p.is_parent).length
    },

    childPermissionsCount() {
      return this.permissions.filter((p) => !p.is_parent).length
    },

    displayedPermissions() {
      if (this.filterMode === 'parents') {
        return this.permissions.filter((p) => p.is_parent)
      }
      if (this.filterMode === 'children') {
        return this.permissions.filter((p) => !p.is_parent)
      }
      return this.permissions
    },

    hasPagination() {
      return this.pagination && this.pagination.total > this.pagination.per_page
    },

    paginationRange() {
      const current = this.pagination.current_page
      const last = this.pagination.last_page
      const delta = 2
      const range = []
      const rangeWithDots = []
      let l

      for (let i = 1; i <= last; i++) {
        if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
          range.push(i)
        }
      }

      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1)
          } else if (i - l !== 1) {
            rangeWithDots.push('...')
          }
        }
        rangeWithDots.push(i)
        l = i
      }

      return rangeWithDots
    },
  },

  methods: {
    ...mapActions('permissions', [
      'fetchPermissions',
      'deletePermission',
      'fetchMenus',
      'fetchParentPermissions',
      'clearError',
    ]),

    async loadPermissions(page = 1) {
      try {
        console.log(`🔍 Loading permissions - page: ${page}, search: "${this.searchQuery}"`)
        await this.fetchPermissions({ page, search: this.searchQuery })
        console.log('✅ Permissions loaded. Current page:', this.pagination.current_page)
      } catch (error) {
        console.error('❌ Failed to load permissions:', error)
        this.$toast?.error?.(this.$t('errors.failed_to_load_permissions'))
      }
    },

    async refreshPermissions() {
      await this.loadPermissions(1)
    },

    goToPage(page) {
      if (page === '...' || page === this.pagination.current_page) return
      console.log('➡️ Going to page:', page)
      this.loadPermissions(page)
    },

    previousPage() {
      if (this.pagination.current_page > 1) {
        this.loadPermissions(this.pagination.current_page - 1)
      }
    },

    nextPage() {
      if (this.pagination.current_page < this.pagination.last_page) {
        this.loadPermissions(this.pagination.current_page + 1)
      }
    },

    openCreateModal() {
      this.editingPermission = null
      this.showModal = true
    },

    openEditModal(permission) {
      this.editingPermission = permission
      this.showModal = true
    },

    async handleDelete(id) {
      try {
        await this.deletePermission(id)
        this.$swal?.fire({
          icon: 'success',
          title: this.$t('permissions.messages.delete_success'),
          showConfirmButton: false,
          timer: 1500,
        })
        await this.loadPermissions(this.pagination.current_page)
      } catch (error) {
        console.error('❌ Error deleting permission:', error)
        this.$swal?.fire({
          icon: 'error',
          title: this.$t('errors.failed_to_delete_permission'),
          text: error.message,
        })
      }
    },

    async confirmDelete(permission) {
      const result = await this.$swal?.fire({
        title: this.$t('permissions.delete_confirm_title'),
        text: this.$t('permissions.delete_confirm', {
          name: permission.description_ar || permission.title,
        }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: this.$t('common.delete'),
        cancelButtonText: this.$t('common.cancel'),
        reverseButtons: true,
      })

      if (result?.isConfirmed) {
        await this.handleDelete(permission.id)
      }
    },

    closeModal() {
      this.showModal = false
      this.editingPermission = null
    },
  },

  watch: {
    searchQuery: {
      handler() {
        if (this.searchTimeout) clearTimeout(this.searchTimeout)
        this.searchTimeout = setTimeout(() => {
          this.loadPermissions(1)
        }, 500)
      },
    },
  },

  async mounted() {
    await this.loadPermissions()
    await this.fetchMenus()
    await this.fetchParentPermissions()
  },
}
</script>

<style scoped>
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
</style>
