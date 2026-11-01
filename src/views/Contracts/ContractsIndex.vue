<template>
  <div class="min-h-screen bg-slate-100 py-6 md:py-8 dark:bg-slate-900">
    <div class="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100">{{ $t('realty.contract.title') }}</h1>
          <p class="text-gray-600 text-sm mt-1 dark:text-slate-400">{{ $t('realty.contract.subtitle') }}</p>
        </div>
        <button
          v-if="canCreate"
          type="button"
          class="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
          @click="openCreate"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ $t('realty.contract.add') }}
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4 flex flex-col lg:flex-row gap-3 lg:items-center dark:bg-slate-800 dark:border-slate-700">
        <input
          v-model="search"
          type="search"
          :placeholder="$t('realty.contract.search_placeholder')"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 bg-white text-gray-900 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100"
        />
        <select v-model="statusFilter" class="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100" @change="applyFilters">
          <option value="">{{ $t('realty.common.status') }}: {{ $t('realty.common.all') }}</option>
          <option v-for="status in statuses" :key="status" :value="status">{{ $t(`realty.contract.status.${status}`) }}</option>
        </select>
        <label class="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap dark:text-slate-200">
          <input v-model="expiringOnly" type="checkbox" @change="applyFilters" />
          {{ $t('realty.contract.expiring_filter', { days: expiringDays }) }}
        </label>
        <label class="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap dark:text-slate-200">
          <input v-model="showAll" type="checkbox" @change="applyFilters" />
          {{ $t('realty.contract.all_properties') }}
        </label>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center dark:bg-slate-800 dark:border-slate-700">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>

      <!-- Table -->
      <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden dark:bg-slate-800 dark:border-slate-700">
        <div v-if="items.length === 0" class="text-center py-12 px-4 text-gray-600 dark:text-slate-400">
          {{ $t('realty.contract.empty') }}
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-slate-900/50">
              <tr class="text-xs font-semibold text-gray-700 uppercase whitespace-nowrap dark:text-slate-300">
                <th class="px-5 py-3 text-start">{{ $t('realty.contract.columns.number') }}</th>
                <th class="px-5 py-3 text-start">{{ $t('realty.contract.columns.tenant') }}</th>
                <th class="px-5 py-3 text-start">{{ $t('realty.contract.columns.unit') }}</th>
                <th class="px-5 py-3 text-start">{{ $t('realty.contract.columns.property') }}</th>
                <th class="px-5 py-3 text-start">{{ $t('realty.contract.columns.period') }}</th>
                <th class="px-5 py-3 text-start">{{ $t('realty.contract.columns.rent') }}</th>
                <th class="px-5 py-3 text-start">{{ $t('realty.contract.columns.status') }}</th>
                <th class="px-5 py-3 text-center">{{ $t('realty.contract.columns.actions') }}</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200 dark:bg-slate-800 dark:divide-slate-700">
              <tr v-for="row in items" :key="row.id" class="hover:bg-blue-50/30 dark:hover:bg-slate-700/40">
                <td class="px-5 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap dark:text-slate-100">{{ row.contract_number }}</td>
                <td class="px-5 py-4 text-sm text-gray-700 dark:text-slate-200">
                  <div class="font-medium">{{ row.tenant?.name || '-' }}</div>
                  <div v-if="row.tenant?.phone" class="text-xs text-gray-500 dark:text-slate-400" dir="ltr">{{ row.tenant.phone }}</div>
                </td>
                <td class="px-5 py-4 text-sm text-gray-700 whitespace-nowrap dark:text-slate-200">{{ unitText(row.unit) }}</td>
                <td class="px-5 py-4 text-sm text-gray-700 dark:text-slate-200">{{ row.property ? propertyName(row.property) : '-' }}</td>
                <td class="px-5 py-4 text-sm text-gray-700 whitespace-nowrap dark:text-slate-200">
                  <div>{{ ymd(row.start_date) }} → {{ ymd(row.end_date) }}</div>
                  <span
                    v-if="expiryBadge(row)"
                    class="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                    :class="expiryBadge(row).cls"
                  >
                    {{ expiryBadge(row).text }}
                  </span>
                </td>
                <td class="px-5 py-4 text-sm text-gray-700 whitespace-nowrap dark:text-slate-200">
                  <div class="font-semibold">{{ money(row.rent_amount) }}</div>
                  <div class="text-xs text-gray-500 dark:text-slate-400">{{ $t(`realty.contract.frequency.${row.payment_frequency}`) }}</div>
                </td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="statusClass(row.status)">
                    {{ $t(`realty.contract.status.${row.status}`) }}
                  </span>
                </td>
                <td class="px-5 py-4">
                  <div class="flex items-center justify-center gap-1">
                    <button
                      v-for="action in rowActions(row)"
                      :key="action.key"
                      type="button"
                      :title="action.title"
                      :aria-label="action.title"
                      class="p-2 rounded-lg text-gray-600 transition-colors dark:text-slate-300"
                      :class="action.cls"
                      @click="action.run()"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path v-for="(d, i) in action.paths" :key="i" :d="d" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="!loading && pagination.last_page > 1" class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
        <p class="text-sm text-gray-600 dark:text-slate-400">
          {{ $t('realty.common.showing', { from: pagination.from, to: pagination.to, total: pagination.total }) }}
        </p>
        <div class="flex items-center gap-2">
          <button type="button" :disabled="page <= 1" class="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg disabled:opacity-40 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200" @click="goTo(page - 1)">
            {{ $t('realty.common.prev') }}
          </button>
          <span class="px-3 py-1.5 text-sm text-gray-700 dark:text-slate-200">{{ page }} / {{ pagination.last_page }}</span>
          <button type="button" :disabled="page >= pagination.last_page" class="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg disabled:opacity-40 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200" @click="goTo(page + 1)">
            {{ $t('realty.common.next') }}
          </button>
        </div>
      </div>
    </div>

    <input ref="fileInput" type="file" accept="application/pdf,.pdf" class="hidden" @change="onFileSelected" />

    <!-- Modal: create / edit -->
    <div v-if="modal === 'form'" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto dark:bg-slate-800">
        <h3 class="text-lg font-bold text-gray-900 mb-4 dark:text-slate-100">
          {{ editing ? $t('realty.contract.edit') : $t('realty.contract.add') }}
        </h3>
        <form class="space-y-4" @submit.prevent="submitForm">
          <!-- Unit / tenant -->
          <div v-if="editing" class="rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm dark:bg-slate-900/50 dark:border-slate-700">
            <div class="font-semibold text-gray-900 dark:text-slate-100">{{ unitText(current?.unit) }} — {{ current?.tenant?.name }}</div>
            <div class="text-xs text-gray-500 mt-1 dark:text-slate-400">{{ $t('realty.contract.fields.locked_hint') }}</div>
          </div>
          <div v-else>
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">{{ $t('realty.contract.fields.unit') }} *</label>
            <select v-model="form.unit_id" required :class="inputClass" @change="onUnitChange">
              <option value="">{{ $t('realty.contract.fields.select_unit') }}</option>
              <option v-for="unit in eligibleUnits" :key="unit.id" :value="unit.id">{{ unitOptionLabel(unit) }}</option>
            </select>
            <p v-if="!eligibleUnits.length" class="text-xs text-amber-600 mt-1 dark:text-amber-400">{{ $t('realty.contract.fields.no_units') }}</p>
            <p v-if="errors.unit_id" class="text-xs text-red-600 mt-1">{{ errors.unit_id[0] }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">{{ $t('realty.contract.fields.start_date') }} *</label>
              <input v-model="form.start_date" type="date" required :class="inputClass" />
              <p v-if="errors.start_date" class="text-xs text-red-600 mt-1">{{ errors.start_date[0] }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">{{ $t('realty.contract.fields.end_date') }} *</label>
              <input v-model="form.end_date" type="date" required :class="inputClass" />
              <p v-if="errors.end_date" class="text-xs text-red-600 mt-1">{{ errors.end_date[0] }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">{{ $t('realty.contract.fields.rent_amount') }} *</label>
              <input v-model="form.rent_amount" type="number" min="0.01" step="0.01" required :class="inputClass" />
              <p class="text-xs text-gray-500 mt-1 dark:text-slate-400">{{ $t('realty.contract.fields.rent_hint') }}</p>
              <p v-if="errors.rent_amount" class="text-xs text-red-600 mt-1">{{ errors.rent_amount[0] }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">{{ $t('realty.contract.fields.payment_frequency') }} *</label>
              <select v-model="form.payment_frequency" required :class="inputClass">
                <option v-for="frequency in frequencies" :key="frequency" :value="frequency">{{ $t(`realty.contract.frequency.${frequency}`) }}</option>
              </select>
              <p v-if="errors.payment_frequency" class="text-xs text-red-600 mt-1">{{ errors.payment_frequency[0] }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">{{ $t('realty.contract_billing.currency') }} *</label>
              <select v-model="form.currency" required :class="inputClass">
                <option v-for="code in currencies" :key="code" :value="code">{{ code }}</option>
              </select>
              <p class="text-xs text-gray-500 mt-1 dark:text-slate-400">{{ $t('realty.contract_billing.currency_hint') }}</p>
              <p v-if="errors.currency" class="text-xs text-red-600 mt-1">{{ errors.currency[0] }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">{{ $t('realty.contract.fields.payment_day') }}</label>
              <input v-model="form.payment_day" type="number" min="1" max="28" :class="inputClass" />
              <p v-if="errors.payment_day" class="text-xs text-red-600 mt-1">{{ errors.payment_day[0] }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">{{ $t('realty.contract.fields.security_deposit') }}</label>
              <input v-model="form.security_deposit" type="number" min="0" step="0.01" :class="inputClass" />
              <p v-if="errors.security_deposit" class="text-xs text-red-600 mt-1">{{ errors.security_deposit[0] }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">{{ $t('realty.contract.fields.grace_days') }}</label>
              <input v-model="form.grace_days" type="number" min="0" max="60" :class="inputClass" />
              <p v-if="errors.grace_days" class="text-xs text-red-600 mt-1">{{ errors.grace_days[0] }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">{{ $t('realty.contract.fields.annual_increase') }}</label>
              <input v-model="form.annual_increase_percent" type="number" min="0" max="100" step="0.01" :class="inputClass" />
              <p v-if="errors.annual_increase_percent" class="text-xs text-red-600 mt-1">{{ errors.annual_increase_percent[0] }}</p>
            </div>
          </div>

          <div v-if="!editing || current?.status === 'draft'">
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">{{ $t('realty.contract.fields.status') }}</label>
            <select v-model="form.status" :class="inputClass">
              <option value="draft">{{ $t('realty.contract.status.draft') }}</option>
              <option value="active">{{ $t('realty.contract.status.active') }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">{{ $t('realty.contract.fields.notes') }}</label>
            <textarea v-model="form.notes" rows="3" :class="inputClass"></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t dark:border-slate-700">
            <button type="button" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200" @click="closeModal">
              {{ $t('realty.common.cancel') }}
            </button>
            <button type="submit" :disabled="submitting" class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
              {{ submitting ? $t('realty.common.saving') : $t('realty.common.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: contract details -->
    <div v-if="modal === 'view'" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto dark:bg-slate-800">
        <div class="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-slate-100">{{ $t('realty.contract_view.title') }}</h3>
            <p class="text-sm text-gray-500 dark:text-slate-400">{{ current?.contract_number }}</p>
          </div>
          <button type="button" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700" :title="$t('realty.common.cancel')" @click="closeModal">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="detailLoading" class="py-10 text-center">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
        </div>

        <template v-else-if="detail">
          <div class="flex flex-wrap items-center gap-2 mb-5">
            <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="statusClass(detail.status)">
              {{ $t(`realty.contract.status.${detail.status}`) }}
            </span>
            <span v-if="expiryBadge(detail)" class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="expiryBadge(detail).cls">
              {{ expiryBadge(detail).text }}
            </span>
          </div>

          <div v-for="section in detailSections" :key="section.key" class="mb-5">
            <h4 class="text-xs font-bold tracking-wider text-gray-400 uppercase mb-2 dark:text-slate-500">{{ section.title }}</h4>
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 rounded-xl bg-slate-50 border border-gray-100 p-4 dark:bg-slate-900/40 dark:border-slate-700">
              <div v-for="item in section.items" :key="item.label">
                <dt class="text-xs text-gray-500 dark:text-slate-400">{{ item.label }}</dt>
                <dd class="text-sm font-semibold text-gray-900 break-words whitespace-pre-line dark:text-slate-100" :dir="item.ltr ? 'ltr' : undefined" :style="item.ltr ? 'text-align: start' : undefined">{{ item.value ?? '—' }}</dd>
              </div>
            </dl>
          </div>

          <div v-if="detail.renewed_from || (detail.renewals && detail.renewals.length)" class="mb-5">
            <h4 class="text-xs font-bold tracking-wider text-gray-400 uppercase mb-2 dark:text-slate-500">{{ $t('realty.contract_view.sections.history') }}</h4>
            <div class="flex flex-wrap gap-2">
              <button v-if="detail.renewed_from" type="button" class="px-3 py-1.5 text-xs rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300" @click="openView(detail.renewed_from)">
                {{ $t('realty.contract_view.renewed_from') }}: {{ detail.renewed_from.contract_number }}
              </button>
              <button v-for="renewal in detail.renewals" :key="renewal.id" type="button" class="px-3 py-1.5 text-xs rounded-lg bg-blue-50 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300" @click="openView(renewal)">
                {{ $t('realty.contract_view.renewed_by') }}: {{ renewal.contract_number }}
              </button>
            </div>
          </div>

          <div>
            <h4 class="text-xs font-bold tracking-wider text-gray-400 uppercase mb-2 dark:text-slate-500">{{ $t('realty.contract_view.sections.document') }}</h4>
            <div class="rounded-xl border border-gray-200 overflow-hidden dark:border-slate-700">
              <div class="flex flex-wrap items-center justify-between gap-2 p-4">
                <template v-if="detail.has_document">
                  <button type="button" :disabled="previewLoading" class="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50" @click="togglePreview">
                    {{ previewUrl ? $t('realty.contract_view.hide_preview') : $t('realty.contract_view.preview') }}
                  </button>
                  <div class="flex items-center gap-2">
                    <a v-if="previewUrl" :href="previewUrl" target="_blank" rel="noopener" class="px-3 py-1.5 text-xs rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
                      {{ $t('realty.contract_view.open_new_tab') }}
                    </a>
                    <button type="button" class="px-3 py-1.5 text-xs rounded-md bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300" @click="downloadDocument(detail)">
                      {{ $t('realty.contract_view.download') }}
                    </button>
                  </div>
                </template>
                <p v-else class="text-sm text-gray-500 dark:text-slate-400">{{ $t('realty.contract_view.no_document') }}</p>
              </div>
              <iframe v-if="previewUrl" :src="previewUrl" :title="$t('realty.contract_view.sections.document')" class="w-full border-t border-gray-200 dark:border-slate-700" style="height: 70vh"></iframe>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- Modal: invoices schedule -->
    <div v-if="modal === 'schedule'" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto dark:bg-slate-800">
        <div class="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-slate-100">{{ $t('realty.contract_billing.title') }}</h3>
            <p class="text-sm text-gray-500 dark:text-slate-400">{{ current?.contract_number }} — {{ current?.tenant?.name }}</p>
          </div>
          <button type="button" class="px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200" @click="closeModal">
            {{ $t('realty.common.cancel') }}
          </button>
        </div>

        <div v-if="scheduleLoading" class="py-10 text-center">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
        </div>

        <template v-else-if="schedule">
          <p v-if="!schedule.tenant.has_client" class="text-sm rounded-lg p-3 mb-4 border" :class="schedule.tenant.has_email ? 'bg-blue-50 border-blue-100 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300' : 'bg-amber-50 border-amber-100 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300'">
            {{ schedule.tenant.has_email ? $t('realty.contract_billing.client_will_be_created') : $t('realty.contract_billing.email_required') }}
          </p>

          <div class="overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-700">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead class="bg-gray-50 dark:bg-slate-900/50">
                <tr class="text-xs font-semibold text-gray-700 uppercase whitespace-nowrap dark:text-slate-300">
                  <th class="px-4 py-3 text-start">#</th>
                  <th class="px-4 py-3 text-start">{{ $t('realty.contract_billing.period') }}</th>
                  <th class="px-4 py-3 text-start">{{ $t('realty.contract_billing.due_date') }}</th>
                  <th class="px-4 py-3 text-start">{{ $t('realty.contract_billing.amount') }} ({{ schedule.contract.currency }})</th>
                  <th class="px-4 py-3 text-start">{{ $t('realty.contract_billing.invoice') }}</th>
                  <th class="px-4 py-3 text-center"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
                <tr v-for="p in schedule.periods" :key="p.number" class="text-sm text-gray-700 dark:text-slate-200">
                  <td class="px-4 py-3 text-gray-400">{{ p.number }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">{{ p.start }} → {{ p.end }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    {{ p.due_date }}
                    <div v-if="p.invoice_due_date && p.invoice_due_date !== p.due_date" class="text-xs text-gray-500 dark:text-slate-400">{{ $t('realty.contract_billing.with_grace', { date: p.invoice_due_date }) }}</div>
                    <div v-if="!p.invoice && daysUntil(p.due_date) < 0" class="text-xs text-red-600 dark:text-red-400">{{ $t('realty.contract_billing.missed') }}</div>
                  </td>
                  <td class="px-4 py-3 font-semibold whitespace-nowrap">{{ money(p.amount) }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <template v-if="p.invoice">
                      <router-link :to="`/invoices/${p.invoice.id}`" class="text-blue-600 hover:underline dark:text-blue-400">{{ p.invoice.invoice_number }}</router-link>
                      <span class="ms-2 px-2 py-0.5 rounded-full text-xs font-semibold" :class="invoiceStatusClass(p.invoice.status)">{{ $t(`realty.contract_billing.invoice_status.${p.invoice.status}`) }}</span>
                    </template>
                    <span v-else class="text-xs text-gray-400 dark:text-slate-500">{{ $t('realty.contract_billing.not_invoiced') }}</span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <button v-if="!p.invoice && canGenerate" type="button" :disabled="generating !== null" class="px-2.5 py-1 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50" @click="generateInvoice(p)">
                      {{ generating === p.number ? $t('realty.common.saving') : $t('realty.contract_billing.generate') }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </div>
    </div>

    <!-- Modal: renew -->
    <div v-if="modal === 'renew'" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto dark:bg-slate-800">
        <h3 class="text-lg font-bold text-gray-900 mb-1 dark:text-slate-100">{{ $t('realty.contract.renew.title') }}</h3>
        <p class="text-sm text-gray-500 mb-4 dark:text-slate-400">{{ current?.contract_number }} — {{ current?.tenant?.name }}</p>
        <form class="space-y-4" @submit.prevent="submitRenew">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">{{ $t('realty.contract.fields.start_date') }}</label>
            <input v-model="renewForm.start_date" type="date" :class="inputClass" />
            <p class="text-xs text-gray-500 mt-1 dark:text-slate-400">{{ $t('realty.contract.renew.start_hint', { date: renewStartHint }) }}</p>
            <p v-if="errors.start_date" class="text-xs text-red-600 mt-1">{{ errors.start_date[0] }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">{{ $t('realty.contract.fields.end_date') }} *</label>
            <input v-model="renewForm.end_date" type="date" required :class="inputClass" />
            <p v-if="errors.end_date" class="text-xs text-red-600 mt-1">{{ errors.end_date[0] }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">{{ $t('realty.contract.fields.rent_amount') }}</label>
            <input v-model="renewForm.rent_amount" type="number" min="0.01" step="0.01" :class="inputClass" />
            <p class="text-xs text-gray-500 mt-1 dark:text-slate-400">{{ renewRentHint }}</p>
            <p v-if="errors.rent_amount" class="text-xs text-red-600 mt-1">{{ errors.rent_amount[0] }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">{{ $t('realty.contract.fields.notes') }}</label>
            <textarea v-model="renewForm.notes" rows="2" :class="inputClass"></textarea>
          </div>
          <div class="flex justify-end gap-3 pt-3 border-t dark:border-slate-700">
            <button type="button" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200" @click="closeModal">
              {{ $t('realty.common.cancel') }}
            </button>
            <button type="submit" :disabled="submitting" class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
              {{ submitting ? $t('realty.common.saving') : $t('realty.contract.actions.renew') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: terminate -->
    <div v-if="modal === 'terminate'" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 dark:bg-slate-800">
        <h3 class="text-lg font-bold text-gray-900 mb-1 dark:text-slate-100">{{ $t('realty.contract.terminate.title') }}</h3>
        <p class="text-sm text-gray-500 mb-4 dark:text-slate-400">{{ current?.contract_number }} — {{ current?.tenant?.name }}</p>
        <p class="text-sm text-orange-700 bg-orange-50 border border-orange-100 rounded-lg p-3 mb-4 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300">
          {{ $t('realty.contract.terminate.warning') }}
        </p>
        <form class="space-y-4" @submit.prevent="submitTerminate">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1 dark:text-slate-200">{{ $t('realty.contract.terminate.reason') }} *</label>
            <input v-model="terminateReason" type="text" maxlength="255" required :class="inputClass" />
            <p v-if="errors.termination_reason" class="text-xs text-red-600 mt-1">{{ errors.termination_reason[0] }}</p>
          </div>
          <div class="flex justify-end gap-3 pt-3 border-t dark:border-slate-700">
            <button type="button" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200" @click="closeModal">
              {{ $t('realty.common.cancel') }}
            </button>
            <button type="submit" :disabled="submitting" class="px-4 py-2 bg-orange-600 text-white rounded-lg disabled:opacity-50">
              {{ submitting ? $t('realty.common.saving') : $t('realty.contract.actions.terminate') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify'
import contractApi from '@/api/contract'
import unitApi from '@/api/unit'
import { unwrapList } from '@/api/crud'

const STATUSES = ['draft', 'active', 'expired', 'terminated', 'renewed']
const FREQUENCY_MONTHS = { monthly: 1, quarterly: 3, semi_annual: 6, annual: 12 }
const EXPIRING_DAYS = 60

const ICONS = {
  view: [
    'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z',
    'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  ],
  edit: ['M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'],
  renew: ['M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99'],
  terminate: ['M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636'],
  invoices: ['M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z'],
  download: ['M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3'],
  upload: ['M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'],
  remove: ['M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'],
}

const STATUS_CLASSES = {
  draft: 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-200',
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  expired: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  terminated: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  renewed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
}

const emptyForm = () => ({
  unit_id: '',
  tenant_id: '',
  start_date: '',
  end_date: '',
  rent_amount: '',
  payment_frequency: 'monthly',
  currency: 'SAR',
  payment_day: 1,
  security_deposit: 0,
  grace_days: 0,
  annual_increase_percent: '',
  status: 'active',
  notes: '',
})

export default {
  name: 'ContractsIndex',

  data() {
    return {
      items: [],
      pagination: { current_page: 1, last_page: 1, total: 0, from: 0, to: 0 },
      loading: false,
      submitting: false,
      ready: false,
      requestCounter: 0,
      page: 1,
      search: '',
      searchTimer: null,
      statusFilter: '',
      expiringOnly: false,
      showAll: false,
      units: [],
      modal: null,
      editing: false,
      current: null,
      form: emptyForm(),
      renewForm: { start_date: '', end_date: '', rent_amount: '', notes: '' },
      terminateReason: '',
      errors: {},
      uploadTarget: null,
      schedule: null,
      scheduleLoading: false,
      detail: null,
      detailLoading: false,
      previewUrl: null,
      previewLoading: false,
      generating: null,
      currencies: ['SAR', 'KWD', 'AED', 'USD', 'EUR', 'GBP'],
      statuses: STATUSES,
      frequencies: Object.keys(FREQUENCY_MONTHS),
      expiringDays: EXPIRING_DAYS,
    }
  },

  computed: {
    inputClass() {
      return 'w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100 dark:[color-scheme:dark]'
    },

    scopePropertyId() {
      return this.$store.state.propertyScope?.selectedPropertyId ?? null
    },

    canCreate() {
      return this.hasPerm('create_contract')
    },
    canEdit() {
      return this.hasPerm('edit_contract')
    },
    canRenew() {
      return this.hasPerm('renew_contract')
    },
    canTerminate() {
      return this.hasPerm('terminate_contract')
    },
    canDelete() {
      return this.hasPerm('delete_contract')
    },
    canGenerate() {
      return this.hasPerm('create_invoice')
    },

    // أقسام نافذة تفاصيل العقد
    detailSections() {
      const d = this.detail
      if (!d) return []

      const t = (key) => this.$t(key)
      const orNull = (value) => (value === null || value === undefined || value === '' ? null : value)
      const withCurrency = (value) => `${this.money(value)} ${d.currency || ''}`.trim()

      const other = [
        { label: t('realty.contract_view.created_by'), value: orNull(d.creator?.name) },
        { label: t('realty.contract_view.created_at'), value: orNull(this.ymd(d.created_at)) },
      ]
      if (d.status === 'terminated') {
        other.push({ label: t('realty.contract_view.terminated_at'), value: orNull(this.ymd(d.terminated_at)) })
        other.push({ label: t('realty.contract_view.termination_reason'), value: orNull(d.termination_reason) })
      }
      if (d.notes) other.push({ label: t('realty.contract.fields.notes'), value: d.notes })

      return [
        {
          key: 'parties',
          title: t('realty.contract_view.sections.parties'),
          items: [
            { label: t('realty.contract.columns.tenant'), value: orNull(d.tenant?.name) },
            { label: t('realty.contract_view.phone'), value: orNull(d.tenant?.phone), ltr: true },
            { label: t('realty.contract_view.email'), value: orNull(d.tenant?.email), ltr: true },
            { label: t('realty.contract.columns.unit'), value: orNull(this.unitText(d.unit)) },
            { label: t('realty.contract.columns.property'), value: d.property ? this.propertyName(d.property) : null },
          ],
        },
        {
          key: 'period',
          title: t('realty.contract_view.sections.period'),
          items: [
            { label: t('realty.contract.fields.start_date'), value: orNull(this.ymd(d.start_date)) },
            { label: t('realty.contract.fields.end_date'), value: orNull(this.ymd(d.end_date)) },
            { label: t('realty.contract.fields.payment_frequency'), value: t(`realty.contract.frequency.${d.payment_frequency}`) },
            { label: t('realty.contract.fields.payment_day'), value: orNull(d.payment_day) },
            { label: t('realty.contract.fields.grace_days'), value: orNull(d.grace_days) },
          ],
        },
        {
          key: 'financial',
          title: t('realty.contract_view.sections.financial'),
          items: [
            { label: t('realty.contract.fields.rent_amount'), value: withCurrency(d.rent_amount) },
            { label: t('realty.contract.fields.security_deposit'), value: withCurrency(d.security_deposit) },
            {
              label: t('realty.contract.fields.annual_increase'),
              value: orNull(d.annual_increase_percent) === null ? null : `${d.annual_increase_percent}%`,
            },
          ],
        },
        { key: 'other', title: t('realty.contract_view.sections.other'), items: other },
      ]
    },

    // وحدات العقار المختار التي لها مستأجر مسند (شرط إنشاء العقد)
    eligibleUnits() {
      const propertyId = this.scopePropertyId
      return this.units.filter(
        (unit) =>
          unit.is_active &&
          unit.tenant &&
          (!propertyId || String(unit.floor?.property_id) === String(propertyId)),
      )
    },

    renewStartHint() {
      return this.current ? this.addDays(this.ymd(this.current.end_date), 1) : ''
    },

    renewRentHint() {
      if (!this.current) return ''
      const rent = Number(this.current.rent_amount)
      const percent = this.current.annual_increase_percent
      if (percent !== null && percent !== undefined && percent !== '') {
        return this.$t('realty.contract.renew.rent_hint_increase', {
          amount: this.money(rent * (1 + Number(percent) / 100)),
        })
      }
      return this.$t('realty.contract.renew.rent_hint_same', { amount: this.money(rent) })
    },
  },

  watch: {
    search() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.page = 1
        this.fetch()
      }, 350)
    },

    // تغيير العقار من الشريط العلوي
    scopePropertyId() {
      if (!this.ready) return
      this.page = 1
      this.fetch()
    },
  },

  async mounted() {
    // ضمان تحميل عقارات المستخدم (الشريط العلوي مخفي على الجوال)
    try {
      await this.$store.dispatch('propertyScope/fetchMyProperties')
    } catch {
      // الخطأ يظهر من طلب القائمة نفسه
    }
    this.ready = true
    this.fetch()
    this.loadUnits()
  },

  beforeUnmount() {
    clearTimeout(this.searchTimer)
    this.releasePreview()
  },

  methods: {
    hasPerm(permission) {
      if (this.$store.state.auth?.is_admin) return true
      const getter = this.$store.getters['auth/hasPermission']
      return typeof getter === 'function' ? !!getter(permission) : false
    },

    canEditRow(row) {
      return this.canEdit && ['draft', 'active'].includes(row.status)
    },
    canRenewRow(row) {
      return this.canRenew && ['active', 'expired'].includes(row.status) && !row.renewals_count
    },
    canTerminateRow(row) {
      return this.canTerminate && row.status === 'active'
    },
    canDeleteRow(row) {
      return this.canDelete && row.status === 'draft'
    },

    apiError(error) {
      return error?.response?.data?.message || error?.message || this.$t('realty.common.error')
    },

    setErrors(error) {
      const errors = error?.response?.data?.errors
      this.errors = errors && typeof errors === 'object' ? errors : {}
    },

    // ───────── التواريخ والأرقام ─────────
    ymd(value) {
      return value ? String(value).slice(0, 10) : ''
    },

    daysUntil(dateStr) {
      const [y, m, d] = dateStr.split('-').map(Number)
      const target = new Date(y, m - 1, d)
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      return Math.round((target - today) / 86400000)
    },

    addDays(dateStr, days) {
      if (!dateStr) return ''
      const [y, m, d] = dateStr.split('-').map(Number)
      const date = new Date(y, m - 1, d + days)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    },

    money(value) {
      return Number(value ?? 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    },

    propertyName(property) {
      return this.$i18n.locale === 'ar' ? property.name : property.name_en || property.name
    },

    unitText(unit) {
      if (!unit) return '-'
      return unit.floor?.name ? `${unit.floor.name} — ${unit.name}` : unit.name
    },

    unitOptionLabel(unit) {
      return `${this.unitText(unit)} (${unit.tenant?.name})`
    },

    statusClass(status) {
      return STATUS_CLASSES[status] || STATUS_CLASSES.draft
    },

    expiryBadge(row) {
      if (row.status !== 'active') return null
      const days = this.daysUntil(this.ymd(row.end_date))

      if (days < 0) {
        return { text: this.$t('realty.contract.expiry.ended_ago', { days: Math.abs(days) }), cls: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }
      }
      if (days === 0) {
        return { text: this.$t('realty.contract.expiry.today'), cls: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }
      }
      if (days <= 30) {
        return { text: this.$t('realty.contract.expiry.days_left', { days }), cls: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }
      }
      if (days <= 60) {
        return { text: this.$t('realty.contract.expiry.days_left', { days }), cls: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' }
      }
      if (days <= 90) {
        return { text: this.$t('realty.contract.expiry.days_left', { days }), cls: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' }
      }
      return null
    },

    // ───────── التحميل ─────────
    async fetch() {
      const requestId = ++this.requestCounter
      this.loading = true

      try {
        const params = { page: this.page, per_page: 10 }
        if (this.search.trim()) params.search = this.search.trim()
        if (this.statusFilter) params.status = this.statusFilter
        if (this.expiringOnly) params.expiring_within = this.expiringDays
        if (this.showAll) params.all = 1

        const response = await contractApi.getAll(params)
        if (requestId !== this.requestCounter) return

        const payload = response.data?.data || {}
        this.items = payload.data || []
        this.pagination = {
          current_page: payload.current_page || 1,
          last_page: payload.last_page || 1,
          total: payload.total || 0,
          from: payload.from || 0,
          to: payload.to || 0,
        }
      } catch (error) {
        if (requestId !== this.requestCounter) return
        this.items = []
        toast.error(this.apiError(error))
      } finally {
        if (requestId === this.requestCounter) this.loading = false
      }
    },

    async loadUnits() {
      try {
        const { items } = unwrapList(await unitApi.getAll({ per_page: 100 }))
        this.units = items
      } catch {
        // بدون صلاحية عرض الوحدات تبقى القائمة فارغة وتظهر رسالة التنبيه في النموذج
        this.units = []
      }
    },

    applyFilters() {
      this.page = 1
      this.fetch()
    },

    goTo(page) {
      if (page < 1 || page > this.pagination.last_page) return
      this.page = page
      this.fetch()
    },

    // ───────── إنشاء وتعديل ─────────
    openCreate() {
      this.editing = false
      this.current = null
      this.errors = {}
      this.form = emptyForm()
      this.modal = 'form'
    },

    openEdit(row) {
      this.editing = true
      this.current = row
      this.errors = {}
      this.form = {
        unit_id: row.unit_id,
        tenant_id: row.tenant_id,
        start_date: this.ymd(row.start_date),
        end_date: this.ymd(row.end_date),
        rent_amount: row.rent_amount,
        payment_frequency: row.payment_frequency,
        currency: row.currency || 'SAR',
        payment_day: row.payment_day,
        security_deposit: row.security_deposit,
        grace_days: row.grace_days,
        annual_increase_percent: row.annual_increase_percent ?? '',
        status: row.status,
        notes: row.notes || '',
      }
      this.modal = 'form'
    },

    onUnitChange() {
      const unit = this.eligibleUnits.find((item) => String(item.id) === String(this.form.unit_id))
      this.form.tenant_id = unit?.tenant?.id ?? ''

      // اقتراح الإيجار من إيجار الوحدة الشهري × أشهر دورة الدفع
      if (unit && !this.form.rent_amount && unit.monthly_rent) {
        const months = FREQUENCY_MONTHS[this.form.payment_frequency] || 1
        this.form.rent_amount = Number(unit.monthly_rent) * months
      }
    },

    async submitForm() {
      this.errors = {}
      const form = this.form

      if (!this.editing && !form.unit_id) {
        this.errors = { unit_id: [this.$t('realty.contract.errors.unit_required')] }
        return
      }
      if (form.start_date && form.end_date && form.end_date <= form.start_date) {
        this.errors = { end_date: [this.$t('realty.contract.errors.dates')] }
        return
      }

      const payload = {
        start_date: form.start_date,
        end_date: form.end_date,
        rent_amount: Number(form.rent_amount),
        payment_frequency: form.payment_frequency,
        currency: form.currency,
        payment_day: Number(form.payment_day) || 1,
        security_deposit: Number(form.security_deposit) || 0,
        grace_days: Number(form.grace_days) || 0,
        annual_increase_percent:
          form.annual_increase_percent === '' || form.annual_increase_percent === null
            ? null
            : Number(form.annual_increase_percent),
        notes: form.notes || null,
      }

      if (!this.editing) {
        payload.unit_id = form.unit_id
        payload.tenant_id = form.tenant_id
        payload.status = form.status
      } else if (this.current.status === 'draft') {
        payload.status = form.status
      }

      this.submitting = true
      try {
        const response = this.editing
          ? await contractApi.update(this.current.id, payload)
          : await contractApi.create(payload)

        toast.success(response.data?.message)
        this.closeModal()
        this.fetch()
      } catch (error) {
        this.setErrors(error)
        toast.error(this.apiError(error))
      } finally {
        this.submitting = false
      }
    },

    // ───────── تجديد وإنهاء وحذف ─────────
    openRenew(row) {
      this.current = row
      this.errors = {}
      this.renewForm = { start_date: '', end_date: '', rent_amount: '', notes: '' }
      this.modal = 'renew'
    },

    async submitRenew() {
      this.errors = {}
      const form = this.renewForm

      if (!form.end_date) {
        this.errors = { end_date: [this.$t('realty.contract.errors.end_required')] }
        return
      }

      const payload = { end_date: form.end_date }
      if (form.start_date) payload.start_date = form.start_date
      if (form.rent_amount !== '' && form.rent_amount !== null) payload.rent_amount = Number(form.rent_amount)
      if (form.notes) payload.notes = form.notes

      this.submitting = true
      try {
        const response = await contractApi.renew(this.current.id, payload)
        toast.success(response.data?.message)
        this.closeModal()
        this.fetch()
      } catch (error) {
        this.setErrors(error)
        toast.error(this.apiError(error))
      } finally {
        this.submitting = false
      }
    },

    openTerminate(row) {
      this.current = row
      this.errors = {}
      this.terminateReason = ''
      this.modal = 'terminate'
    },

    async submitTerminate() {
      this.errors = {}

      if (!this.terminateReason.trim()) {
        this.errors = { termination_reason: [this.$t('realty.contract.errors.reason_required')] }
        return
      }

      this.submitting = true
      try {
        const response = await contractApi.terminate(this.current.id, {
          termination_reason: this.terminateReason.trim(),
        })
        toast.success(response.data?.message)
        this.closeModal()
        this.fetch()
      } catch (error) {
        this.setErrors(error)
        toast.error(this.apiError(error))
      } finally {
        this.submitting = false
      }
    },

    async remove(row) {
      const result = await this.$swal.fire({
        title: this.$t('realty.contract.delete.title'),
        text: this.$t('realty.contract.delete.text', { number: row.contract_number }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: this.$t('realty.common.delete'),
        cancelButtonText: this.$t('realty.common.cancel'),
      })
      if (!result.isConfirmed) return

      try {
        const response = await contractApi.remove(row.id)
        toast.success(response.data?.message)
        if (this.items.length === 1 && this.page > 1) this.page -= 1
        this.fetch()
      } catch (error) {
        toast.error(this.apiError(error))
      }
    },

    // ───────── أزرار الصف (أيقونات) ─────────
    rowActions(row) {
      const hover = 'dark:hover:bg-slate-700'
      const actions = [
        {
          key: 'view',
          title: this.$t('realty.contract_view.action'),
          paths: ICONS.view,
          cls: `hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 ${hover}`,
          run: () => this.openView(row),
        },
      ]

      if (this.canEditRow(row)) {
        actions.push({
          key: 'edit',
          title: this.$t('realty.contract.actions.edit'),
          paths: ICONS.edit,
          cls: `hover:text-green-600 hover:bg-green-50 dark:hover:text-green-400 ${hover}`,
          run: () => this.openEdit(row),
        })
      }
      if (this.canRenewRow(row)) {
        actions.push({
          key: 'renew',
          title: this.$t('realty.contract.actions.renew'),
          paths: ICONS.renew,
          cls: `hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 ${hover}`,
          run: () => this.openRenew(row),
        })
      }
      if (this.canTerminateRow(row)) {
        actions.push({
          key: 'terminate',
          title: this.$t('realty.contract.actions.terminate'),
          paths: ICONS.terminate,
          cls: `hover:text-orange-600 hover:bg-orange-50 dark:hover:text-orange-400 ${hover}`,
          run: () => this.openTerminate(row),
        })
      }
      if (row.status !== 'draft') {
        actions.push({
          key: 'invoices',
          title: this.$t('realty.contract_billing.invoices'),
          paths: ICONS.invoices,
          cls: `hover:text-purple-600 hover:bg-purple-50 dark:hover:text-purple-400 ${hover}`,
          run: () => this.openSchedule(row),
        })
      }
      if (row.has_document) {
        actions.push({
          key: 'download',
          title: this.$t('realty.contract.actions.download'),
          paths: ICONS.download,
          cls: `hover:text-teal-600 hover:bg-teal-50 dark:hover:text-teal-400 ${hover}`,
          run: () => this.downloadDocument(row),
        })
      }
      if (this.canEdit) {
        actions.push({
          key: 'upload',
          title: row.has_document ? this.$t('realty.contract.actions.replace') : this.$t('realty.contract.actions.upload'),
          paths: ICONS.upload,
          cls: `hover:text-gray-900 hover:bg-gray-100 dark:hover:text-slate-100 ${hover}`,
          run: () => this.pickDocument(row),
        })
      }
      if (this.canDeleteRow(row)) {
        actions.push({
          key: 'remove',
          title: this.$t('realty.contract.actions.delete'),
          paths: ICONS.remove,
          cls: `hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 ${hover}`,
          run: () => this.remove(row),
        })
      }

      return actions
    },

    // ───────── عرض العقد ─────────
    async openView(row) {
      this.releasePreview()
      this.current = row
      this.detail = null
      this.modal = 'view'
      await this.loadDetail(row.id)
    },

    async loadDetail(id) {
      this.detailLoading = true

      try {
        const response = await contractApi.getOne(id)
        this.detail = response.data?.data || null
      } catch (error) {
        toast.error(this.apiError(error))
        this.closeModal()
      } finally {
        this.detailLoading = false
      }
    },

    async togglePreview() {
      if (this.previewUrl) {
        this.releasePreview()
        return
      }
      if (!this.detail) return

      this.previewLoading = true

      try {
        const response = await contractApi.downloadDocument(this.detail.id)
        this.previewUrl = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
      } catch {
        toast.error(this.$t('realty.contract.document_error'))
      } finally {
        this.previewLoading = false
      }
    },

    releasePreview() {
      if (this.previewUrl) URL.revokeObjectURL(this.previewUrl)
      this.previewUrl = null
    },

    // ───────── فوترة العقد ─────────
    async openSchedule(row) {
      this.current = row
      this.schedule = null
      this.modal = 'schedule'
      await this.loadSchedule()
    },

    async loadSchedule() {
      if (!this.current) return
      this.scheduleLoading = true

      try {
        const response = await contractApi.schedule(this.current.id)
        this.schedule = response.data?.data || null
      } catch (error) {
        toast.error(this.apiError(error))
        this.closeModal()
      } finally {
        this.scheduleLoading = false
      }
    },

    async generateInvoice(period) {
      const needsClient = this.schedule && !this.schedule.tenant.has_client
      const result = await this.$swal.fire({
        title: this.$t('realty.contract_billing.confirm_title'),
        text:
          this.$t('realty.contract_billing.confirm_text', {
            start: period.start,
            end: period.end,
            amount: this.money(period.amount),
            currency: this.schedule.contract.currency,
          }) + (needsClient ? ' ' + this.$t('realty.contract_billing.confirm_client') : ''),
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: this.$t('realty.contract_billing.generate'),
        cancelButtonText: this.$t('realty.common.cancel'),
      })
      if (!result.isConfirmed) return

      this.generating = period.number
      try {
        const response = await contractApi.generateInvoice(this.current.id, period.number)
        toast.success(response.data?.message)
        await this.loadSchedule()
      } catch (error) {
        toast.error(this.apiError(error))
      } finally {
        this.generating = null
      }
    },

    invoiceStatusClass(status) {
      const classes = {
        draft: 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-200',
        sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      }
      return classes[status] || classes.draft
    },

    closeModal() {
      this.releasePreview()
      this.modal = null
      this.current = null
      this.schedule = null
      this.generating = null
      this.detail = null
    },

    // ───────── المستند ─────────
    pickDocument(row) {
      this.uploadTarget = row
      this.$refs.fileInput.click()
    },

    async onFileSelected(event) {
      const file = event.target.files?.[0]
      event.target.value = ''
      const target = this.uploadTarget
      this.uploadTarget = null

      if (!file || !target) return

      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
      if (!isPdf || file.size > 10 * 1024 * 1024) {
        toast.error(this.$t('realty.contract.errors.invalid_file'))
        return
      }

      try {
        const response = await contractApi.uploadDocument(target.id, file)
        toast.success(response.data?.message)
        this.fetch()
      } catch (error) {
        toast.error(this.apiError(error))
      }
    },

    async downloadDocument(row) {
      try {
        const response = await contractApi.downloadDocument(row.id)
        const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
        const link = document.createElement('a')
        link.href = url
        link.download = `${row.contract_number}.pdf`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
      } catch {
        toast.error(this.$t('realty.contract.document_error'))
      }
    },
  },
}
</script>
