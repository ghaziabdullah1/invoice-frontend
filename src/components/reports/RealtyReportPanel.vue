<template>
  <div>
    <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">{{ $t('reports.filters') }}</h2>
        </div>
        <div class="flex gap-2">
          <button @click="load" :disabled="loading" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>{{ $t('common.search') }}</button>
          <button @click="resetFilters" class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>{{ $t('reports.buttons.reset_filters') }}</button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('reports.realty.property') }}</label><select v-model="filters.property" class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"><option value="all">{{ $t('reports.realty.allProperties') }}</option><option v-for="p in properties" :key="p.id" :value="p.id">{{ propertyLabel(p) }}</option></select></div>
        <template v-if="showDates"><div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('reports.realty.from') }}</label><input type="date" v-model="filters.start_date" class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" /></div><div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('reports.realty.to') }}</label><input type="date" v-model="filters.end_date" class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500" /></div></template>
        <div v-if="reportKey === 'expiring_contracts'"><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ $t('reports.realty.days') }}</label><select v-model="filters.days" class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"><option v-for="d in [30, 60, 90]" :key="d" :value="d">{{ $t('reports.realty.daysOption', { n: d }) }}</option></select></div>
      </div>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700">{{ error }}</div>
    <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center text-gray-600 dark:text-gray-300">{{ $t('reports.realty.loading') }}</div>
    <div v-else-if="!error">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div v-for="(s, index) in statDefs" :key="s.key" class="stats-card border" :class="getStatColorClass(index)">
          <div class="stats-icon" :class="getStatIconBgClass(index)"><svg class="w-6 h-6" :class="getStatIconColorClass(index)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
          <div><p class="stats-label">{{ $t('reports.realty.stats.' + s.key) }}</p><p v-if="s.type === 'num'" class="stats-value">{{ fmt(stats[s.key], 0) }}</p><p v-else-if="s.type === 'pct'" class="stats-value">{{ fmt(stats[s.key], 1) }}%</p><template v-else><p v-if="!mapLines(stats[s.key], s.type === 'pctmap').length" class="stats-value">-</p><p v-for="l in mapLines(stats[s.key], s.type === 'pctmap')" :key="l.cur" class="stats-value">{{ l.text }} <span class="text-xs text-gray-500">{{ l.cur }}</span></p></template></div>
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div v-if="!items.length" class="text-center py-12 text-gray-500 dark:text-gray-400">{{ $t('reports.realty.noData') }}</div>
        <div v-else class="overflow-x-auto"><table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"><thead><tr><th v-for="c in colDefs" :key="c.key" class="table-header text-center">{{ $t('reports.realty.cols.' + c.key) }}</th></tr></thead><tbody class="divide-y divide-gray-200 dark:divide-gray-700"><tr v-for="(row, i) in items" :key="i" class="hover:bg-blue-50/30 dark:hover:bg-gray-700/50"><td v-for="c in colDefs" :key="c.key" class="table-cell text-center" :class="cellClass(c, row)">{{ cell(c, row) }}</td></tr></tbody></table></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

