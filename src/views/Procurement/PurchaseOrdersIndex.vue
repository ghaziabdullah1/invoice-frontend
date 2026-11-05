<template>
  <div class="min-h-screen bg-gray-50 py-6 md:py-8 dark:bg-slate-900">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100">{{ $t('procurement.po.title') }}
          </h1>
          <p class="text-gray-600 text-sm mt-1 dark:text-slate-400">{{ $t('procurement.po.subtitle') }}</p>
        </div>
        <button v-if="canCreate" type="button"
          class="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
          @click="openCreate">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ $t('procurement.po.add') }}
        </button>
      </div>

      <!-- Status chips -->
      <div class="flex flex-wrap gap-2 mb-3">
        <button v-for="chip in statusChips" :key="chip.key" type="button"
          class="px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
          :class="statusFilter === chip.key
            ? 'bg-blue-900 text-white border-blue-900'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600'" @click="setStatus(chip.key)">
          {{ chip.label }} <span class="opacity-70">({{ chip.count }})</span>
        </button>
      </div>
      <p v-if="openValueText" class="text-sm text-gray-600 dark:text-slate-400 mb-4">
        {{ $t('procurement.po.open_value') }}:
        <span class="font-semibold text-gray-900 dark:text-slate-100">{{ openValueText }}</span>
      </p>

      <!-- Filters -->
      <div
        class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4 flex flex-col lg:flex-row gap-3 lg:items-center dark:bg-slate-800 dark:border-slate-700">
        <input v-model="search" type="search" :placeholder="$t('procurement.po.search_placeholder')" :class="inputClass"
          class="flex-1" />
        <select v-model="supplierFilter" :class="inputClass" class="lg:w-56" @change="applyFilters">
          <option value="">{{ $t('procurement.po.all_suppliers') }}</option>
          <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ localName(s) }}</option>
        </select>
        <input v-model="fromDate" type="date" :title="$t('procurement.po.from')" :class="inputClass" class="lg:w-40"
          @change="applyFilters" />
        <input v-model="toDate" type="date" :title="$t('procurement.po.to')" :class="inputClass" class="lg:w-40"
          @change="applyFilters" />
        <button v-if="hasFilters" type="button"
          class="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg dark:bg-slate-700 dark:text-slate-200"
          @click="clearFilters">
          {{ $t('procurement.po.clear') }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading"
        class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center dark:bg-slate-800 dark:border-slate-700">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>

      <!-- Table -->
      <div v-else
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden dark:bg-slate-800 dark:border-slate-700">
        <div v-if="items.length === 0" class="text-center py-12 px-4 text-gray-600 dark:text-slate-400">
          {{ $t('procurement.po.empty') }}
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-slate-900/50">
              <tr class="text-xs font-semibold text-gray-700 uppercase whitespace-nowrap dark:text-slate-300">
                <th class="px-5 py-3 text-start">{{ $t('procurement.po.number') }}</th>
                <th class="px-5 py-3 text-start">{{ $t('procurement.po.supplier') }}</th>
                <th class="px-5 py-3 text-start">{{ $t('procurement.po.branch') }}</th>
                <th class="px-5 py-3 text-start">{{ $t('procurement.po.order_date') }}</th>
                <th class="px-5 py-3 text-start">{{ $t('procurement.po.expected_date') }}</th>
                <th class="px-5 py-3 text-end">{{ $t('procurement.po.total') }}</th>
                <th class="px-5 py-3 text-center">{{ $t('procurement.po.status') }}</th>
                <th class="px-5 py-3 text-center">{{ $t('realty.common.actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
              <tr v-for="row in items" :key="row.id"
                class="hover:bg-blue-50/30 cursor-pointer dark:hover:bg-slate-700/40" @click="openView(row)">
                <td class="px-5 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap dark:text-slate-100">{{
                  row.po_number }}</td>
                <td class="px-5 py-3 text-sm text-gray-700 dark:text-slate-300">
                  {{ row.supplier ? localName(row.supplier) : '-' }}
                  <div v-if="row.supplier" class="text-xs text-gray-500 dark:text-slate-400">{{
                    row.supplier.supplier_code }}</div>
                </td>
                <td class="px-5 py-3 text-sm text-gray-700 whitespace-nowrap dark:text-slate-300">{{ row.branch ?
                  localName(row.branch) : '-' }}</td>
                <td class="px-5 py-3 text-sm text-gray-700 whitespace-nowrap dark:text-slate-300">{{ ymd(row.order_date)
                  }}</td>
                <td class="px-5 py-3 text-sm text-gray-700 whitespace-nowrap dark:text-slate-300">{{
                  ymd(row.expected_date) }}</td>
                <td
                  class="px-5 py-3 text-sm font-semibold text-gray-900 text-end whitespace-nowrap dark:text-slate-100">
                  {{ money(row.total) }} {{ row.currency }}</td>
                <td class="px-5 py-3 text-center">
                  <span class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                    :class="statusClass(row.status)">{{ statusLabel(row.status) }}</span>
                </td>
                <td class="px-5 py-3 text-center">
                  <button type="button"
                    class="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg dark:bg-blue-500/10 dark:text-blue-300"
                    @click.stop="openView(row)">
                    {{ $t('procurement.po.view') }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Pagination :pagination="pagination" @change="goTo" />
    </div>

    <!-- ============================ Create / Edit modal ============================ -->
    <div v-if="showForm"
      class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-5xl max-h-[92vh] overflow-y-auto p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4 dark:text-slate-100">
          {{ editingId ? $t('procurement.po.edit') : $t('procurement.po.add') }}
        </h3>

        <div v-if="formErrors.length"
          class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          <p class="font-semibold mb-1">{{ $t('procurement.form.errors') }}</p>
          <ul class="list-disc ms-5">
            <li v-for="(m, i) in formErrors" :key="i">{{ m }}</li>
          </ul>
        </div>

        <form class="space-y-5" @submit.prevent="submitForm">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2">
              <label :class="labelClass">{{ $t('procurement.po.supplier') }} *</label>
              <select v-model="form.supplier_id" :class="inputClass" required @change="onSupplierChange">
                <option value="">{{ $t('procurement.form.select_supplier') }}</option>
                <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ localName(s) }} ({{ s.supplier_code }})
                </option>
              </select>
            </div>
            <div>
              <label :class="labelClass">{{ $t('procurement.po.currency') }}</label>
              <select v-model="form.currency" :class="inputClass">
                <option v-for="c in currencies" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <div>
              <label :class="labelClass">{{ $t('procurement.po.order_date') }} *</label>
              <input v-model="form.order_date" type="date" required :class="inputClass" />
            </div>
            <div>
              <label :class="labelClass">{{ $t('procurement.po.expected_date') }}</label>
              <input v-model="form.expected_date" type="date" :min="form.order_date" :class="inputClass" />
            </div>
            <div>
              <label :class="labelClass">{{ $t('procurement.po.payment_terms') }}</label>
              <input v-model="form.payment_terms_days" type="number" min="0" max="365" step="1" :class="inputClass" />
            </div>

            <!-- ✅ [FIX #5] حقل الإدارة المستفيدة مع حالة تحميل + رسالة فراغ -->
            <div class="md:col-span-3">
              <label :class="labelClass">{{ $t('procurement.po.beneficiary_department') }} *</label>
              <select v-model="form.beneficiary_department_id" :class="inputClass" :disabled="departmentsLoading"
                required>
                <option value="">
                  {{ departmentsLoading
                    ? ($t('realty.common.loading') || '...')
                    : $t('procurement.po.select_beneficiary') }}
                </option>
                <option v-for="d in departments" :key="d.id" :value="d.id">
                    {{ deptLabel(d) }}
                  </option>
              </select>
              <p v-if="!departmentsLoading && departments.length === 0"
                class="text-xs text-amber-600 mt-1 dark:text-amber-400">
                ⚠️ {{ $t('procurement.po.no_departments') || 'لا توجد إدارات متاحة' }}
              </p>
            </div>
          </div>

          <!-- Items -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-semibold text-gray-900 dark:text-slate-100">{{ $t('procurement.form.items') }}</h4>
              <button type="button"
                class="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg dark:bg-blue-500/10 dark:text-blue-300"
                @click="addItem">
                + {{ $t('procurement.form.add_item') }}
              </button>
            </div>
            <div class="overflow-x-auto border border-gray-200 rounded-xl dark:border-slate-700">
              <table class="min-w-full text-sm">
                <thead class="bg-gray-50 dark:bg-slate-900/50">
                  <tr class="text-xs font-semibold text-gray-700 dark:text-slate-300">
                    <th class="px-2 py-2 text-start">#</th>
                    <th class="px-2 py-2 text-start">{{ $t('procurement.form.description') }} *</th>
                    <th class="px-2 py-2 text-start">{{ $t('procurement.form.item_code') }}</th>
                    <th class="px-2 py-2 text-start">{{ $t('procurement.form.unit') }}</th>
                    <th class="px-2 py-2 text-start">{{ $t('procurement.form.quantity') }} *</th>
                    <th class="px-2 py-2 text-start">{{ $t('procurement.form.unit_price') }} *</th>
                    <th class="px-2 py-2 text-start">{{ $t('procurement.form.tax_rate') }}</th>
                    <th class="px-2 py-2 text-end">{{ $t('procurement.form.line_total') }}</th>
                    <th class="px-2 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in form.items" :key="idx"
                    class="border-t border-gray-200 dark:border-slate-700">
                    <td class="px-2 py-2 text-gray-500 dark:text-slate-400">{{ idx + 1 }}</td>
                    <td class="px-2 py-2"><input v-model="item.description" type="text" style="min-width: 14rem"
                        :class="cellClass" /></td>
                    <td class="px-2 py-2"><input v-model="item.item_code" type="text" style="min-width: 6rem"
                        :class="cellClass" /></td>
                    <td class="px-2 py-2"><input v-model="item.unit" type="text" style="min-width: 5rem"
                        :class="cellClass" /></td>
                    <td class="px-2 py-2"><input v-model="item.quantity" type="number" min="0.001" step="0.001"
                        style="min-width: 6rem" :class="cellClass" /></td>
                    <td class="px-2 py-2"><input v-model="item.unit_price" type="number" min="0" step="0.01"
                        style="min-width: 7rem" :class="cellClass" /></td>
                    <td class="px-2 py-2"><input v-model="item.tax_rate" type="number" min="0" max="100" step="0.01"
                        style="min-width: 5rem" :class="cellClass" /></td>
                    <td class="px-2 py-2 text-end font-medium text-gray-900 whitespace-nowrap dark:text-slate-100">{{
                      money(lineCalc[idx].total) }}</td>
                    <td class="px-2 py-2 text-center">
                      <button type="button"
                        class="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-30"
                        :disabled="form.items.length === 1" :title="$t('procurement.form.remove')"
                        @click="removeItem(idx)">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Totals + notes -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label :class="labelClass">{{ $t('procurement.po.notes') }}</label>
              <textarea v-model="form.notes" rows="4" :class="inputClass"></textarea>
            </div>
            <div class="rounded-xl border border-gray-200 p-4 space-y-2 text-sm dark:border-slate-700">
              <div class="flex justify-between text-gray-700 dark:text-slate-300">
                <span>{{ $t('procurement.form.subtotal') }}</span><span>{{ money(formTotals.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-gray-700 dark:text-slate-300">
                <span>{{ $t('procurement.form.tax') }}</span><span>{{ money(formTotals.tax) }}</span>
              </div>
              <div class="flex justify-between items-center gap-3 text-gray-700 dark:text-slate-300">
                <span>{{ $t('procurement.form.discount') }}</span>
                <input v-model="form.discount_amount" type="number" min="0" step="0.01" :class="cellClass"
                  style="max-width: 9rem" />
              </div>
              <div
                class="flex justify-between pt-2 border-t border-gray-200 font-bold text-gray-900 dark:border-slate-700 dark:text-slate-100">
                <span>{{ $t('procurement.form.total') }}</span><span>{{ money(formTotals.total) }} {{ form.currency
                  }}</span>
              </div>
            </div>
          </div>

          <p class="text-xs text-gray-500 dark:text-slate-400">{{ $t('procurement.form.draft_hint') }}</p>

          <div class="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-slate-700">
            <button type="button"
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
              @click="showForm = false">
              {{ $t('realty.common.cancel') }}
            </button>
            <button type="submit" :disabled="submitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
              {{ submitting ? $t('realty.common.saving') : $t('realty.common.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ============================ Details modal ============================ -->
    <div v-if="showDetail"
      class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-5xl max-h-[92vh] overflow-y-auto p-6">
        <div v-if="detailLoading || !detail || !detail.items" class="py-16 text-center">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600">
          </div>
          <div class="mt-4">
            <button type="button"
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
              @click="closeDetail">
              {{ $t('procurement.actions.close') }}
            </button>
          </div>
        </div>

        <template v-else>
          <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-slate-100">{{ detail.po_number }}</h3>
              <p class="text-sm text-gray-500 dark:text-slate-400">{{ detail.supplier ? localName(detail.supplier) : '-'
                }}</p>
            </div>
            <span class="px-4 py-1.5 rounded-full text-sm font-semibold" :class="statusClass(detail.status)">{{
              statusLabel(detail.status) }}</span>
          </div>

          <div v-if="detail.status === 'rejected' && detail.rejection_reason"
            class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
            <span class="font-semibold">{{ $t('procurement.detail.rejection_reason') }}:</span> {{
              detail.rejection_reason }}
          </div>
          <div v-if="detail.status === 'cancelled' && detail.cancellation_reason"
            class="mb-4 p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 dark:bg-slate-900/40 dark:border-slate-700 dark:text-slate-300">
            <span class="font-semibold">{{ $t('procurement.detail.cancellation_reason') }}:</span> {{
              detail.cancellation_reason }}
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-5">
            <div v-for="info in detailInfo" :key="info.label">
              <p class="text-xs text-gray-500 dark:text-slate-400">{{ info.label }}</p>
              <p class="font-medium text-gray-900 dark:text-slate-100">{{ info.value }}</p>
            </div>
          </div>

          <h4 class="font-semibold text-gray-900 mb-2 dark:text-slate-100">{{ $t('procurement.detail.items_title') }}
          </h4>
          <div class="overflow-x-auto border border-gray-200 rounded-xl mb-4 dark:border-slate-700">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 dark:bg-slate-900/50">
                <tr class="text-xs font-semibold text-gray-700 whitespace-nowrap dark:text-slate-300">
                  <th class="px-3 py-2 text-start">#</th>
                  <th class="px-3 py-2 text-start">{{ $t('procurement.form.description') }}</th>
                  <th class="px-3 py-2 text-start">{{ $t('procurement.form.unit') }}</th>
                  <th class="px-3 py-2 text-end">{{ $t('procurement.detail.ordered') }}</th>
                  <th class="px-3 py-2 text-end">{{ $t('procurement.detail.received') }}</th>
                  <th class="px-3 py-2 text-end">{{ $t('procurement.detail.remaining') }}</th>
                  <th class="px-3 py-2 text-end">{{ $t('procurement.form.unit_price') }}</th>
                  <th class="px-3 py-2 text-end">{{ $t('procurement.form.tax_rate') }}</th>
                  <th class="px-3 py-2 text-end">{{ $t('procurement.form.line_total') }}</th>
                </tr>
              </thead>
              <tbody class="text-gray-800 dark:text-slate-200">
                <tr v-for="(it, idx) in detail.items" :key="it.id"
                  class="border-t border-gray-200 dark:border-slate-700">
                  <td class="px-3 py-2">{{ idx + 1 }}</td>
                  <td class="px-3 py-2">
                    {{ it.description }}
                    <div v-if="it.item_code" class="text-xs text-gray-500 dark:text-slate-400">{{ it.item_code }}</div>
                  </td>
                  <td class="px-3 py-2">{{ it.unit || '-' }}</td>
                  <td class="px-3 py-2 text-end">{{ qty(it.quantity) }}</td>
                  <td class="px-3 py-2 text-end">{{ qty(it.received_quantity) }}</td>
                  <td class="px-3 py-2 text-end font-medium">{{ qty(it.remaining_quantity) }}</td>
                  <td class="px-3 py-2 text-end">{{ money(it.unit_price) }}</td>
                  <td class="px-3 py-2 text-end">{{ money(it.tax_rate) }}%</td>
                  <td class="px-3 py-2 text-end font-medium">{{ money(it.total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex flex-col md:flex-row gap-4 mb-5">
            <div class="flex-1 text-sm text-gray-700 dark:text-slate-300">
              <p v-if="detail.notes"><span class="font-semibold">{{ $t('procurement.po.notes') }}:</span> {{
                detail.notes }}</p>
            </div>
            <div class="md:w-72 rounded-xl border border-gray-200 p-4 space-y-1.5 text-sm dark:border-slate-700">
              <div class="flex justify-between text-gray-700 dark:text-slate-300"><span>{{
                $t('procurement.form.subtotal') }}</span><span>{{ money(detail.subtotal) }}</span></div>
              <div class="flex justify-between text-gray-700 dark:text-slate-300"><span>{{ $t('procurement.form.tax')
                  }}</span><span>{{ money(detail.tax_amount) }}</span></div>
              <div class="flex justify-between text-gray-700 dark:text-slate-300"><span>{{
                $t('procurement.form.discount') }}</span><span>{{ money(detail.discount_amount) }}</span></div>
              <div
                class="flex justify-between pt-2 border-t border-gray-200 font-bold text-gray-900 dark:border-slate-700 dark:text-slate-100">
                <span>{{ $t('procurement.form.total') }}</span><span>{{ money(detail.total) }} {{ detail.currency
                  }}</span>
              </div>
            </div>
          </div>

          <h4 class="font-semibold text-gray-900 mb-2 dark:text-slate-100">{{ $t('procurement.detail.receipts') }}</h4>
          <p v-if="!detail.receipts || detail.receipts.length === 0"
            class="text-sm text-gray-500 mb-4 dark:text-slate-400">{{ $t('procurement.detail.no_receipts') }}</p>
          <div v-else class="space-y-2 mb-4">
            <div v-for="r in detail.receipts" :key="r.id"
              class="rounded-xl border border-gray-200 p-3 text-sm dark:border-slate-700">
              <div class="flex flex-wrap justify-between gap-2 font-medium text-gray-900 dark:text-slate-100">
                <span>{{ r.receipt_number }}</span>
                <span class="text-gray-500 dark:text-slate-400">{{ ymd(r.received_date) }}<template v-if="r.receiver"> •
                    {{ r.receiver.name }}</template></span>
              </div>
              <ul class="mt-1 text-gray-700 dark:text-slate-300">
                <li v-for="ri in r.items" :key="ri.id">{{ itemDescription(ri.purchase_order_item_id) }} — {{
                  qty(ri.quantity) }}</li>
              </ul>
              <p v-if="r.notes" class="mt-1 text-xs text-gray-500 dark:text-slate-400">{{ r.notes }}</p>
            </div>
          </div>

          <!-- Attachments -->
          <div class="mb-5">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-semibold text-gray-900 dark:text-slate-100">
                {{ $t('procurement.attachments.title') }}
                <span v-if="detail.attachments?.length" class="text-xs text-gray-500 font-normal">({{
                  detail.attachments.length
                  }})</span>
              </h4>
              <label v-if="canEdit"
                class="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg dark:bg-blue-500/10 dark:text-blue-300 cursor-pointer inline-flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                {{ $t('procurement.attachments.upload') }}
                <input type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png,.docx" @change="onAttachmentSelected"
                  :disabled="uploadingAttachment" />
              </label>
            </div>

            <p v-if="attachmentError" class="text-xs text-red-600 mb-2">{{ attachmentError }}</p>

            <div v-if="!detail.attachments || detail.attachments.length === 0"
              class="text-sm text-gray-500 dark:text-slate-400 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 p-4 text-center">
              {{ $t('procurement.attachments.empty') }}
            </div>
            <ul v-else class="space-y-2">
              <li v-for="att in detail.attachments" :key="att.id"
                class="flex items-center justify-between gap-3 rounded-xl border border-gray-200 dark:border-slate-700 p-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 flex-shrink-0">
                    <svg class="w-5 h-5 text-gray-600 dark:text-slate-300" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">{{ att.original_name }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-slate-400">
                      {{ (att.size / 1024).toFixed(0) }} KB
                      <span v-if="att.uploader"> • {{ att.uploader.name }}</span>
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-1 flex-shrink-0">
                  <a :href="att.url" target="_blank" download
                    class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/30"
                    :title="$t('procurement.attachments.download')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </a>
                  <button v-if="canEdit" type="button" @click="removeAttachment(att)"
                    class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg dark:text-slate-300 dark:hover:text-red-400 dark:hover:bg-red-900/30"
                    :title="$t('procurement.attachments.delete')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </li>
            </ul>
          </div>

          <ApprovalChain :approvals="detail.approvals" />

          <!-- Signatures -->
          <div class="mb-5">
            <h4 class="font-semibold text-gray-900 dark:text-slate-100 mb-2">
              {{ $t('procurement.signatures.title') }}
            </h4>
            <div v-if="!detail.signatures || detail.signatures.length === 0"
              class="text-sm text-gray-500 dark:text-slate-400 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 p-4 text-center">
              {{ $t('procurement.signatures.none') }}
            </div>
            <ul v-else class="space-y-2">
              <li v-for="sig in detail.signatures" :key="sig.id" class="flex items-start gap-3 rounded-xl border p-3"
                :class="sig.action === 'approve' ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10' : 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10'">
                <div
                  class="flex-shrink-0 rounded-lg bg-white border border-gray-200 p-1 dark:bg-slate-900 dark:border-slate-700">
                  <img :src="sig.signature_url" alt="signature" class="w-20 h-12 object-contain" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-semibold text-gray-900 dark:text-slate-100">
                    {{ sig.user?.name || '-' }}
                    <span class="text-xs font-normal"
                      :class="sig.action === 'approve' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'">
                      • {{ sig.action === 'approve' ? $t('procurement.signatures.action_approve') :
                        $t('procurement.signatures.action_reject') }}
                    </span>
                  </p>
                  <p class="text-xs text-gray-500 dark:text-slate-400">{{ dt(sig.signed_at) }}</p>
                  <p v-if="sig.reason" class="text-xs text-gray-600 dark:text-slate-300 mt-1">
                    <span class="font-medium">{{ $t('procurement.signatures.reason') }}:</span> {{ sig.reason }}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-700">
            <button type="button"
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
              @click="closeDetail">
              {{ $t('procurement.actions.close') }}
            </button>
            <button v-if="flags.del" type="button" :disabled="acting"
              class="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg disabled:opacity-50"
              @click="doDelete">{{
                $t('procurement.actions.delete') }}</button>
            <button v-if="flags.cancel" type="button" :disabled="acting"
              class="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg disabled:opacity-50 dark:bg-slate-700 dark:text-slate-200"
              @click="openReason('cancel')">{{ $t('procurement.actions.cancel') }}</button>
            <button v-if="flags.reject" type="button" :disabled="acting"
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
              @click="openSignature('reject')">{{ $t('procurement.actions.reject') }}</button>
            <button v-if="flags.edit" type="button" :disabled="acting"
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
              @click="openEdit">{{ $t('procurement.actions.edit') }}</button>
            <button v-if="flags.submit" type="button" :disabled="acting"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
              @click="doSubmit">{{
                $t('procurement.actions.submit') }}</button>
            <button v-if="flags.approve" type="button" :disabled="acting"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
              @click="openSignature('approve')">{{ $t('procurement.actions.approve') }}</button>
            <button v-if="flags.send" type="button" :disabled="acting"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
              @click="doSend">{{
                $t('procurement.actions.send') }}</button>
            <button v-if="flags.receive" type="button" :disabled="acting"
              class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg disabled:opacity-50"
              @click="openReceive">{{
                $t('procurement.actions.receive') }}</button>
          </div>
        </template>
      </div>
    </div>

    <!-- ============================ Reason modal ============================ -->
    <div v-if="showReason" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      style="z-index: 60">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-3 dark:text-slate-100">
          {{ reasonType === 'reject' ? $t('procurement.reason.reject_title') : $t('procurement.reason.cancel_title') }}
        </h3>
        <label :class="labelClass">{{ $t('procurement.reason.label') }} *</label>
        <textarea v-model="reasonText" rows="3" :placeholder="$t('procurement.reason.placeholder')"
          :class="inputClass"></textarea>
        <p v-if="reasonError" class="text-xs text-red-600 mt-1">{{ reasonError }}</p>
        <div class="flex justify-end gap-3 mt-4">
          <button type="button"
            class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
            @click="showReason = false">{{ $t('realty.common.cancel') }}</button>
          <button type="button" :disabled="acting"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
            @click="submitReason">{{
              $t('procurement.reason.confirm') }}</button>
        </div>
      </div>
    </div>

    <!-- ============================ Signature modal ============================ -->
    <SignatureModal :show="showSignature" :action="signatureAction" :loading="signatureLoading"
      @close="showSignature = false" @submit="submitSignature" />

    <!-- ============================ Receive modal ============================ -->
    <div v-if="showReceive" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      style="z-index: 60">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-1 dark:text-slate-100">{{ $t('procurement.receive.title') }}</h3>
        <p class="text-xs text-gray-500 mb-4 dark:text-slate-400">{{ $t('procurement.receive.hint') }}</p>

        <div v-if="receiveError"
          class="mb-3 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          {{ receiveError }}</div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label :class="labelClass">{{ $t('procurement.receive.date') }}</label>
            <input v-model="receiveDate" type="date" :class="inputClass" />
          </div>
          <div>
            <label :class="labelClass">{{ $t('procurement.receive.notes') }}</label>
            <input v-model="receiveNotes" type="text" maxlength="500" :class="inputClass" />
          </div>
        </div>

        <div class="overflow-x-auto border border-gray-200 rounded-xl dark:border-slate-700">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50 dark:bg-slate-900/50">
              <tr class="text-xs font-semibold text-gray-700 whitespace-nowrap dark:text-slate-300">
                <th class="px-3 py-2 text-start">{{ $t('procurement.form.description') }}</th>
                <th class="px-3 py-2 text-end">{{ $t('procurement.detail.ordered') }}</th>
                <th class="px-3 py-2 text-end">{{ $t('procurement.detail.received') }}</th>
                <th class="px-3 py-2 text-end">{{ $t('procurement.detail.remaining') }}</th>
                <th class="px-3 py-2 text-start">{{ $t('procurement.receive.qty') }}</th>
              </tr>
            </thead>
            <tbody class="text-gray-800 dark:text-slate-200">
              <tr v-for="l in receiveLines" :key="l.id" class="border-t border-gray-200 dark:border-slate-700">
                <td class="px-3 py-2">{{ l.description }}</td>
                <td class="px-3 py-2 text-end">{{ qty(l.ordered) }}</td>
                <td class="px-3 py-2 text-end">{{ qty(l.received) }}</td>
                <td class="px-3 py-2 text-end font-medium">{{ qty(l.remaining) }}</td>
                <td class="px-3 py-2"><input v-model="l.qty" type="number" min="0" :max="l.remaining" step="0.001"
                    style="min-width: 7rem" :class="cellClass" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <button type="button"
            class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
            @click="showReceive = false">{{ $t('realty.common.cancel') }}</button>
          <button type="button" :disabled="acting"
            class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg disabled:opacity-50"
            @click="submitReceive">{{ $t('procurement.receive.save') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify'
import poApi from '@/api/purchaseOrder'
import supplierApi from '@/api/supplier'
import departmentApi from '@/api/department'
import { unwrapList } from '@/api/crud'
import Pagination from '@/components/shared/Pagination.vue'
import SignatureModal from '@/components/procurement/SignatureModal.vue'
import ApprovalChain from '@/components/procurement/ApprovalChain.vue'

const STATUSES = ['draft', 'pending_approval', 'approved', 'rejected', 'sent', 'partially_received', 'received', 'cancelled']
const EDITABLE = ['draft', 'rejected']
const RECEIVABLE = ['approved', 'sent', 'partially_received']
const CANCELLABLE = ['draft', 'pending_approval', 'approved', 'rejected', 'sent']
const DELETABLE = ['draft', 'rejected', 'cancelled']
const CURRENCIES = ['SAR', 'KWD', 'USD', 'EUR', 'AED', 'GBP']

const STATUS_CLASS = {
  draft: 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-200',
  pending_approval: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400',
  approved: 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400',
  sent: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/10 dark:text-indigo-400',
  partially_received: 'bg-orange-100 text-orange-800 dark:bg-orange-500/10 dark:text-orange-400',
  received: 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400',
  cancelled: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
}

const num = (v) => Number(v) || 0
const round2 = (v) => Math.round((num(v) + Number.EPSILON) * 100) / 100
const round3 = (v) => Math.round((num(v) + Number.EPSILON) * 1000) / 1000

const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const blankItem = () => ({ description: '', item_code: '', unit: '', quantity: 1, unit_price: 0, tax_rate: 0 })

const blankForm = () => ({
  supplier_id: '',
  beneficiary_department_id: '',
  order_date: today(),
  expected_date: '',
  currency: 'SAR',
  payment_terms_days: '',
  discount_amount: 0,
  notes: '',
  items: [blankItem()],
})

export default {
  name: 'PurchaseOrdersIndex',
  components: { Pagination, SignatureModal, ApprovalChain },

  data() {
    return {
      items: [],
      stats: { by_status: {}, open_value: {} },
      pagination: { current_page: 1, last_page: 1, per_page: 20, total: 0, from: 0, to: 0 },
      loading: false,
      reqId: 0,
      page: 1,
      search: '',
      statusFilter: '',
      supplierFilter: '',
      fromDate: '',
      toDate: '',
      searchTimer: null,
      suppliers: [],
      departments: [],
      departmentsLoading: false,   // ✅ [FIX #1] حالة تحميل الإدارات
      currencies: CURRENCIES,

      showForm: false,
      editingId: null,
      submitting: false,
      formErrors: [],
      form: blankForm(),

      showDetail: false,
      detail: null,
      detailLoading: false,
      acting: false,

      showReason: false,
      reasonType: '',
      reasonText: '',
      reasonError: '',

      showReceive: false,
      receiveLines: [],
      receiveDate: today(),
      receiveNotes: '',
      receiveError: '',

      showSignature: false,
      signatureAction: '',
      signatureLoading: false,
      uploadingAttachment: false,
      attachmentError: '',
    }
  },

  computed: {
    inputClass() {
      return 'w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100'
    },
    cellClass() {
      return 'w-full px-2 py-1.5 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100'
    },
    labelClass() {
      return 'block text-sm font-medium text-gray-700 mb-1 dark:text-slate-300'
    },
    locale() {
      return 'en-US'
    },

    canCreate() { return this.hasPerm('create_purchase_order') },
    canEdit() { return this.hasPerm('edit_purchase_order') },
    canDelete() { return this.hasPerm('delete_purchase_order') },
    canApprove() { return this.hasPerm('approve_purchase_order') },
    canSend() { return this.hasPerm('send_purchase_order') },
    canReceive() { return this.hasPerm('receive_purchase_order') },
    canCancel() { return this.hasPerm('cancel_purchase_order') },

    hasFilters() {
      return !!(this.search || this.statusFilter || this.supplierFilter || this.fromDate || this.toDate)
    },

    statusChips() {
      const by = this.stats?.by_status || {}
      const all = Object.values(by).reduce((s, n) => s + num(n), 0)
      return [
        { key: '', label: this.$t('realty.common.all'), count: all },
        ...STATUSES.map((k) => ({ key: k, label: this.statusLabel(k), count: num(by[k]) })),
      ]
    },

    openValueText() {
      return Object.entries(this.stats?.open_value || {})
        .map(([cur, v]) => `${this.money(v)} ${cur}`)
        .join(' • ')
    },

    lineCalc() {
      return this.form.items.map((i) => {
        const line = round2(round3(i.quantity) * round2(i.unit_price))
        const tax = round2((line * round2(i.tax_rate)) / 100)
        return { line, tax, total: round2(line + tax) }
      })
    },

    formTotals() {
      const subtotal = round2(this.lineCalc.reduce((s, l) => s + l.line, 0))
      const tax = round2(this.lineCalc.reduce((s, l) => s + l.tax, 0))
      const discount = round2(this.form.discount_amount)
      return { subtotal, tax, discount, total: round2(subtotal + tax - discount) }
    },

    detailInfo() {
      const d = this.detail
      if (!d) return []
      const list = [
        { label: this.$t('procurement.po.branch'), value: d.branch ? this.localName(d.branch) : '-' },
        { label: this.$t('procurement.po.order_date'), value: this.ymd(d.order_date) },
        { label: this.$t('procurement.po.expected_date'), value: this.ymd(d.expected_date) },
        { label: this.$t('procurement.po.payment_terms'), value: d.payment_terms_days ?? '-' },
        { label: this.$t('procurement.detail.created_by'), value: d.creator?.name || '-' },
      ]
      if (d.approver) {
        list.push({ label: this.$t('procurement.detail.approved_by'), value: d.approver.name })
        list.push({ label: this.$t('procurement.detail.approved_at'), value: this.dt(d.approved_at) })
      }
      if (d.sent_at) {
        list.push({ label: this.$t('procurement.detail.sent_at'), value: this.dt(d.sent_at) })
      }
      return list
    },

    flags() {
      const d = this.detail
      if (!d || !d.status) return {}
      const s = d.status
      const turn = this.isMyTurn(d)
      return {
        edit: this.canEdit && EDITABLE.includes(s),
        submit: (this.canCreate || this.canEdit) && EDITABLE.includes(s),
        approve: this.canApprove && s === 'pending_approval' && turn,
        reject: this.canApprove && s === 'pending_approval' && turn,
        send: this.canSend && s === 'approved',
        receive: this.canReceive && RECEIVABLE.includes(s),
        cancel: this.canCancel && CANCELLABLE.includes(s),
        del: this.canDelete && DELETABLE.includes(s),
      }
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
  },

  mounted() {
    this.loadSuppliers()
    this.loadDepartments()
    this.fetch()
  },

  beforeUnmount() {
    clearTimeout(this.searchTimer)
  },

  methods: {
    // دور المستخدم في سلسلة الموافقات: معيَّن، أو مُصعَّد إليه، أو سوبر أدمن.
    // الطلبات القديمة بلا سلسلة تبقى قابلة للموافقة والخادم هو الحكم.
    isMyTurn(order) {
      const user = this.$store.state.auth?.user
      const uid = Number(user?.id) || 0
      if (!uid || [order.created_by, order.requester_id].map(Number).includes(uid)) return false
      if (!order.approvals || !order.approvals.length) return true
      const current = order.approvals.find((a) => a.status === 'pending' || a.status === 'escalated')
      if (!current) return false
      const isSuper = user?.admin_group_id === 1 || user?.group?.id === 1
      return Number(current.approver_id) === uid || Number(current.escalated_to_id) === uid || isSuper
    },

    hasPerm(permission) {
      if (!permission) return false
      if (this.$store.state.auth?.is_admin) return true
      const getter = this.$store.getters['auth/hasPermission']
      return typeof getter === 'function' ? !!getter(permission) : false
    },

    localName(obj) {
      if (!obj) return '-'
      return this.$i18n.locale === 'en' && obj.name_en ? obj.name_en : obj.name
    },

    deptLabel(d) {
      if (!d) return ''
      const name = this.$i18n.locale === 'ar' ? d.name : (d.name_en || d.name)
      return d.manager ? `${name} — ${d.manager.name}` : `${name} ⚠️`
    },

    money(v) {
      return new Intl.NumberFormat(this.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num(v))
    },

    qty(v) {
      return new Intl.NumberFormat(this.locale, { minimumFractionDigits: 0, maximumFractionDigits: 3 }).format(num(v))
    },

    ymd(v) {
      return v ? String(v).slice(0, 10) : '-'
    },

    dt(v) {
      if (!v) return '-'
      const d = new Date(v)
      return isNaN(d) ? '-' : d.toLocaleString(this.locale)
    },

    statusLabel(s) {
      return this.$t(`procurement.status.${s}`)
    },

    statusClass(s) {
      return STATUS_CLASS[s] || STATUS_CLASS.draft
    },

    apiError(e) {
      return e?.response?.data?.message || e?.message || this.$t('realty.common.error')
    },

    errorList(e) {
      const errors = e?.response?.data?.errors
      if (errors && typeof errors === 'object') {
        const list = Object.values(errors).flat().filter(Boolean)
        if (list.length) return list
      }
      return [this.apiError(e)]
    },

    itemDescription(id) {
      const it = (this.detail?.items || []).find((i) => i.id === id)
      return it ? it.description : '-'
    },

    // ─────────────────── التوقيع والموافقة ───────────────────
    openSignature(action) {
      this.signatureAction = action
      this.showSignature = true
    },

    async submitSignature({ signature, reason }) {
      this.signatureLoading = true
      try {
        const id = this.detail.id
        const res = this.signatureAction === 'approve'
          ? await poApi.approve(id, signature)
          : await poApi.reject(id, reason, signature)

        this.detail = res.data.data
        toast.success(res.data?.message || this.$t('realty.common.saved'))
        this.showSignature = false
        window.dispatchEvent(new Event('approvals-changed'))
        this.fetch()
      } catch (e) {
        toast.error(this.apiError(e))
      } finally {
        this.signatureLoading = false
      }
    },

    // ─────────────────── المرفقات ───────────────────
    async onAttachmentSelected(event) {
      const file = event.target.files?.[0]
      event.target.value = ''
      if (!file) return

      const ok = /\.(pdf|jpe?g|png|docx)$/i.test(file.name)
      if (!ok || file.size > 10 * 1024 * 1024) {
        this.attachmentError = this.$t('procurement.attachments.invalid_file')
        return
      }

      this.attachmentError = ''
      this.uploadingAttachment = true
      try {
        const res = await poApi.uploadAttachment(this.detail.id, file)
        if (!this.detail.attachments) this.detail.attachments = []
        this.detail.attachments.push(res.data.data)
        toast.success(res.data?.message || this.$t('procurement.attachment_uploaded'))
      } catch (e) {
        this.attachmentError = this.apiError(e)
      } finally {
        this.uploadingAttachment = false
      }
    },

    async removeAttachment(att) {
      const ok = await this.confirmAction(this.$t('procurement.attachments.delete_confirm'))
      if (!ok) return
      try {
        await poApi.deleteAttachment(this.detail.id, att.id)
        this.detail.attachments = this.detail.attachments.filter((a) => a.id !== att.id)
        toast.success(this.$t('procurement.attachment_deleted'))
      } catch (e) {
        toast.error(this.apiError(e))
      }
    },

    async confirmAction(text) {
      if (this.$swal) {
        const result = await this.$swal({
          text,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: this.$t('procurement.actions.confirm'),
          cancelButtonText: this.$t('realty.common.cancel'),
          reverseButtons: true,
        })
        return !!result.isConfirmed
      }
      return window.confirm(text)
    },

    // ------------------------------ القائمة ------------------------------
    async fetch() {
      const id = ++this.reqId
      this.loading = true
      try {
        const params = { page: this.page, per_page: 20 }
        if (this.search.trim()) params.search = this.search.trim()
        if (this.statusFilter) params.status = this.statusFilter
        if (this.supplierFilter) params.supplier_id = this.supplierFilter
        if (this.fromDate) params.from = this.fromDate
        if (this.toDate) params.to = this.toDate

        const res = await poApi.getAll(params)
        if (id !== this.reqId) return
        const data = res.data?.data || {}
        this.items = data.items || []
        this.stats = data.stats || { by_status: {}, open_value: {} }
        this.pagination = data.pagination || this.pagination
      } catch (e) {
        if (id !== this.reqId) return
        toast.error(this.apiError(e))
      } finally {
        if (id === this.reqId) this.loading = false
      }
    },

    async loadSuppliers() {
      try {
        const { items } = unwrapList(await supplierApi.getAll({ per_page: 100, is_active: 1 }))
        this.suppliers = items
      } catch (e) {
        this.suppliers = []
      }
    },

    // ✅ [FIX #2] تحميل الإدارات مع حالة تحميل + معالجة أخطاء صريحة
    async loadDepartments() {
      this.departmentsLoading = true
      try {
        const res = await departmentApi.getAll({ per_page: 100 })
        
        // Debug: اطبع شكل الاستجابة في الـ Console لنعرف أين المشكلة
        console.log("🔍 [Debug] Departments API Response:", res.data)
        
        // استخراج المصفوفة مهما كان شكل الاستجابة
        let items = []
        if (Array.isArray(res.data)) {
          items = res.data
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          items = res.data.data
        } else if (res.data?.data?.items && Array.isArray(res.data.data.items)) {
          items = res.data.data.items
        } else if (res.data?.items && Array.isArray(res.data.items)) {
          items = res.data.items
        } else if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
           items = res.data.data.data
        }

        this.departments = items
      } catch (e) {
        console.error("❌ [Error] Failed to load departments:", e)
        this.departments = []
        toast.error(this.apiError(e))
      } finally {
        this.departmentsLoading = false
      }
    },

    applyFilters() {
      this.page = 1
      this.fetch()
    },

    setStatus(key) {
      this.statusFilter = key
      this.applyFilters()
    },

    clearFilters() {
      this.search = ''
      this.statusFilter = ''
      this.supplierFilter = ''
      this.fromDate = ''
      this.toDate = ''
      this.applyFilters()
    },

    goTo(n) {
      if (n < 1 || n > this.pagination.last_page) return
      this.page = n
      this.fetch()
    },

    // ------------------------------ النموذج ------------------------------
    openCreate() {
      this.editingId = null
      this.formErrors = []
      this.form = blankForm()
      this.showForm = true
    },

    // ✅ [FIX #3] إضافة beneficiary_department_id + ضمان تحميل الإدارات
    async openEdit() {
      // تأكد أن الإدارات محمّلة قبل فتح النموذج
      if (this.departments.length === 0 && !this.departmentsLoading) {
        await this.loadDepartments()
      }

      const d = this.detail
      if (!d) return
      this.editingId = d.id
      this.formErrors = []

      if (d.supplier && !this.suppliers.some((s) => s.id === d.supplier_id)) {
        this.suppliers = [...this.suppliers, d.supplier]
      }

      this.form = {
        supplier_id: d.supplier_id,
        beneficiary_department_id: d.beneficiary_department_id || '',  // ✅ الإصلاح
        order_date: this.ymd(d.order_date),
        expected_date: d.expected_date ? this.ymd(d.expected_date) : '',
        currency: d.currency || 'SAR',
        payment_terms_days: d.payment_terms_days ?? '',
        discount_amount: num(d.discount_amount),
        notes: d.notes || '',
        items: (d.items || []).map((i) => ({
          description: i.description,
          item_code: i.item_code || '',
          unit: i.unit || '',
          quantity: num(i.quantity),
          unit_price: num(i.unit_price),
          tax_rate: num(i.tax_rate),
        })),
      }
      if (!this.form.items.length) this.form.items = [blankItem()]
      this.showForm = true
    },

    onSupplierChange() {
      const s = this.suppliers.find((x) => x.id === this.form.supplier_id)
      if (!s) return
      if (s.currency) this.form.currency = s.currency
      this.form.payment_terms_days = s.payment_terms_days ?? ''
    },

    addItem() {
      this.form.items.push(blankItem())
    },

    removeItem(idx) {
      if (this.form.items.length > 1) this.form.items.splice(idx, 1)
    },

    // ✅ [FIX #4] إضافة تحقق من الإدارة المستفيدة
    async submitForm() {
      this.formErrors = []

      if (!this.form.supplier_id) {
        this.formErrors = [this.$t('procurement.form.supplier_required')]
        return
      }

      if (!this.form.beneficiary_department_id) {
        this.formErrors = [
          this.$t('procurement.po.beneficiary_required') ||
          'الرجاء اختيار الإدارة المستفيدة',
        ]
        return
      }

      const items = this.form.items
        .filter((i) => String(i.description || '').trim() !== '')
        .map((i) => ({
          description: String(i.description).trim(),
          item_code: i.item_code || null,
          unit: i.unit || null,
          quantity: num(i.quantity),
          unit_price: num(i.unit_price),
          tax_rate: num(i.tax_rate),
        }))

      if (!items.length) {
        this.formErrors = [this.$t('procurement.form.items_required')]
        return
      }

      const terms = this.form.payment_terms_days
      const payload = {
        supplier_id: this.form.supplier_id,
        beneficiary_department_id: this.form.beneficiary_department_id || null,
        order_date: this.form.order_date,
        expected_date: this.form.expected_date || null,
        currency: this.form.currency || null,
        payment_terms_days: terms === '' || terms === null ? null : num(terms),
        discount_amount: num(this.form.discount_amount),
        notes: this.form.notes || null,
        items,
      }

      this.submitting = true
      try {
        const res = this.editingId ? await poApi.update(this.editingId, payload) : await poApi.create(payload)
        toast.success(res.data?.message || this.$t('realty.common.saved'))
        this.showForm = false
        this.detail = res.data.data
        this.showDetail = true
        this.fetch()
      } catch (e) {
        this.formErrors = this.errorList(e)
      } finally {
        this.submitting = false
      }
    },

    // ------------------------------ التفاصيل والإجراءات ------------------------------
    async openView(row) {
      this.detail = null
      this.showDetail = true
      this.detailLoading = true
      try {
        const res = await poApi.getOne(row.id)
        this.detail = res.data.data
      } catch (e) {
        toast.error(this.apiError(e))
        this.showDetail = false
      } finally {
        this.detailLoading = false
      }
    },

    closeDetail() {
      this.showDetail = false
      this.detail = null
    },

    async runAction(fn) {
      this.acting = true
      try {
        const res = await fn()
        this.detail = res.data.data
        toast.success(res.data?.message || this.$t('realty.common.saved'))
        this.fetch()
        return true
      } catch (e) {
        toast.error(this.apiError(e))
        return false
      } finally {
        this.acting = false
      }
    },

    async doSubmit() {
      if (!(await this.confirmAction(this.$t('procurement.confirm.submit')))) return
      await this.runAction(() => poApi.submit(this.detail.id))
    },

    async doSend() {
      if (!(await this.confirmAction(this.$t('procurement.confirm.send')))) return
      await this.runAction(() => poApi.send(this.detail.id))
    },

    async doDelete() {
      if (!(await this.confirmAction(this.$t('procurement.confirm.delete')))) return
      this.acting = true
      try {
        const res = await poApi.remove(this.detail.id)
        toast.success(res.data?.message || this.$t('realty.common.deleted'))
        this.closeDetail()
        this.fetch()
      } catch (e) {
        toast.error(this.apiError(e))
      } finally {
        this.acting = false
      }
    },

    openReason(type) {
      this.reasonType = type
      this.reasonText = ''
      this.reasonError = ''
      this.showReason = true
    },

    async submitReason() {
      const reason = this.reasonText.trim()
      if (!reason) {
        this.reasonError = this.$t('procurement.reason.required')
        return
      }
      const id = this.detail.id
      const ok = await this.runAction(() =>
        this.reasonType === 'reject' ? poApi.reject(id, reason) : poApi.cancel(id, reason),
      )
      if (ok) this.showReason = false
    },

    // ------------------------------ الاستلام ------------------------------
    openReceive() {
      this.receiveError = ''
      this.receiveDate = today()
      this.receiveNotes = ''
      this.receiveLines = (this.detail.items || [])
        .filter((i) => num(i.remaining_quantity) > 0)
        .map((i) => ({
          id: i.id,
          description: i.description,
          ordered: num(i.quantity),
          received: num(i.received_quantity),
          remaining: num(i.remaining_quantity),
          qty: num(i.remaining_quantity),
        }))
      this.showReceive = true
    },

    async submitReceive() {
      this.receiveError = ''
      const lines = []

      for (const l of this.receiveLines) {
        const q = round3(l.qty)
        if (q < 0 || q > round3(l.remaining)) {
          this.receiveError = `${this.$t('procurement.receive.exceeds')}: ${l.description}`
          return
        }
        if (q > 0) lines.push({ purchase_order_item_id: l.id, quantity: q })
      }

      if (!lines.length) {
        this.receiveError = this.$t('procurement.receive.nothing')
        return
      }

      const id = this.detail.id
      const payload = { received_date: this.receiveDate || null, notes: this.receiveNotes || null, items: lines }
      const ok = await this.runAction(() => poApi.receive(id, payload))
      if (ok) this.showReceive = false
    },
  },
}
</script>
