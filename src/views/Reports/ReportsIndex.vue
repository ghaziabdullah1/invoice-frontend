<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-8">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      <!-- Header -->
      <div class="mb-8">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-white rounded-xl shadow-sm border border-gray-200">
                <svg
                  class="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
                  {{ $t('reports.title') }}
                </h1>
                <p class="text-gray-600 text-sm mt-1">{{ $t('reports.subtitle') }}</p>
              </div>
            </div>
          </div>

          <!-- Export Button -->
          <div class="flex gap-3">
            <button
              v-if="!realtyKey"
              @click="openExportModal"
              class="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group"
            >
              <svg
                class="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span class="font-medium">{{ $t('reports.buttons.export_report') }}</span>
            </button>

            <button
              v-if="!realtyKey"
              @click="toggleExportedFiles"
              class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 group"
            >
              <svg
                class="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span class="font-medium">
                {{
                  showExportedFiles
                    ? $t('reports.buttons.close_exported')
                    : $t('reports.buttons.view_exported')
                }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Exported Files Section -->
      <div
        v-if="showExportedFiles && !realtyKey"
        class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6 animate-fade-in"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <svg
              class="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 class="text-lg font-semibold text-gray-800">{{ $t('reports.exported_files') }}</h3>
            <span
              v-if="exportedFiles.length > 0"
              class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
            >
              {{ exportedFiles.length }}
            </span>
          </div>
          <button @click="toggleExportedFiles" class="text-gray-500 hover:text-gray-700">
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

        <!-- Files List -->
        <div v-if="exportedFiles.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('reports.fileName') }}
                </th>
                <th
                  class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('reports.fileSize') }}
                </th>
                <th
                  class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('reports.modifiedDate') }}
                </th>
                <th
                  class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ $t('common.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="file in exportedFiles"
                :key="file.name"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="p-2 bg-green-50 rounded-lg">
                      <svg
                        class="w-5 h-5 text-green-600"
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
                      <div class="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {{ file.name }}
                      </div>
                      <div class="text-xs text-gray-500 mt-1">{{ formatDate(file.modified) }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-center">
                  <span class="text-sm text-gray-900 font-medium">{{ file.size }}</span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span class="text-sm text-gray-500">{{ formatRelativeTime(file.modified) }}</span>
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <a
                      :href="file.url"
                      target="_blank"
                      class="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      {{ $t('common.download') }}
                    </a>
                    <button
                      @click="confirmDeleteFile(file.name)"
                      class="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      {{ $t('common.delete') }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8">
          <svg
            class="w-12 h-12 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p class="text-gray-500 mb-2">{{ $t('reports.noFiles') }}</p>
          <p class="text-sm text-gray-400">{{ $t('reports.export_first_hint') }}</p>
        </div>

        <!-- Statistics -->
        <div v-if="exportedFiles.length > 0" class="mt-6 pt-6 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-600">
              <!-- {{ $t('reports.total_files') }}:
              <span class="font-semibold">{{ exportedFiles.length }}</span>-->
            </div>
            <button
              @click="refreshExportedFiles"
              class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 flex items-center gap-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {{ $t('reports.refresh_list') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div v-show="!realtyKey" class="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div class="flex items-center gap-2">
            <svg
              class="w-5 h-5 text-gray-500"
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
            <h2 class="text-lg font-semibold text-gray-800">{{ $t('reports.filters') }}</h2>
          </div>

          <div class="flex gap-2">
            <button
              @click="loadReport"
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
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
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
          <!-- Start Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('common.fromDate')
            }}</label>
            <div class="relative">
              <input
                type="date"
                v-model="filters.start_date"
                class="w-full px-3 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg
                class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('common.toDate')
            }}</label>
            <div class="relative">
              <input
                type="date"
                v-model="filters.end_date"
                class="w-full px-3 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg
                class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('reports.invoiceStatus')
            }}</label>
            <div class="relative">
              <select
                v-model="filters.status"
                class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none pr-10"
              >
                <option value="">{{ $t('common.all') }}</option>
                <option value="draft">{{ $t('invoices.status.draft') }}</option>
                <option value="sent">{{ $t('invoices.status.sent') }}</option>
                <option value="paid">{{ $t('invoices.status.paid') }}</option>
                <option value="overdue">{{ $t('invoices.status.overdue') }}</option>
              </select>
              <svg
                class="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
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

          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{
              $t('common.search')
            }}</label>
            <div class="relative">
              <input
                type="text"
                v-model="filters.search"
                @input="onSearch"
                :placeholder="$t('invoices.searchPlaceholder')"
                class="w-full px-3 py-2.5 pr-10 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg
                class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
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
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="flex overflow-x-auto">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="selectTab(tab)"
            :class="{
              'border-b-2 border-blue-500 text-blue-600 bg-blue-50': isTabActive(tab),
              'text-gray-500 hover:text-gray-700 hover:bg-gray-50': !isTabActive(tab),
            }"
            class="flex-1 px-6 py-4 text-sm font-medium text-center whitespace-nowrap transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <!-- Invoice Icon -->
            <svg
              v-if="tab.id === 'invoices'"
              class="w-5 h-5"
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
            <!-- Client Icon -->
            <svg
              v-else-if="tab.id === 'clients'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <!-- Revenue Icon -->
            <svg
              v-else-if="tab.id === 'revenue'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <!-- Overdue Icon -->
            <svg
              v-else-if="tab.id === 'overdue'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <!-- Aging Icon -->
            <svg
              v-else-if="tab.id === 'aging'"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 7h6m-6 4h6m-6 4h4m-9 5h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            {{ tab.label }}
            <span
              v-if="tab.id === 'overdue' && overdueCount > 0"
              class="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700"
            >
              {{ overdueCount }}
            </span>
          </button>
        </div>
      </div>

      <RealtyReportPanel
        v-if="realtyKey"
        :report-key="realtyKey"
        :properties="realtyProperties"
      />

      <!-- Loading State -->
      <div v-if="!realtyKey && loading" class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 mb-6">
        <div class="text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"
          ></div>
          <p class="text-gray-700 font-medium">{{ $t('common.loading') }}</p>
          <p class="text-sm text-gray-500 mt-2">{{ $t('reports.loading_subtitle') }}</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="!realtyKey && error" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <div class="flex items-start">
          <div class="flex-shrink-0 pt-0.5">
            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="mr-3 flex-1">
            <h3 class="text-sm font-medium text-red-800">{{ $t('errors.load_failed') }}</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
          </div>
          <button @click="clearError" class="p-1.5 text-red-700 hover:text-red-900">
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

      <!-- Reports Content -->
      <div v-else-if="!realtyKey">
        <!-- Invoices Report -->
        <div v-if="activeTab === 'invoices'">
          <InvoiceReportSection
            :invoices="reports.invoices.items"
            :stats="reports.invoices.stats"
            :pagination="reports.invoices.pagination"
            @page-change="handlePageChange"
          />
        </div>

        <!-- Clients Report -->
        <div v-if="activeTab === 'clients'">
          <ClientReportSection
            :clients="reports.clients.items"
            :stats="reports.clients.stats"
            :pagination="reports.clients.pagination"
            @page-change="handlePageChange"
          />
        </div>

        <!-- Revenue Report -->
        <div v-if="activeTab === 'revenue'">
          <RevenueReportSection
            :revenue="reports.revenue.items"
            :stats="reports.revenue.stats"
            :pagination="reports.revenue.pagination"
            @page-change="handlePageChange"
          />
        </div>

        <!-- Overdue Report -->
        <div v-if="activeTab === 'overdue'">
          <OverdueReportSection
            :invoices="reports.overdue.items"
            :stats="reports.overdue.stats"
            :pagination="reports.overdue.pagination"
            @send-reminder="handleSendReminder"
            @mark-paid="handleMarkAsPaid"
            @page-change="handlePageChange"
          />
        </div>

        <!-- Aging Report -->
        <div v-if="activeTab === 'aging'">
          <AgingReportSection
            :clients="reports.aging.items"
            :stats="reports.aging.stats"
          />
        </div>
      </div>
    </div>

    <!-- Export Options Modal -->
    <ExportModal
      v-if="showExportModal"
      :active-tab="activeTab"
      :loading="exportLoading"
      @close="closeExportModal"
      @export-direct="handleDirectExport"
      @export-server="handleServerExport"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import InvoiceReportSection from '@/components/reports/InvoiceReportSection.vue'
