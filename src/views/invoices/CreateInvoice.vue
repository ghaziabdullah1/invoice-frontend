```vue
<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-8"
    :dir="$i18n.locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">

      <!-- ================= Header ================= -->
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

          <div class="flex items-center gap-3">
            <div class="p-2.5 bg-blue-600 rounded-xl shadow-md shadow-blue-200">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a4 4 0 002 2h2a4 4 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>

            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
                {{ $t('invoices.create.title') }}
              </h1>

              <p class="text-gray-500 text-sm mt-0.5">
                {{ $t('invoices.create.subtitle') }}
              </p>
            </div>
          </div>

          <button @click="$router.push('/invoices')"
            class="px-4 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all duration-200 flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>

            <span class="hidden sm:inline">
              {{ $t('common.back') }}
            </span>
          </button>
        </div>
      </div>

      <!-- ================= Stepper ================= -->
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">

        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2 text-sm">
            <span class="text-gray-500">
              {{ $t('common.step') }}
            </span>

            <span class="font-bold text-blue-600">
              {{ currentStep + 1 }} / {{ steps.length }}
            </span>
          </div>

          <div class="text-sm">
            <span class="font-bold text-gray-900">
              {{ getStepProgress() }}%
            </span>

            <span class="text-gray-500">
              {{ $t('common.completed') }}
            </span>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-5">
          <div class="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
            :style="{ width: getStepProgress() + '%' }"></div>
        </div>

        <!-- Steps -->
        <div class="flex items-center">
          <template v-for="(step, index) in steps" :key="index">

            <button @click="goToStep(index)" :disabled="index > furthestReached"
              class="flex flex-col items-center group disabled:cursor-not-allowed">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                currentStep === index
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200 scale-110'
                  : currentStep > index
                    ? 'bg-green-500 border-green-500 text-white'
                    : index <= furthestReached
                      ? 'bg-white border-blue-300 text-blue-400 group-hover:border-blue-500'
                      : 'bg-white border-gray-200 text-gray-300',
              ]">
                <svg v-if="currentStep > index" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>

                <span v-else class="font-bold text-sm">
                  {{ index + 1 }}
                </span>
              </div>

              <span :class="[
                'text-xs font-medium mt-2 transition-colors whitespace-nowrap',
                currentStep === index
                  ? 'text-blue-600'
                  : currentStep > index
                    ? 'text-green-600'
                    : 'text-gray-400',
              ]">
                {{ $t(step.labelKey) }}
              </span>
            </button>

            <!-- Connector -->
            <div v-if="index < steps.length - 1" :class="[
              'flex-1 h-0.5 mx-2 mb-5 rounded transition-colors duration-500',
              currentStep > index ? 'bg-green-500' : 'bg-gray-200',
            ]"></div>

          </template>
        </div>
      </div>

      <!-- ================= Main Grid ================= -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <!-- ========== Form Column ========== -->
        <div class="lg:col-span-2 space-y-6">

          <!-- ======== STEP 1: Basic Info ======== -->
          <transition name="fade" mode="out-in">
            <div v-if="currentStep === 0" key="step1"
              class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

              <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-3">

                <div class="p-2 bg-blue-100 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>

                <h3 class="font-semibold text-gray-800">
                  {{ $t('invoices.create.basic_info') }}
                </h3>
              </div>

              <div class="p-6 space-y-5">

                <!-- Client -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('invoices.create.client') }}
                    <span class="text-red-500">*</span>
                  </label>

                  <div v-if="clientsLoading"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 flex items-center gap-2 text-sm text-gray-400">
                    <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>

                    {{ $t('common.loading') }}
                  </div>

                  <div v-else class="relative">
                    <select v-model="invoiceData.client_id"
                      class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white appearance-none transition-colors"
                      :class="errors.client_id ? 'border-red-400 bg-red-50/30' : 'border-gray-200'"
                      @change="errors.client_id = null">
                      <option value="">
                        {{ $t('common.select_client') }}
                      </option>

                      <option v-for="client in clients" :key="client.id" :value="client.id">
                        {{ client.name }} — {{ client.company_name || client.email }}
                      </option>
                    </select>

                    <svg class="w-5 h-5 absolute start-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  <p v-if="errors.client_id" class="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                    {{ $t('validation.client_required') }}
                  </p>

                  <!-- Selected client card -->
                  <transition name="fade">
                    <div v-if="selectedClient" class="mt-3 p-4 bg-blue-50/60 border border-blue-100 rounded-xl">
                      <div class="flex items-start gap-3">

                        <div
                          class="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span class="text-white font-bold text-sm">
                            {{ getInitials(selectedClient.name) }}
                          </span>
                        </div>

                        <div class="flex-1 min-w-0">
                          <h4 class="font-semibold text-gray-900 truncate">
                            {{ selectedClient.name }}
                          </h4>

                          <p class="text-sm text-gray-500 truncate">
                            {{ selectedClient.email }}
                          </p>

                          <div class="flex flex-wrap gap-1.5 mt-2">

                            <span v-if="selectedClient.phone"
                              class="text-xs bg-white text-gray-600 px-2 py-1 rounded-md border border-gray-100">
                              {{ selectedClient.phone }}
                            </span>

                            <span v-if="selectedClient.company_name"
                              class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                              {{ selectedClient.company_name }}
                            </span>

                          </div>
                        </div>
                      </div>

                      <!-- Credit limit -->
                      <div v-if="hasCreditLimit"
                        class="mt-3 pt-3 border-t border-blue-100 flex flex-wrap justify-between gap-2 text-sm">
                        <span class="text-gray-600">
                          {{ $t('clients.form.creditLimit') }}:
                          <b class="text-gray-800">
                            {{ formatCurrency(selectedClient.credit_limit) }}
                          </b>
                        </span>

                        <span :class="remainingCreditClass" class="font-semibold">
                          {{ $t('invoices.create.remaining_credit') }}:
                          {{ formatCurrency(remainingCredit) }}
                        </span>
                      </div>

                      <div v-if="creditLimitWarning"
                        class="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm flex items-start gap-2">
                        <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>

                        {{ $t('invoices.create.credit_limit_warning') }}
                      </div>
                    </div>
                  </transition>
                </div>

                <!-- Invoice number -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('invoices.create.invoice_number') }}
                  </label>

                  <div class="flex gap-2">
                    <input v-model="invoiceData.invoice_number" :placeholder="$t('common.auto_generated')"
                      class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors bg-gray-50/50" />

                    <button type="button" @click="generateInvoiceNumber" :title="$t('common.generate')"
                      class="px-4 py-3 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Dates -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('common.fromDate') }}
                      <span class="text-red-500">*</span>
                    </label>

                    <input type="date" v-model="invoiceData.invoice_date"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('common.toDate') }}
                      <span class="text-red-500">*</span>
                    </label>

                    <input type="date" v-model="invoiceData.due_date"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors" />

                    <div class="flex gap-1.5 mt-2">
                      <button v-for="d in [7, 15, 30, 60]" :key="d" type="button" @click="setDueDays(d)"
                        class="text-xs px-2.5 py-1 rounded-full border transition-colors" :class="dueDaysPreset === d
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600'">
                        {{ d }} {{ $t('common.days') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="px-6 py-4 bg-gray-50/60 border-t border-gray-100 flex justify-between items-center">

                <button @click="$router.push('/invoices')"
                  class="px-5 py-2.5 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors">
                  {{ $t('common.cancel') }}
                </button>

                <button @click="nextStep" :disabled="!canProceedToStep1"
                  class="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed">
                  {{ $t('common.next') }}

                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </transition>

          <!-- ======== STEP 2: Items ======== -->
          <transition name="fade" mode="out-in">
            <div v-if="currentStep === 1" key="step2"
              class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

              <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">

                <div class="flex items-center gap-3">
                  <div class="p-2 bg-blue-100 rounded-lg">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>

                  <div>
                    <h3 class="font-semibold text-gray-800">
                      {{ $t('invoices.create.items') }}
                    </h3>

                    <p class="text-xs text-gray-400 mt-0.5">
                      {{ invoiceData.items.length }}
                      {{ $t('invoices.create.items_count') }}
                    </p>
                  </div>
                </div>

                <button type="button" @click="addItem"
                  class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-200 transition-all flex items-center gap-2 text-sm">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>

                  {{ $t('invoices.create.add_item') }}
                </button>
              </div>

              <div class="p-6">

                <!-- Desktop -->
                <div class="hidden md:block overflow-hidden rounded-xl border border-gray-100">
                  <table class="min-w-full">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-4 py-3 text-start text-xs font-semibold text-gray-500 w-1/2">
                          {{ $t('invoices.create.description') }}
                        </th>

                        <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 w-28">
                          {{ $t('invoices.create.quantity') }}
                        </th>

                        <th class="px-4 py-3 text-start text-xs font-semibold text-gray-500 w-36">
                          {{ $t('invoices.create.unit_price') }}
                        </th>

                        <th class="px-4 py-3 text-start text-xs font-semibold text-gray-500 w-32">
                          {{ $t('invoices.create.total') }}
                        </th>

                        <th class="w-14"></th>
                      </tr>
                    </thead>

                    <tbody class="divide-y divide-gray-100">

                      <tr v-for="(item, index) in invoiceData.items" :key="index" class="hover:bg-gray-50/50">

                        <td class="px-4 py-3">
                          <input v-model="item.description" type="text"
                            :placeholder="$t('invoices.create.description_placeholder')"
                            class="w-full px-3 py-2 border rounded-lg text-sm transition-colors" :class="itemErrors[index]?.description
                              ? 'border-red-400 bg-red-50/30'
                              : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'" />
                        </td>

                        <td class="px-4 py-3">
                          <div class="flex items-center justify-center">

                            <button type="button" @click="item.quantity = Math.max(1, item.quantity - 1)"
                              class="w-8 h-9 border border-gray-200 rounded-r-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors">
                              −
                            </button>

                            <input v-model.number="item.quantity" type="number" min="1" step="1"
                              class="w-14 h-9 text-center border-y border-gray-200 text-sm focus:outline-none" />

                            <button type="button" @click="item.quantity++"
                              class="w-8 h-9 border border-gray-200 rounded-l-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors">
                              +
                            </button>
                          </div>
                        </td>

                        <td class="px-4 py-3">
                          <div class="relative">

                            <input v-model.number="item.unit_price" type="number" min="0" step="0.01"
                              class="w-full px-3 py-2 ps-9 border rounded-lg text-sm transition-colors" :class="itemErrors[index]?.unit_price
                                ? 'border-red-400 bg-red-50/30'
                                : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'" />

                            <span class="absolute start-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                              {{ $t('currency.sar') }}
                            </span>

                          </div>
                        </td>

                        <td class="px-4 py-3 text-start font-semibold text-gray-800 text-sm whitespace-nowrap">
                          {{ formatCurrency(item.total) }}
                        </td>

                        <td class="px-2 py-3 text-center">
                          <button type="button" @click="removeItem(index)" :disabled="invoiceData.items.length === 1"
                            class="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-300"
                            :title="$t('common.delete')">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>

                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Mobile -->
                <div class="md:hidden space-y-3">

                  <div v-for="(item, index) in invoiceData.items" :key="index"
                    class="border border-gray-100 rounded-xl p-4 bg-gray-50/40">

                    <div class="flex items-start justify-between gap-2 mb-3">

                      <span class="text-xs font-semibold text-gray-400">
                        {{ $t('invoices.create.item') }} #{{ index + 1 }}
                      </span>

                      <button type="button" @click="removeItem(index)" :disabled="invoiceData.items.length === 1"
                        class="p-1.5 text-gray-300 hover:text-red-600 disabled:opacity-30">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <input v-model="item.description" type="text"
                      :placeholder="$t('invoices.create.description_placeholder')"
                      class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm mb-3 bg-white" />

                    <div class="grid grid-cols-2 gap-3">

                      <div>
                        <label class="block text-xs text-gray-400 mb-1">
                          {{ $t('invoices.create.quantity') }}
                        </label>

                        <div class="flex">

                          <button type="button" @click="item.quantity = Math.max(1, item.quantity - 1)"
                            class="w-9 h-10 border border-gray-200 rounded-r-lg bg-white text-gray-500">
                            −
                          </button>

                          <input v-model.number="item.quantity" type="number" min="1"
                            class="w-full h-10 text-center border-y border-gray-200 text-sm bg-white" />

                          <button type="button" @click="item.quantity++"
                            class="w-9 h-10 border border-gray-200 rounded-l-lg bg-white text-gray-500">
                            +
                          </button>

                        </div>
                      </div>

                      <div>
                        <label class="block text-xs text-gray-400 mb-1">
                          {{ $t('invoices.create.unit_price') }}
                        </label>

                        <div class="relative">

                          <input v-model.number="item.unit_price" type="number" min="0" step="0.01"
                            class="w-full h-10 px-3 ps-9 border border-gray-200 rounded-lg text-sm bg-white" />

                          <span class="absolute start-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                            {{ $t('currency.sar') }}
                          </span>

                        </div>
                      </div>

                    </div>

                    <div class="mt-3 pt-3 border-t border-gray-100 flex justify-between text-sm">
                      <span class="text-gray-500">
                        {{ $t('invoices.create.total') }}
                      </span>

                      <span class="font-bold text-blue-600">
                        {{ formatCurrency(item.total) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Validation -->
                <div v-if="!canProceedToStep2 && itemsTouched"
                  class="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-sm flex items-center gap-2">
                  <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>

                  {{ $t('invoices.create.items_hint') }}
                </div>
              </div>

              <div class="px-6 py-4 bg-gray-50/60 border-t border-gray-100 flex justify-between items-center">

                <button @click="prevStep"
                  class="px-5 py-2.5 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>

                  {{ $t('common.previous') }}
                </button>

                <button @click="nextStep" :disabled="!canProceedToStep2"
                  class="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed">
                  {{ $t('common.next') }}

                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

              </div>
            </div>
          </transition>

          <!-- ======== STEP 3: Payment & Extras ======== -->
          <transition name="fade" mode="out-in">
            <div v-if="currentStep === 2" key="step3"
              class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

              <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-3">

                <div class="p-2 bg-blue-100 rounded-lg">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6m7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>

                <h3 class="font-semibold text-gray-800">
                  {{ $t('invoices.create.payment_settings') }}
                </h3>
              </div>

              <div class="p-6 space-y-6">

                <!-- Status -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">
                    {{ $t('invoices.create.status') }}
                    <span class="text-red-500">*</span>
                  </label>

                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">

                    <button v-for="status in statusOptions" :key="status.value" type="button"
                      @click="selectStatus(status.value)" :class="[
                        'p-4 rounded-xl border-2 text-center transition-all duration-200',
                        invoiceData.status === status.value
                          ? 'border-blue-500 bg-blue-50 shadow-sm shadow-blue-100'
                          : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50',
                      ]">

                      <div
                        :class="[status.iconBg, 'w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2']">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="status.icon" />
                        </svg>
                      </div>

                      <span class="text-sm font-semibold"
                        :class="invoiceData.status === status.value ? 'text-blue-700' : 'text-gray-600'">
                        {{ $t(`invoices.status.${status.value}`) }}
                      </span>

                    </button>
                  </div>
                </div>

                <!-- Tax & Discount -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('invoices.create.tax_rate') }}
                    </label>

                    <div class="relative">

                      <input v-model.number="invoiceData.tax_rate" type="number" min="0" max="100" step="0.01"
                        class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors" />

                      <span class="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400">
                        %
                      </span>

                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('invoices.create.discount') }}
                      ({{ $t('currency.sar') }})
                    </label>

                    <input v-model.number="invoiceData.discount_amount" type="number" min="0" step="0.01"
                      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors" />
                  </div>

                </div>

                <!-- Notes -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('common.notes') }}
                  </label>

                  <textarea v-model="invoiceData.notes" rows="3" :placeholder="$t('invoices.notesPlaceholder')"
                    class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors resize-none"></textarea>
                </div>

                <!-- Stripe -->
                <div class="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">

                  <div>
                    <h4 class="font-semibold text-gray-800 text-sm">
                      {{ $t('invoices.create.stripe_checkout') }}
                    </h4>

                    <p class="text-xs text-gray-400 mt-0.5">
                      {{ $t('invoices.create.stripe_description') }}
                    </p>
                  </div>

                  <label class="relative inline-flex items-center cursor-pointer flex-shrink-0">

                    <input type="checkbox" v-model="invoiceData.enable_stripe_checkout" class="sr-only peer"
                      :disabled="invoiceData.status === 'paid' || wantsInstallmentPlan" />

                    <div
                      class="w-12 h-7 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-disabled:opacity-40 relative after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow peer-checked:after:translate-x-full">
                    </div>

                  </label>
                </div>

                <div v-if="invoiceData.enable_stripe_checkout && errors.stripe_amount"
                  class="-mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex items-start gap-2">
                  <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>

                  {{ errors.stripe_amount }}
                </div>

                <!-- Installments -->
                <div class="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">

                  <div>

                    <h4 class="font-semibold text-gray-800 text-sm">
                      {{ $t('installments.title') }}
                    </h4>

                    <p class="text-xs text-gray-400 mt-0.5">
                      {{
                        wantsInstallmentPlan
                          ? $t('installments.offer_hint')
                          : $t('installments.create_offer_description')
                      }}
                    </p>

                    <p v-if="invoiceData.status === 'draft'" class="text-xs text-amber-600 mt-1">
                      {{ $t('installments.not_available_for_draft') }}
                    </p>

                  </div>

                  <label class="relative inline-flex items-center cursor-pointer flex-shrink-0">

                    <input type="checkbox" v-model="wantsInstallmentPlan" class="sr-only peer"
                      :disabled="invoiceData.status === 'paid' || invoiceData.status === 'draft'" />

                    <div
                      class="w-12 h-7 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-disabled:opacity-40 relative after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:shadow peer-checked:after:translate-x-full">
                    </div>

                  </label>
                </div>
              </div>

              <div class="px-6 py-4 bg-gray-50/60 border-t border-gray-100 flex justify-between items-center">

                <button @click="prevStep"
                  class="px-5 py-2.5 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>

                  {{ $t('common.previous') }}
                </button>

                <button @click="nextStep"
                  class="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-all flex items-center gap-2">
                  {{ $t('common.next') }}

                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

              </div>
            </div>
          </transition>

          <!-- ======== STEP 4: Review ======== -->
          <transition name="fade" mode="out-in">
            <div v-if="currentStep === 3" key="step4"
              class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

              <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-3">

                <div class="p-2 bg-green-100 rounded-lg">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <h3 class="font-semibold text-gray-800">
                  {{ $t('invoices.create.review') }}
                </h3>
              </div>

              <div class="p-6 space-y-4">

                <!-- Review -->
                <div class="rounded-xl border border-gray-100 divide-y divide-gray-100">

                  <div class="flex justify-between items-center px-4 py-3 text-sm">
                    <span class="text-gray-500">
                      {{ $t('invoices.create.client') }}
                    </span>

                    <span class="font-semibold text-gray-900">
                      {{ selectedClient?.name || '-' }}
                    </span>
                  </div>

                  <div class="flex justify-between items-center px-4 py-3 text-sm">
                    <span class="text-gray-500">
                      {{ $t('invoices.create.invoice_number') }}
                    </span>

                    <span class="font-semibold text-gray-900 font-mono text-xs">
                      {{ invoiceData.invoice_number || $t('common.auto_generated') }}
                    </span>
                  </div>

                  <div class="flex justify-between items-center px-4 py-3 text-sm">
                    <span class="text-gray-500">
                      {{ $t('invoices.create.status') }}
                    </span>

                    <span class="font-semibold text-blue-600">
                      {{ $t(`invoices.status.${invoiceData.status}`) }}
                    </span>
                  </div>

                  <div v-if="wantsInstallmentPlan"
                    class="flex justify-between items-center px-4 py-3 text-sm bg-blue-50/50">
                    <span class="text-gray-500">
                      {{ $t('installments.title') }}
                    </span>

                    <span class="font-semibold text-blue-600">
                      {{ $t('installments.will_offer_after_save') }}
                    </span>
                  </div>

                  <div v-if="invoiceData.enable_stripe_checkout"
                    class="flex justify-between items-center px-4 py-3 text-sm bg-purple-50/50">
                    <span class="text-gray-500">
                      {{ $t('invoices.create.stripe') }}
                    </span>

                    <span class="font-semibold text-purple-600">
                      {{ $t('common.enabled') }}
                    </span>
                  </div>

                </div>

                <!-- Items -->
                <div class="rounded-xl border border-gray-100 overflow-hidden">

                  <div class="px-4 py-2.5 bg-gray-50 text-xs font-semibold text-gray-500">
                    {{ $t('invoices.create.items') }}
                    ({{ invoiceData.items.length }})
                  </div>

                  <div class="divide-y divide-gray-50">

                    <div v-for="(item, idx) in invoiceData.items" :key="idx"
                      class="flex justify-between items-center px-4 py-2.5 text-sm">
                      <span class="text-gray-700 truncate me-3">
                        {{ item.description }}

                        <span class="text-gray-400">
                          × {{ item.quantity }}
                        </span>
                      </span>

                      <span class="font-medium text-gray-900 whitespace-nowrap">
                        {{ formatCurrency(item.total) }}
                      </span>
                    </div>

                  </div>
                </div>
              </div>

              <div
                class="px-6 py-4 bg-gray-50/60 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-between items-center gap-3">

                <button @click="prevStep"
                  class="w-full sm:w-auto px-5 py-2.5 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 19l-7-7m0 0l7-7m7 7h18" />
                  </svg>

                  {{ $t('common.previous') }}
                </button>

                <div class="flex w-full sm:w-auto gap-3">

                  <button @click="saveAsDraft" :disabled="loading"
                    class="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium disabled:opacity-50">
                    {{ $t('common.save_draft') }}
                  </button>

                  <button @click="submitInvoice" :disabled="loading || !isFormValid"
                    class="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed">

                    <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />

                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>

                    {{ loading ? $t('common.loading') : getSubmitButtonText() }}

                  </button>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- ========== Sidebar Summary ========== -->
        <div class="lg:sticky lg:top-6 space-y-4">

          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

            <div
              class="px-5 py-4 border-b border-gray-100 bg-gradient-to-l from-blue-50/60 to-white flex items-center justify-between">
              <h3 class="font-bold text-gray-800 text-sm">
                {{ $t('invoices.create.summary') }}
              </h3>

              <div class="p-1.5 bg-blue-100 rounded-lg">
                <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div class="p-5 space-y-3">

              <div class="flex justify-between text-sm">
                <span class="text-gray-500">
                  {{ $t('invoices.create.subtotal') }}
                </span>

                <span class="font-medium text-gray-900">
                  {{ formatCurrency(invoiceData.subtotal) }}
                </span>
              </div>

              <div class="flex justify-between text-sm">
                <span class="text-gray-500">
                  {{ $t('invoices.create.tax') }}
                  ({{ invoiceData.tax_rate }}%)
                </span>

                <span class="font-medium text-gray-900">
                  {{ formatCurrency(invoiceData.tax_amount) }}
                </span>
              </div>

              <div v-if="invoiceData.discount_amount > 0" class="flex justify-between text-sm">
                <span class="text-gray-500">
                  {{ $t('invoices.create.discount') }}
                </span>

                <span class="font-medium text-red-600">
                  -{{ formatCurrency(invoiceData.discount_amount) }}
                </span>
              </div>

              <div class="flex justify-between items-center pt-3 border-t border-dashed border-gray-200">

                <span class="font-bold text-gray-900">
                  {{ $t('invoices.create.total') }}
                </span>

                <span class="text-xl font-bold text-blue-600">
                  {{ formatCurrency(invoiceData.total) }}
                </span>

              </div>
            </div>
          </div>

          <!-- Status -->
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

            <div class="flex items-center gap-2 mb-3">
              <span class="w-2 h-2 rounded-full bg-blue-500"></span>

              <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {{ $t('invoices.create.status') }}
              </h4>
            </div>

            <span class="px-4 py-1.5 rounded-full text-sm font-semibold inline-flex items-center gap-2"
              :class="statusOptions.find(s => s.value === invoiceData.status)?.badgeClass">
              <span class="w-2 h-2 rounded-full bg-current opacity-60"></span>

              {{ $t(`invoices.status.${invoiceData.status}`) }}
            </span>

            <p class="text-xs text-gray-400 mt-3 leading-relaxed">
              {{ getSubmitButtonText() }}
            </p>

          </div>
        </div>
      </div>
    </div>

    <!-- Installment modal -->
    <CreateInstallmentPlanModal v-if="newInvoiceId" :show="showInstallmentModal" :invoice-id="newInvoiceId"
      :invoice-total="newInvoiceTotal" :submitting="false" @close="finishAndRedirect" @created="finishAndRedirect" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CreateInstallmentPlanModal from '@/components/invoices/CreateInstallmentPlanModal.vue'

export default {
  name: 'CreateInvoice',

  components: {
    CreateInstallmentPlanModal
  },

  data() {
    return {
      minStripeAmount: 5,
      currentStep: 0,
      furthestReached: 0,

      steps: [
        { labelKey: 'steps.basic' },
        { labelKey: 'steps.items' },
        { labelKey: 'steps.payment' },
        { labelKey: 'steps.review' },
      ],

      invoiceData: {
        client_id: '',
        invoice_number: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'draft',
        items: [
          {
            description: '',
            quantity: 1,
            unit_price: 0,
            total: 0
          }
        ],
        notes: '',
        tax_rate: 15,
        discount_amount: 0,
        subtotal: 0,
        tax_amount: 0,
        total: 0,
        enable_stripe_checkout: false,
      },

      errors: {},
      itemsTouched: false,
      clientsLoading: false,

      statusOptions: [
        {
          value: 'draft',
          icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
          iconBg: 'bg-gray-100 text-gray-600',
          badgeClass: 'bg-gray-100 text-gray-700',
        },
        {
          value: 'sent',
          icon: 'M3 8l7.89-4.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
          iconBg: 'bg-blue-100 text-blue-600',
          badgeClass: 'bg-blue-100 text-blue-700',
        },
        {
          value: 'paid',
          icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
          iconBg: 'bg-green-100 text-green-600',
          badgeClass: 'bg-green-100 text-green-700',
        },
        {
          value: 'overdue',
          icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
          iconBg: 'bg-red-100 text-red-600',
          badgeClass: 'bg-red-100 text-red-700',
        },
      ],

      wantsInstallmentPlan: false,
      newInvoiceId: null,
      newInvoiceTotal: 0,
      showInstallmentModal: false,
    }
  },

  computed: {
    ...mapGetters('invoices', ['loading', 'error']),
    ...mapGetters('clients', ['clients']),

    selectedClient() {
      return this.clients.find((c) => c.id == this.invoiceData.client_id)
    },

    hasCreditLimit() {
      return this.selectedClient && this.selectedClient.credit_limit != null
    },

    remainingCredit() {
      if (!this.hasCreditLimit) return null

      const limit = parseFloat(this.selectedClient.credit_limit) || 0
      const due = parseFloat(this.selectedClient.total_due) || 0

      return limit - due
    },

    remainingCreditClass() {
      if (this.remainingCredit === null) return 'text-gray-600'

      return this.remainingCredit < 0
        ? 'text-red-600'
        : 'text-green-600'
    },

    creditLimitWarning() {
      if (!this.hasCreditLimit) return false

      return this.invoiceData.total > this.remainingCredit
    },

    dueDaysPreset() {
      const diff =
        (new Date(this.invoiceData.due_date) -
          new Date(this.invoiceData.invoice_date)) /
        86400000

      return [7, 15, 30, 60].includes(diff) ? diff : null
    },

    itemErrors() {
      return this.invoiceData.items.map((i) => ({
        description:
          this.itemsTouched && !i.description?.trim(),

        unit_price:
          this.itemsTouched &&
          (i.unit_price == null || i.unit_price < 0),
      }))
    },

    isFormValid() {
      return (
        this.invoiceData.client_id &&
        this.invoiceData.invoice_date &&
        this.invoiceData.due_date &&
        this.invoiceData.status &&
        this.invoiceData.items.every(
          (i) =>
            i.description?.trim() &&
            i.quantity > 0 &&
            i.unit_price >= 0
        )
      )
    },

    canProceedToStep1() {
      return (
        this.invoiceData.client_id &&
        this.invoiceData.invoice_date &&
        this.invoiceData.due_date
      )
    },

    canProceedToStep2() {
      return this.invoiceData.items.every(
        (i) =>
          i.description?.trim() &&
          i.quantity > 0
      )
    },
  },

  mounted() {
    this.loadClients()
    this.generateInvoiceNumber()
  },

  methods: {
    ...mapActions('invoices', [
      'createInvoice',
      'clearError'
    ]),

    ...mapActions('clients', [
      'fetchClients'
    ]),

    getStepProgress() {
      return Math.round(
        ((this.currentStep + 1) / this.steps.length) * 100
      )
    },

    async loadClients() {
      this.clientsLoading = true

      try {
        await this.fetchClients({
          per_page: 100
        })
      } catch (e) {
        console.error(e)
      } finally {
        this.clientsLoading = false
      }
    },

    generateInvoiceNumber() {
      const d = new Date()

      this.invoiceData.invoice_number =
        `INV-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
    },

    goToStep(index) {
      if (index <= this.furthestReached) {
        this.currentStep = index
      }
    },

    nextStep() {
      if (this.currentStep === 1) {
        this.itemsTouched = true
      }

      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++

        this.furthestReached = Math.max(
          this.furthestReached,
          this.currentStep
        )
      }
    },

    prevStep() {
      if (this.currentStep > 0) {
        this.currentStep--
      }
    },

    setDueDays(days) {
      const base = new Date(
        this.invoiceData.invoice_date
      )

      base.setDate(base.getDate() + days)

      this.invoiceData.due_date =
        base.toISOString().split('T')[0]
    },

    selectStatus(status) {
      this.invoiceData.status = status

      if (status === 'paid') {
        this.invoiceData.enable_stripe_checkout = false
        this.wantsInstallmentPlan = false
      }

      if (status === 'draft') {
        this.wantsInstallmentPlan = false
      }
    },

    addItem() {
      this.invoiceData.items.push({
        description: '',
        quantity: 1,
        unit_price: 0,
        total: 0
      })
    },

    removeItem(index) {
      if (this.invoiceData.items.length > 1) {
        this.invoiceData.items.splice(index, 1)
      }
    },

    calculateTotals() {
      this.invoiceData.subtotal =
        this.invoiceData.items.reduce(
          (s, i) => s + (i.total || 0),
          0
        )

      this.invoiceData.tax_amount =
        this.invoiceData.subtotal *
        ((this.invoiceData.tax_rate || 0) / 100)

      this.invoiceData.total =
        Math.max(
          0,
          this.invoiceData.subtotal +
          this.invoiceData.tax_amount -
          (this.invoiceData.discount_amount || 0)
        )
    },

    saveAsDraft() {
      this.invoiceData.status = 'draft'
      this.wantsInstallmentPlan = false
      this.submitInvoice()
    },

    getInitials(name) {
      return name
        ? name
          .split(' ')
          .map((w) => w[0])
          .join('')
          .toUpperCase()
          .substring(0, 2)
        : '؟؟'
    },

    formatCurrency(amount) {
      return (
        parseFloat(amount || 0).toFixed(2) +
        ' ' +
        this.$t('currency.sar')
      )
    },

    getSubmitButtonText() {
      if (this.invoiceData.status === 'paid') {
        return this.$t('common.create_and_mark_paid')
      }

      if (this.wantsInstallmentPlan) {
        return this.$t('installments.create_and_setup_plan')
      }

      if (this.invoiceData.status === 'sent') {
        return this.$t('common.create_and_send')
      }

      if (this.invoiceData.enable_stripe_checkout) {
        return this.$t('common.create_and_enable_stripe')
      }

      return this.$t('common.create_invoice')
    },

    validateStripeAmount() {
      if (
        this.invoiceData.enable_stripe_checkout &&
        this.invoiceData.total < this.minStripeAmount
      ) {
        this.errors.stripe_amount =
          this.$t(
            'invoices.create.stripe_min_amount',
            {
              amount: this.minStripeAmount
            }
          )

        return false
      }

      delete this.errors.stripe_amount

      return true
    },

    finishAndRedirect() {
      this.showInstallmentModal = false

      this.$router.push(
        this.newInvoiceId
          ? `/invoices/${this.newInvoiceId}`
          : '/invoices'
      )
    },

    async submitInvoice() {
      this.errors = {}
      this.itemsTouched = true

      if (!this.invoiceData.client_id) {
        this.errors.client_id = true
      }

      if (!this.validateStripeAmount()) {
        this.currentStep = 2
        return
      }

      if (
        !this.canProceedToStep1 ||
        !this.canProceedToStep2
      ) {
        this.currentStep =
          this.errors.client_id ? 0 : 1

        return
      }

      try {
        const data = {
          ...this.invoiceData,

          items: this.invoiceData.items.map((i) => ({
            description: i.description,
            quantity: parseFloat(i.quantity),
            unit_price: parseFloat(i.unit_price),
          })),
        }

        const result =
          await this.createInvoice(data)

        if (
          result?.redirectToStripe &&
          result.stripeUrl
        ) {
          window.location.href = result.stripeUrl
          return
        }

        this.$toast.success(
          this.$t('invoice.messages.created')
        )

        if (result?.invoice?.id) {
          this.newInvoiceId =
            result.invoice.id

          this.newInvoiceTotal =
            result.invoice.total

          if (this.wantsInstallmentPlan) {
            this.showInstallmentModal = true
            return
          }

          this.$router.push(
            `/invoices/${result.invoice.id}`
          )
        } else {
          this.$router.push('/invoices')
        }

      } catch (error) {
        console.error(error)

        this.$toast.error(
          error.response?.data?.message ||
          this.$t('invoice.messages.error')
        )
      }
    },
  },

  watch: {
    'invoiceData.items': {
      handler() {
        this.invoiceData.items.forEach((item) => {
          item.total =
            (parseFloat(item.quantity) || 0) *
            (parseFloat(item.unit_price) || 0)
        })

        this.calculateTotals()
      },

      deep: true,
    },

    'invoiceData.tax_rate'() {
      this.calculateTotals()
    },

    'invoiceData.discount_amount'() {
      this.calculateTotals()
    },
  },
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
```

**ملاحظة مهمة:** هذا الملف يفترض أن ملفات `en.json` و`ar.json` تحتوي على الـ keys الجديدة، خصوصًا:

```text
invoices.create.stripe_checkout
invoices.create.stripe
invoices.create.stripe_min_amount
```

والأهم: **هذا الملف وحده لا يستطيع إصلاح تغيير اللغة إذا كان Language Switcher أو إعداد `i18n` نفسه لا يغيّر الـ
locale.** لكنه الآن جاهز من ناحية الصفحة لدعم `ar` و`en` بشكل صحيح.

إذا اخترت English وما زالت هذه الصفحة لا تتغير، فالخطوة التالية ليست تعديل `CreateInvoice.vue`؛ نحتاج إصلاح **ملف i18n /
Language Switcher**.