const COLS = {
  occupancy: [['property', 'text'], ['floor', 'text'], ['total_units', 'num'], ['occupied', 'num'], ['vacant', 'num'], ['inactive', 'num'], ['occupancy_rate', 'pct']],
  rent_roll: [['contract_number', 'text'], ['property', 'text'], ['floor', 'text'], ['unit', 'text'], ['tenant', 'text'], ['start_date', 'text'], ['end_date', 'text'], ['payment_frequency', 'freq'], ['rent_amount', 'money'], ['monthly_equivalent', 'money'], ['currency', 'text'], ['security_deposit', 'money'], ['annual_increase_percent', 'pct']],
  expiring_contracts: [['contract_number', 'text'], ['property', 'text'], ['unit', 'text'], ['tenant', 'text'], ['phone', 'text'], ['end_date', 'text'], ['days_remaining', 'num'], ['rent_amount', 'money'], ['currency', 'text'], ['renewals_count', 'num']],
  tenant_arrears: [['tenant', 'text'], ['contract_number', 'text'], ['property', 'text'], ['unit', 'text'], ['currency', 'text'], ['b0_30', 'bucket'], ['b31_60', 'bucket'], ['b61_90', 'bucket'], ['b90_plus', 'bucket'], ['total_due', 'money'], ['invoices_count', 'num']],
  collection: [['month', 'text'], ['property', 'text'], ['currency', 'text'], ['due', 'money'], ['collected', 'money'], ['outstanding', 'money'], ['rate', 'pct']],
  vacant_units: [['property', 'text'], ['floor', 'text'], ['unit', 'text'], ['area', 'money'], ['monthly_rent', 'money'], ['currency', 'text'], ['vacant_since', 'text'], ['vacant_days', 'num']],
  property_revenue: [['property', 'text'], ['currency', 'text'], ['invoiced', 'money'], ['collected', 'money'], ['outstanding', 'money'], ['overdue', 'money'], ['rate', 'pct'], ['active_contracts', 'num']],
}

const STATS = {
  occupancy: [['properties_count', 'num'], ['total_units', 'num'], ['occupied', 'num'], ['vacant', 'num'], ['inactive', 'num'], ['occupancy_rate', 'pct']],
  rent_roll: [['contracts_count', 'num'], ['monthly_expected', 'map'], ['annual_expected', 'map'], ['deposits', 'map']],
  expiring_contracts: [['total', 'num'], ['expired', 'num'], ['within_30', 'num'], ['within_60', 'num'], ['within_90', 'num'], ['monthly_at_risk', 'map']],
  tenant_arrears: [['tenants_count', 'num'], ['invoices_count', 'num'], ['total_due', 'map'], ['over_90', 'map']],
  collection: [['due', 'map'], ['collected', 'map'], ['outstanding', 'map'], ['collection_rate', 'pctmap']],
  vacant_units: [['vacant_count', 'num'], ['monthly_loss', 'map'], ['annual_loss', 'map']],
  property_revenue: [['invoiced', 'map'], ['collected', 'map'], ['outstanding', 'map'], ['overdue', 'map']],
}