import ClientReportSection from '@/components/reports/ClientReportSection.vue'
import RevenueReportSection from '@/components/reports/RevenueReportSection.vue'
import OverdueReportSection from '@/components/reports/OverdueReportSection.vue'
import AgingReportSection from '@/components/reports/AgingReportSection.vue'
import ExportModal from '@/components/reports/ExportModal.vue'
import RealtyReportPanel from '@/components/reports/RealtyReportPanel.vue'
import axios from '@/api/axios'

export default {
  name: 'ReportsIndex',
  components: {
    RealtyReportPanel,
    InvoiceReportSection,
    ClientReportSection,
    RevenueReportSection,
    OverdueReportSection,
    AgingReportSection,
    ExportModal,
  },

  data() {
    return {
      realtyKeys: [],
      realtyProperties: [],
      realtyKey: null,
    }
  },

  computed: {
    ...mapState('report', [
      'loading',
      'exportLoading',
      'error',
      'reports',
      'exportedFiles',
      'clients',
      'activeTab',
      'showExportModal',
      'showExportedFiles',
    ]),
    ...mapGetters('report', ['overdueCount']),
    hasRealtyReports() {
      const has = this.$store.getters['auth/hasPermission']
      return (
        has('view_reports') &&
        [
          'view_report_occupancy',
          'view_report_rent_roll',
          'view_report_expiring_contracts',
          'view_report_tenant_arrears',
          'view_report_collection',
          'view_report_vacant_units',
          'view_report_property_revenue',
        ].some(p => has(p))
      )
    },
    tabs() {
      return [...this.financialTabs, ...this.realtyTabs]
    },
    realtyTabs() {
      return this.realtyKeys.map(k => ({
        id: k,
        realty: true,
        label: this.$t('reports.realty.types.' + k),
      }))
    },
    financialTabs() {
      return [
        { id: 'invoices', label: this.$t('reports.types.invoices') },
        { id: 'clients', label: this.$t('reports.types.clients') },
        { id: 'revenue', label: this.$t('reports.types.revenue') },
        { id: 'overdue', label: this.$t('reports.types.overdue') },
        { id: 'aging', label: this.$t('reports.types.aging') },
      ]
    },
    filters: {
      get() {
        return this.$store.state.report.filters
      },
      set(value) {
        this.$store.commit('report/SET_FILTERS', value)
      },
    },
  },

  watch: {
    filters: {
      deep: true,
      handler() {
        this.loadReport()
      },
    },
  },

  methods: {
    selectTab(tab) {
      if (tab.realty) {
        this.realtyKey = tab.id
        return
      }
      this.realtyKey = null
      this.switchTab(tab.id)
    },

    isTabActive(tab) {
      return tab.realty ? this.realtyKey === tab.id : !this.realtyKey && this.activeTab === tab.id
    },

    async loadRealtyMeta() {
      try {
        const res = await axios.get('/admin/reports/realty')
        const data = res.data?.data || {}
        this.realtyKeys = data.reports || []
        this.realtyProperties = data.properties || []
      } catch (e) {
        console.error('Failed to load realty reports meta:', e)
      }
    },

    ...mapActions('report', [
      'init',
      'loadReport',
      'switchTab',
      'handlePageChange',
      'resetFilters',
      'openExportModal',
      'closeExportModal',
      'toggleExportedFiles',
      'handleDirectExport',
      'handleServerExport',
      'refreshExportedFiles',
      'deleteExportedFile',
      'clearError',
    ]),
    ...mapActions('report', {
      handleSendReminder: 'sendReminder',
      handleMarkAsPaid: 'markAsPaid',
    }),

    async confirmDeleteFile(fileName) {
      let confirmed = false

      if (this.$swal) {
        const result = await this.$swal({
          title: this.$t('common.delete_confirm_title'),
          text: this.$t('common.delete_confirm_text'),
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#EF4444',
          cancelButtonColor: '#6B7280',
          confirmButtonText: this.$t('common.delete_confirm'),
          cancelButtonText: this.$t('common.cancel'),
          reverseButtons: true,
        })
        confirmed = result.isConfirmed
      } else {
        confirmed = window.confirm(this.$t('common.delete_confirm_text'))
      }

      if (confirmed) {
        try {
          await this.deleteExportedFile(fileName)
          this.$toast.success(this.$t('messages.deleteSuccess'))
        } catch (error) {
          this.$toast.error(this.$t('errors.deleteFailed'))
        }
      }
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },

    formatRelativeTime(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.round(diffMs / 60000)
      const diffHours = Math.round(diffMs / 3600000)
      const diffDays = Math.round(diffMs / 86400000)

      if (diffMins < 60) return this.$t('common.timeAgo.minutes', { minutes: diffMins })
      if (diffHours < 24) return this.$t('common.timeAgo.hours', { hours: diffHours })
      if (diffDays < 7) return this.$t('common.timeAgo.days', { days: diffDays })
      return this.formatDate(dateString)
    },

    formatCurrency(amount) {
      if (!amount && amount !== 0) return '0.00 ' + this.$t('common.currency')
      const formatter = new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 2,
      })
      return formatter.format(amount)
    },
  },

  mounted() {
    this.init()
    if (this.hasRealtyReports) this.loadRealtyMeta()
  },
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.tabs-container::-webkit-scrollbar {
  height: 4px;
}

.tabs-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.tabs-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.tabs-container::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>