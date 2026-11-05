<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 md:py-8 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">

      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div
                class="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{{ $t('reports.title') }}</h1>
                <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">{{ $t('reports.subtitle') }}</p>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button v-if="!realtyKey" @click="openExportModal"
              class="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="font-medium">{{ $t('reports.buttons.export_report') }}</span>
            </button>
            <button v-if="realtyKey" @click="triggerRealtyExport" :disabled="realtyExporting"
              class="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md flex items-center gap-2 disabled:opacity-50">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="font-medium">Export Excel</span>
            </button>
            <button @click="toggleExportedFiles"
              class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="font-medium">{{ showExportedFiles ? $t('reports.buttons.close_exported') :
                $t('reports.buttons.view_exported') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Exported Files -->
      <div v-if="showExportedFiles"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">{{ $t('reports.exported_files') }}</h3>
          <button @click="toggleExportedFiles"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><svg class="w-5 h-5"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg></button>
        </div>
        <div v-if="exportedFiles.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th class="table-header text-center">File Name</th>
                <th class="table-header text-center">Date</th>
                <th class="table-header text-center">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="file in exportedFiles" :key="file.name">
                <td class="table-cell text-center">{{ file.name }}</td>
                <td class="table-cell text-center">{{ file.modified }}</td>
                <td class="table-cell text-center"><a :href="file.url" target="_blank"
                    class="text-blue-600 hover:underline">Download</a></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-4 text-gray-500">No exported files found.</div>
      </div>

      <!-- Tabs -->
      <div
        class="mb-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div class="flex overflow-x-auto">
          <button v-for="tab in tabs" :key="tab.id" @click="selectTab(tab)"
            :class="{ 'border-b-2 border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20': isTabActive(tab), 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50': !isTabActive(tab) }"
            class="flex-1 px-6 py-4 text-sm font-medium text-center whitespace-nowrap transition-colors duration-200 flex items-center justify-center gap-2">
            {{ tab.label }}
            <span v-if="tab.id === 'overdue' && overdueCount > 0"
              class="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">{{
              overdueCount }}</span>
          </button>
        </div>
      </div>

      <!-- Filters (Financial) -->
      <div v-show="!realtyKey"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">{{ $t('reports.filters') }}</h2>
          </div>
          <div class="flex gap-2">
            <button @click="searchFinancial" :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>{{ $t('common.search') }}
            </button>
            <button @click="resetFilters"
              class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>{{ $t('reports.buttons.reset_filters') }}
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('common.fromDate')
              }}</label><input type="date" v-model="localFilters.start_date"
              class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
          </div>
          <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('common.toDate')
              }}</label><input type="date" v-model="localFilters.end_date"
              class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
          </div>
          <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{
            $t('reports.invoiceStatus') }}</label><select v-model="localFilters.status"
              class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
              <option value="">{{ $t('common.all') }}</option>
              <option value="draft">{{ $t('invoices.status.draft') }}</option>
              <option value="sent">{{ $t('invoices.status.sent') }}</option>
              <option value="paid">{{ $t('invoices.status.paid') }}</option>
              <option value="overdue">{{ $t('invoices.status.overdue') }}</option>
            </select></div>
          <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('common.search')
              }}</label><input type="text" v-model="localFilters.search" :placeholder="$t('invoices.searchPlaceholder')"
              class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <RealtyReportPanel ref="realtyPanel" v-if="realtyKey" :report-key="realtyKey" :properties="realtyProperties" />

      <div v-if="!realtyKey && loading"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center mb-6">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4">
        </div>
        <p class="text-gray-700 dark:text-gray-300 font-medium">{{ $t('common.loading') }}</p>
      </div>

      <div v-else-if="!realtyKey && hasSearched">
        <div v-if="activeTab === 'invoices'">
          <InvoiceReportSection :invoices="reports.invoices.items" :stats="reports.invoices.stats"
            :pagination="reports.invoices.pagination" @page-change="handlePageChange" />
        </div>
        <div v-if="activeTab === 'clients'">
          <ClientReportSection :clients="reports.clients.items" :stats="reports.clients.stats"
            :pagination="reports.clients.pagination" @page-change="handlePageChange" />
        </div>
        <div v-if="activeTab === 'revenue'">
          <RevenueReportSection :revenue="reports.revenue.items" :stats="reports.revenue.stats"
            :pagination="reports.revenue.pagination" @page-change="handlePageChange" />
        </div>
        <div v-if="activeTab === 'overdue'">
          <OverdueReportSection :invoices="reports.overdue.items" :stats="reports.overdue.stats"
            :pagination="reports.overdue.pagination" @send-reminder="handleSendReminder" @mark-paid="handleMarkAsPaid"
            @page-change="handlePageChange" />
        </div>
        <div v-if="activeTab === 'aging'">
          <AgingReportSection :clients="reports.aging.items" :stats="reports.aging.stats" />
        </div>
      </div>

      <div v-else-if="!realtyKey && !hasSearched"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center text-gray-500 dark:text-gray-400">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p class="text-lg font-medium">{{ $t('reports.empty_state_message') }}</p>
      </div>
    </div>
    <ExportModal v-if="showExportModal" :active-tab="activeTab" :loading="exportLoading" @close="closeExportModal"
      @export-direct="handleDirectExport" @export-server="handleServerExport" />
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
  components: { RealtyReportPanel, InvoiceReportSection, ClientReportSection, RevenueReportSection, OverdueReportSection, AgingReportSection, ExportModal },
  data() {
    return { realtyKeys: [], realtyProperties: [], realtyKey: null, realtyExporting: false, hasSearched: false, localFilters: { start_date: '', end_date: '', status: '', search: '' } }
  },
  computed: {
    ...mapState('report', ['loading', 'exportLoading', 'error', 'reports', 'exportedFiles', 'clients', 'activeTab', 'showExportModal', 'showExportedFiles']),
    ...mapGetters('report', ['overdueCount']),
    hasRealtyReports() { const has = this.$store.getters['auth/hasPermission']; return has('view_reports') && ['view_report_occupancy', 'view_report_rent_roll', 'view_report_expiring_contracts', 'view_report_tenant_arrears', 'view_report_collection', 'view_report_vacant_units', 'view_report_property_revenue'].some(p => has(p)) },
    tabs() { return [...this.financialTabs, ...this.realtyTabs] },
    realtyTabs() { return this.realtyKeys.map(k => ({ id: k, realty: true, label: this.$t('reports.realty.types.' + k) })) },
    financialTabs() { return [{ id: 'invoices', label: this.$t('reports.types.invoices') }, { id: 'clients', label: this.$t('reports.types.clients') }, { id: 'revenue', label: this.$t('reports.types.revenue') }, { id: 'overdue', label: this.$t('reports.types.overdue') }, { id: 'aging', label: this.$t('reports.types.aging') }] },
  },
  methods: {
    searchFinancial() { this.hasSearched = true; this.$store.commit('report/SET_FILTERS', this.localFilters); this.loadReport(); },
    resetFilters() { this.localFilters = { start_date: '', end_date: '', status: '', search: '' }; this.hasSearched = false; this.$store.commit('report/SET_FILTERS', this.localFilters); },
    triggerRealtyExport() { this.realtyExporting = true; if (this.$refs.realtyPanel) this.$refs.realtyPanel.exportExcel(); setTimeout(() => { this.realtyExporting = false; }, 2000); },
    selectTab(tab) { if (tab.realty) { this.realtyKey = tab.id; return; } this.realtyKey = null; this.hasSearched = false; this.switchTab(tab.id); },
    isTabActive(tab) { return tab.realty ? this.realtyKey === tab.id : !this.realtyKey && this.activeTab === tab.id },
    async loadRealtyMeta() { try { const res = await axios.get('/admin/reports/realty'); const data = res.data?.data || {}; this.realtyKeys = data.reports || []; this.realtyProperties = data.properties || []; } catch (e) { console.error(e) } },
    ...mapActions('report', ['init', 'loadReport', 'switchTab', 'handlePageChange', 'openExportModal', 'closeExportModal', 'toggleExportedFiles', 'handleDirectExport', 'handleServerExport', 'refreshExportedFiles', 'deleteExportedFile', 'clearError']),
    ...mapActions('report', { handleSendReminder: 'sendReminder', handleMarkAsPaid: 'markAsPaid' }),
  },
  mounted() { this.$store.commit('report/SET_FILTERS', this.localFilters); this.init(); if (this.hasRealtyReports) this.loadRealtyMeta(); },
}
</script>
