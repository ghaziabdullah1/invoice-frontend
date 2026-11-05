<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-8">
    <div class="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6">
      <!-- Header -->
      <div class="mb-8">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 "
        >
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100">
                  {{ $t('clients.editClient') }}
                </h1>
                <p class="text-gray-600 dark:text-slate-400 text-sm mt-1">{{ $t('clients.editClientDescription') }}</p>
              </div>
            </div>

            <!-- Breadcrumbs -->
            <nav class="flex mt-3" aria-label="Breadcrumb">
              <ol class="flex items-center space-x-1 space-x-reverse">
                <li>
                  <router-link
                    to="/clients"
                    class="text-sm text-gray-500 hover:text-gray-700 dark:text-slate-300 transition-colors"
                  >
                    {{ $t('clients.title') }}
                  </router-link>
                </li>
                <li>
                  <svg class="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </li>
                <li>
                  <router-link
                    :to="`/clients/${clientId}`"
                    class="text-sm text-gray-500 hover:text-gray-700 dark:text-slate-300 transition-colors"
                  >
                    {{ form.name || 'تحميل...' }}
                  </router-link>
                </li>
                <li>
                  <svg class="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </li>
                <li class="text-sm font-medium text-blue-600">{{ $t('common.edit') }}</li>
              </ol>
            </nav>
          </div>

          <div class="flex gap-3">
            <button
              @click="$router.push(`/clients/${clientId}`)"
              class="px-4 py-2.5 bg-white border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-200 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              {{ $t('common.back') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-12 mb-6">
        <div class="text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"
          ></div>
          <p class="text-gray-700 dark:text-slate-300 font-medium">{{ $t('common.loading') }}</p>
          <p class="text-sm text-gray-500 mt-2">{{ $t('clients.loadingClientInfo') }}</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
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
            <h3 class="text-sm font-medium text-red-800">{{ $t('common.error') }}</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
          </div>
          <button @click="loadClient" class="p-1.5 text-red-700 hover:text-red-900">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <!-- Edit Form -->
      <div v-else class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <!-- Form Header -->
        <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-white">
          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-blue-100 rounded-lg">
              <svg
                class="w-5 h-5 text-blue-600"
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
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-800 dark:text-slate-200">
                {{ $t('clients.editClientTitle') }}
              </h2>
              <p class="text-sm text-gray-600 dark:text-slate-400">{{ $t('clients.updateInfo') }}</p>
            </div>
          </div>
        </div>

        <!-- Form Content -->
        <div class="p-6">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Basic Information Section -->
            <div class="space-y-4">
              <div class="flex items-center gap-2 mb-4">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 class="text-lg font-medium text-gray-900 dark:text-slate-100">{{ $t('clients.basicInfo') }}</h3>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {{ $t('clients.form.name') }} <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.name"
                    type="text"
                    :placeholder="$t('clients.form.namePlaceholder')"
                    :class="[
                      'w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                      errors.name ? 'border-red-300' : 'border-gray-300 dark:border-slate-600',
                    ]"
                    required
                  />
                  <div v-if="errors.name" class="mt-1 text-sm text-red-600">
                    {{ errors.name }}
                  </div>
                </div>

                <!-- Email -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {{ $t('auth.email') }} <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="form.email"
                    type="email"
                    :placeholder="$t('clients.form.emailPlaceholder')"
                    :class="[
                      'w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                      errors.email ? 'border-red-300' : 'border-gray-300 dark:border-slate-600',
                    ]"
                    required
                  />
                  <div v-if="errors.email" class="mt-1 text-sm text-red-600">
                    {{ errors.email }}
                  </div>
                </div>

                <!-- Phone -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {{ $t('clients.form.phone') }}
                  </label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    :placeholder="$t('clients.form.phonePlaceholder')"
                    :class="[
                      'w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                      errors.phone ? 'border-red-300' : 'border-gray-300 dark:border-slate-600',
                    ]"
                  />
                  <div v-if="errors.phone" class="mt-1 text-sm text-red-600">
                    {{ errors.phone }}
                  </div>
                </div>

                <!-- Company Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {{ $t('clients.form.companyName') }}
                  </label>
                  <input
                    v-model="form.company_name"
                    type="text"
                    :placeholder="$t('clients.form.companyNamePlaceholder')"
                    :class="[
                      'w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                      errors.company_name ? 'border-red-300' : 'border-gray-300 dark:border-slate-600',
                    ]"
                  />
                  <div v-if="errors.company_name" class="mt-1 text-sm text-red-600">
                    {{ errors.company_name }}
                  </div>
                </div>

                <!-- Tax Number -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {{ $t('clients.form.taxNumber') }}
                  </label>
                  <input
                    v-model="form.tax_number"
                    type="text"
                    :placeholder="$t('clients.form.taxNumberPlaceholder')"
                    :class="[
                      'w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                      errors.tax_number ? 'border-red-300' : 'border-gray-300 dark:border-slate-600',
                    ]"
                  />
                  <div v-if="errors.tax_number" class="mt-1 text-sm text-red-600">
                    {{ errors.tax_number }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Business Settings Section -->
            <div class="space-y-4">
              <div class="flex items-center gap-2 mb-4">
                <svg
                  class="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h3 class="text-lg font-medium text-gray-900 dark:text-slate-100">
                  {{ $t('clients.businessSettings') }}
                </h3>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Payment Terms -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {{ $t('clients.form.paymentTerms') }}
                  </label>
                  <div class="relative">
                    <select
                      v-model="form.payment_terms"
                      :class="[
                        'w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white dark:bg-slate-800',
                        errors.payment_terms ? 'border-red-300' : 'border-gray-300 dark:border-slate-600',
                      ]"
                    >
                      <option value="net_30">صافي 30 يوم</option>
                      <option value="net_15">صافي 15 يوم</option>
                      <option value="net_7">صافي 7 أيام</option>
                      <option value="upon_receipt">عند الاستلام</option>
                    </select>
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
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <div v-if="errors.payment_terms" class="mt-1 text-sm text-red-600">
                    {{ errors.payment_terms }}
                  </div>
                </div>

                <!-- Currency -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {{ $t('clients.form.currency') }}
                  </label>
                  <div class="relative">
                    <select
                      v-model="form.currency"
                      :class="[
                        'w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white dark:bg-slate-800',
                        errors.currency ? 'border-red-300' : 'border-gray-300 dark:border-slate-600',
                      ]"
                    >
                      <option value="SAR">ريال سعودي (SAR)</option>
                      <option value="USD">دولار أمريكي (USD)</option>
                      <option value="EUR">يورو (EUR)</option>
                      <option value="KWD">دينار كويتي (KWD)</option>
                    </select>
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
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <div v-if="errors.currency" class="mt-1 text-sm text-red-600">
                    {{ errors.currency }}
                  </div>
                </div>

                <!-- Credit Limit -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {{ $t('clients.form.creditLimit') }}
                  </label>
                  <input
                    v-model="form.credit_limit"
                    type="number"
                    min="0"
                    step="0.01"
                    :placeholder="$t('clients.form.creditLimitPlaceholder')"
                    :class="[
                      'w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                      errors.credit_limit ? 'border-red-300' : 'border-gray-300 dark:border-slate-600',
                    ]"
                  />
                  <p class="mt-1 text-xs text-gray-500">
                    {{ $t('clients.form.creditLimitHint') }}
                  </p>
                  <div v-if="errors.credit_limit" class="mt-1 text-sm text-red-600">
                    {{ errors.credit_limit }}
                  </div>
                </div>

                <!-- Status -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    {{ $t('common.status') }}
                  </label>
                  <div class="relative">
                    <select
                      v-model="form.status"
                      :class="[
                        'w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white dark:bg-slate-800',
                        errors.status ? 'border-red-300' : 'border-gray-300 dark:border-slate-600',
                      ]"
                    >
                      <option value="active">{{ $t('common.active') }}</option>
                      <option value="inactive">{{ $t('common.inactive') }}</option>
                    </select>
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
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <div v-if="errors.status" class="mt-1 text-sm text-red-600">
                    {{ errors.status }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional Information Section -->
            <div class="space-y-4">
              <div class="flex items-center gap-2 mb-4">
                <svg
                  class="w-5 h-5 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 class="text-lg font-medium text-gray-900 dark:text-slate-100">
                  {{ $t('clients.additionalInfo') }}
                </h3>
              </div>

              <!-- Address -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  {{ $t('clients.form.address') }}
                </label>
                <textarea
                  v-model="form.address"
                  :placeholder="$t('clients.form.addressPlaceholder')"
                  rows="3"
                  :class="[
                    'w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                    errors.address ? 'border-red-300' : 'border-gray-300 dark:border-slate-600',
                  ]"
                ></textarea>
                <div v-if="errors.address" class="mt-1 text-sm text-red-600">
                  {{ errors.address }}
                </div>
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  {{ $t('clients.form.notes') }}
                </label>
                <textarea
                  v-model="form.notes"
                  :placeholder="$t('clients.form.notesPlaceholder')"
                  rows="3"
                  :class="[
                    'w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                    errors.notes ? 'border-red-300' : 'border-gray-300 dark:border-slate-600',
                  ]"
                ></textarea>
                <div v-if="errors.notes" class="mt-1 text-sm text-red-600">
                  {{ errors.notes }}
                </div>
              </div>
            </div>

            <!-- Quick Tips -->
            <div class="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div class="flex items-center gap-2 mb-3">
                <svg
                  class="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h4 class="font-medium text-blue-800">{{ $t('clients.quickTips') }}</h4>
              </div>
              <ul class="space-y-2">
                <li class="flex items-start gap-2 text-sm text-blue-700">
                  <svg
                    class="w-4 h-4 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {{ $t('clients.tip1') }}
                </li>
                <li class="flex items-start gap-2 text-sm text-blue-700">
                  <svg
                    class="w-4 h-4 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {{ $t('clients.tip2') }}
                </li>
                <li class="flex items-start gap-2 text-sm text-blue-700">
                  <svg
                    class="w-4 h-4 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {{ $t('clients.tip3') }}
                </li>
                <li class="flex items-start gap-2 text-sm text-blue-700">
                  <svg
                    class="w-4 h-4 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {{ $t('clients.tip4') }}
                </li>
              </ul>
            </div>

            <!-- Form Actions -->
            <div class="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
              <button
                type="button"
                @click="$router.push(`/clients/${clientId}`)"
                :disabled="submitting"
                class="px-6 py-3 bg-white border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:bg-slate-900 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                {{ $t('common.cancel') }}
              </button>

              <button
                type="submit"
                :disabled="submitting"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="!submitting"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <svg
                  v-else
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
                {{ submitting ? $t('common.updating') : $t('common.update') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditClient',
  data() {
    return {
      loading: true,
      submitting: false,
      clientId: null,
      form: {
        name: '',
        email: '',
        phone: '',
        address: '',
        company_name: '',
        tax_number: '',
        payment_terms: 'net_30',
        credit_limit: '',
        currency: 'SAR',
        notes: '',
        status: 'active',
      },
      errors: {},
      error: null,
    }
  },
  mounted() {
    this.clientId = this.$route.params.id
    this.loadClient()
  },
  methods: {
    async loadClient() {
      this.loading = true
      this.error = null
      try {
        const client = await this.$store.dispatch('clients/fetchClient', this.clientId)
        console.log('📊 بيانات العميل المستلمة:', client)

        this.form = {
          name: client.name || '',
          email: client.email || '',
          phone: client.phone || '',
          address: client.address || '',
          company_name: client.company_name || '',
          tax_number: client.tax_number || '',
          payment_terms: client.payment_terms || 'net_30',
          credit_limit: client.credit_limit ?? '',
          currency: client.currency || 'SAR',
          notes: client.notes || '',
          status: client.is_active ? 'active' : 'inactive',
        }
      } catch (error) {
        console.error('❌ خطأ في تحميل العميل:', error)
        this.error = error.message || this.$t('common.loadError')
      } finally {
        this.loading = false
      }
    },
    async handleSubmit() {
      this.errors = {}
      this.submitting = true

      try {
        // التحقق من البيانات
        if (!this.form.name.trim()) {
          this.errors.name = 'الرجاء إدخال اسم العميل'
          return
        }

        if (!this.form.email.trim()) {
          this.errors.email = 'البريد الإلكتروني مطلوب'
          return
        }

        if (this.form.email && !this.isValidEmail(this.form.email)) {
          this.errors.email = 'البريد الإلكتروني غير صالح'
          return
        }

        // إعداد البيانات للإرسال
        const dataToSend = {
          name: this.form.name,
          email: this.form.email,
          phone: this.form.phone || '',
          address: this.form.address || '',
          company_name: this.form.company_name || '',
          tax_number: this.form.tax_number || '',
          payment_terms: this.form.payment_terms,
          credit_limit: this.form.credit_limit === '' ? null : Number(this.form.credit_limit),
          currency: this.form.currency,
          notes: this.form.notes || '',
          status: this.form.status,
        }

        // إزالة الحقول الفارغة
        Object.keys(dataToSend).forEach((key) => {
          if (dataToSend[key] === '' || dataToSend[key] === null) {
            delete dataToSend[key]
          }
        })

        await this.$store.dispatch('clients/updateClient', {
          id: this.clientId,
          data: dataToSend,
        })

        this.$toast.success(this.$t('clients.updateSuccess'), {
          position: 'bottom-right',
          duration: 3000,
        })

        this.$router.push(`/clients/${this.clientId}`)
      } catch (error) {
        console.error('❌ خطأ في تحديث العميل:', error)

        if (error.response?.data) {
          console.error('📡 تفاصيل استجابة الخطأ:', error.response.data)

          if (error.response.data.message) {
            this.$toast.error(error.response.data.message, {
              position: 'bottom-right',
              duration: 4000,
            })
          }

          if (error.response.data.errors) {
            this.errors = error.response.data.errors
          }
        } else if (error.message) {
          this.$toast.error(error.message, {
            position: 'bottom-right',
            duration: 4000,
          })
        }
      } finally {
        this.submitting = false
      }
    },
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    },
  },
}
</script>

<style scoped>
/* تحسينات للجوّال */
@media (max-width: 640px) {
  .form-section {
    padding: 1rem;
  }

  .grid {
    gap: 0.75rem;
  }
}

/* تأثيرات focus محسنة */
input:focus,
select:focus,
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* تحسينات التحقق من الصحة */
.border-red-300:focus {
  border-color: #f87171;
  box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.1);
}

/* تحسينات الأيقونات */
svg {
  display: inline-block;
  vertical-align: middle;
}

/* تأثيرات الأزرار */
button {
  transition: all 0.2s ease-in-out;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
}

/* تحسينات للعناصر المخصصة */
::placeholder {
  color: #9ca3af;
}

/* تخصيص شريط التمرير */
textarea {
  resize: vertical;
  min-height: 100px;
}

/* تأثيرات الـ loading */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