export default {
  name: 'RealtyReportPanel',
  props: { reportKey: { type: String, required: true }, properties: { type: Array, default: () => [] } },
  data() { return { loading: false, exporting: false, error: null, items: [], stats: {}, reqId: 0, filters: { property: 'all', start_date: '', end_date: '', days: 90 } } },
  computed: {
    colDefs() { return (COLS[this.reportKey] || []).map(([key, type]) => ({ key, type })) },
    statDefs() { return (STATS[this.reportKey] || []).map(([key, type]) => ({ key, type })) },
    showDates() { return this.reportKey === 'collection' || this.reportKey === 'property_revenue' },
    numLocale() { return this.$i18n.locale === 'en' ? 'en-US' : 'en-US' },
  },
  watch: { reportKey: { immediate: true, handler() { this.load() } } },
  methods: {
    resetFilters() { this.filters = { property: 'all', start_date: '', end_date: '', days: 90 }; this.load(); },
    getStatColorClass(index) { const colors = ['bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-gray-200 dark:border-gray-700', 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-gray-200 dark:border-gray-700', 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-gray-200 dark:border-gray-700', 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-gray-200 dark:border-gray-700', 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border-gray-200 dark:border-gray-700', 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-gray-200 dark:border-gray-700']; return colors[index % colors.length] },
    getStatIconBgClass(index) { const colors = ['bg-blue-100 dark:bg-blue-900/50', 'bg-green-100 dark:bg-green-900/50', 'bg-purple-100 dark:bg-purple-900/50', 'bg-red-100 dark:bg-red-900/50', 'bg-yellow-100 dark:bg-yellow-900/50', 'bg-orange-100 dark:bg-orange-900/50']; return colors[index % colors.length] },
    getStatIconColorClass(index) { const colors = ['text-blue-600 dark:text-blue-400', 'text-green-600 dark:text-green-400', 'text-purple-600 dark:text-purple-400', 'text-red-600 dark:text-red-400', 'text-yellow-600 dark:text-yellow-400', 'text-orange-600 dark:text-orange-400']; return colors[index % colors.length] },
    propertyLabel(p) { return this.$i18n.locale === 'en' && p.name_en ? p.name_en : p.name },
    params() { const p = { lang: this.$i18n.locale }; if (this.filters.property === 'all') p.all = 1; else p.property_id = this.filters.property; if (this.showDates) { if (this.filters.start_date) p.start_date = this.filters.start_date; if (this.filters.end_date) p.end_date = this.filters.end_date; } if (this.reportKey === 'expiring_contracts') p.days = this.filters.days; return p },
    async load() { const id = ++this.reqId; this.loading = true; this.error = null; try { const res = await axios.get(`/admin/reports/realty/${this.reportKey}`, { params: this.params() }); if (id !== this.reqId) return; if (!res.data?.success) throw new Error(res.data?.message || ''); this.items = Array.from(res.data.data?.items || []); this.stats = res.data.data?.stats || {}; } catch (e) { if (id !== this.reqId) return; this.items = []; this.stats = {}; this.error = e.response?.data?.message || e.message || this.$t('reports.realty.loadFailed'); } finally { if (id === this.reqId) this.loading = false; } },
    async exportExcel() { this.exporting = true; this.error = null; try { const res = await axios.get(`/admin/reports/realty/${this.reportKey}/export`, { params: this.params(), responseType: 'blob' }); if (res.data?.type?.includes('json')) { const body = JSON.parse(await res.data.text()); throw new Error(body.message || ''); } const url = window.URL.createObjectURL(new Blob([res.data])); const a = document.createElement('a'); a.href = url; a.setAttribute('download', `realty_${this.reportKey}_${new Date().toISOString().split('T')[0]}.xlsx`); document.body.appendChild(a); a.click(); document.body.removeChild(a); window.URL.revokeObjectURL(url); } catch (e) { let msg = e.message || ''; const d = e.response?.data; if (e.response?.status === 404) msg = this.$t('reports.realty.noData'); else if (d instanceof Blob) { try { msg = JSON.parse(await d.text()).message || msg } catch (err) {} } this.error = this.$t('reports.realty.exportFailed') + (msg ? ': ' + msg : ''); } finally { this.exporting = false; } },
    fmt(v, d = 2) { const n = Number(v); if (v === null || v === undefined || v === '' || !isFinite(n)) return '-'; return new Intl.NumberFormat(this.numLocale, { minimumFractionDigits: d, maximumFractionDigits: d }).format(n) },
    mapLines(map, pct = false) { return Object.entries(map || {}).map(([cur, v]) => ({ cur, text: pct ? this.fmt(v, 1) + '%' : this.fmt(v, 2) })) },
    cell(c, row) { const v = row[c.key]; if (v === null || v === undefined || v === '') return '-'; switch (c.type) { case 'num': return this.fmt(v, 0); case 'money': return this.fmt(v, 2); case 'bucket': return Number(v) > 0 ? this.fmt(v, 2) : '-'; case 'pct': return this.fmt(v, 1) + '%'; case 'freq': return this.$te('reports.realty.freq.' + v) ? this.$t('reports.realty.freq.' + v) : v; default: return v } },
    cellClass(c, row) { const v = row[c.key]; if (c.key === 'days_remaining' && v !== null && v !== undefined) { if (v < 0) return 'text-red-600 font-semibold'; if (v <= 30) return 'text-orange-600 font-semibold'; } if (c.key === 'b90_plus' && Number(v) > 0) return 'text-red-700 font-semibold'; return 'text-gray-700 dark:text-gray-300' },
  },
}
</script>
