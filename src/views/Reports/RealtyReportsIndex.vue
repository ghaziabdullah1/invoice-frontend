<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-900 py-6 md:py-8"
  >
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {{ $t('reports.realty.title') }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {{ $t('reports.realty.subtitle') }}
          </p>
        </div>
        <div class="flex gap-3">
          <router-link
            to="/reports"
            class="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {{ $t('reports.realty.back') }}
          </router-link>
          <button
            v-if="active && canExport"
            @click="exportExcel"
            :disabled="exporting || loading"
            class="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {{ exporting ? $t('reports.realty.exporting') : $t('reports.realty.exportExcel') }}
          </button>
        </div>
      </div>

      <div
        v-if="metaLoading"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center text-gray-600 dark:text-gray-300"
      >
        {{ $t('reports.realty.loading') }}
      </div>

      <div
        v-else-if="metaError"
        class="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700"
      >
        {{ metaError }}
      </div>

      <div
        v-else-if="!reportKeys.length"
        class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center text-gray-600 dark:text-gray-300"
      >
        {{ $t('reports.realty.noReports') }}
      </div>

      <template v-else>
        <!-- Filters -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 mb-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('reports.realty.property') }}
              </label>
              <select
                v-model="filters.property"
                class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{{ $t('reports.realty.allProperties') }}</option>
                <option v-for="p in properties" :key="p.id" :value="p.id">
                  {{ propertyLabel(p) }}
                </option>
              </select>
            </div>

            <template v-if="showDates">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('reports.realty.from') }}
                </label>
                <input
                  type="date"
                  v-model="filters.start_date"
                  class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {{ $t('reports.realty.to') }}
                </label>
                <input
                  type="date"
                  v-model="filters.end_date"
                  class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </template>

            <div v-if="active === 'expiring_contracts'">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('reports.realty.days') }}
              </label>
              <select
                v-model="filters.days"
                class="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option v-for="d in [30, 60, 90]" :key="d" :value="d">
                  {{ $t('reports.realty.daysOption', { n: d }) }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div
          class="mb-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
        >
          <div class="flex overflow-x-auto">
            <button
              v-for="k in reportKeys"
              :key="k"
              @click="switchTab(k)"
              :class="
                active === k
                  ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              "
              class="flex-1 px-6 py-4 text-sm font-medium text-center whitespace-nowrap transition-colors duration-200"
            >
              {{ $t('reports.realty.types.' + k) }}
            </button>
          </div>
        </div>

        <div
          v-if="error"
          class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-sm text-red-700"
        >
          {{ error }}
        </div>

        <div
          v-if="loading"
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center text-gray-600 dark:text-gray-300"
        >
          {{ $t('reports.realty.loading') }}
        </div>

        <div v-else-if="!error">
          <!-- Stats -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div
              v-for="s in statDefs"
              :key="s.key"
              class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4"
            >
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {{ $t('reports.realty.stats.' + s.key) }}
              </p>
              <p
                v-if="s.type === 'num'"
                class="text-xl font-bold text-gray-900 dark:text-white"
              >
                {{ fmt(stats[s.key], 0) }}
              </p>
              <p
                v-else-if="s.type === 'pct'"
                class="text-xl font-bold text-gray-900 dark:text-white"
              >
                {{ fmt(stats[s.key], 1) }}%
              </p>
              <template v-else>
                <p
                  v-if="!mapLines(stats[s.key], s.type === 'pctmap').length"
                  class="text-xl font-bold text-gray-900 dark:text-white"
                >
                  -
                </p>
                <p
                  v-for="l in mapLines(stats[s.key], s.type === 'pctmap')"
                  :key="l.cur"
                  class="text-lg font-bold text-gray-900 dark:text-white"
                >
                  {{ l.text }}
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ l.cur }}</span>
                </p>
              </template>
            </div>
          </div>

          <!-- Table -->
          <div
            class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
          >
            <div
              v-if="!items.length"
              class="text-center py-12 text-gray-500 dark:text-gray-400"
            >
              {{ $t('reports.realty.noData') }}
            </div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th
                      v-for="c in colDefs"
                      :key="c.key"
                      class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                    >
                      {{ $t('reports.realty.cols.' + c.key) }}
                    </th>
                  </tr>
                </thead>
                <tbody
                  class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                >
                  <tr
                    v-for="(row, i) in items"
                    :key="i"
                    class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                  >
                    <td
                      v-for="c in colDefs"
                      :key="c.key"
                      class="px-4 py-3 text-center text-sm whitespace-nowrap"
                      :class="cellClass(c, row)"
                    >
                      {{ cell(c, row) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'

// [العمود, نوع العرض]
const COLS = {
  occupancy: [
    ['property', 'text'], ['floor', 'text'], ['total_units', 'num'], ['occupied', 'num'],
    ['vacant', 'num'], ['inactive', 'num'], ['occupancy_rate', 'pct'],
  ],
  rent_roll: [
    ['contract_number', 'text'], ['property', 'text'], ['floor', 'text'], ['unit', 'text'],
    ['tenant', 'text'], ['start_date', 'text'], ['end_date', 'text'], ['payment_frequency', 'freq'],
    ['rent_amount', 'money'], ['monthly_equivalent', 'money'], ['currency', 'text'],
    ['security_deposit', 'money'], ['annual_increase_percent', 'pct'],
  ],
  expiring_contracts: [
    ['contract_number', 'text'], ['property', 'text'], ['unit', 'text'], ['tenant', 'text'],
    ['phone', 'text'], ['end_date', 'text'], ['days_remaining', 'num'], ['rent_amount', 'money'],
    ['currency', 'text'], ['renewals_count', 'num'],
  ],
  tenant_arrears: [
    ['tenant', 'text'], ['contract_number', 'text'], ['property', 'text'], ['unit', 'text'],
    ['currency', 'text'], ['b0_30', 'bucket'], ['b31_60', 'bucket'], ['b61_90', 'bucket'],
    ['b90_plus', 'bucket'], ['total_due', 'money'], ['invoices_count', 'num'],
  ],
  collection: [
    ['month', 'text'], ['property', 'text'], ['currency', 'text'], ['due', 'money'],
    ['collected', 'money'], ['outstanding', 'money'], ['rate', 'pct'],
  ],
  vacant_units: [
    ['property', 'text'], ['floor', 'text'], ['unit', 'text'], ['area', 'money'],
    ['monthly_rent', 'money'], ['currency', 'text'], ['vacant_since', 'text'], ['vacant_days', 'num'],
  ],
  property_revenue: [
    ['property', 'text'], ['currency', 'text'], ['invoiced', 'money'], ['collected', 'money'],
    ['outstanding', 'money'], ['overdue', 'money'], ['rate', 'pct'], ['active_contracts', 'num'],
  ],
}

const STATS = {
  occupancy: [
    ['properties_count', 'num'], ['total_units', 'num'], ['occupied', 'num'],
    ['vacant', 'num'], ['inactive', 'num'], ['occupancy_rate', 'pct'],
  ],
  rent_roll: [
    ['contracts_count', 'num'], ['monthly_expected', 'map'], ['annual_expected', 'map'], ['deposits', 'map'],
  ],
  expiring_contracts: [
    ['total', 'num'], ['expired', 'num'], ['within_30', 'num'], ['within_60', 'num'],
    ['within_90', 'num'], ['monthly_at_risk', 'map'],
  ],
  tenant_arrears: [
    ['tenants_count', 'num'], ['invoices_count', 'num'], ['total_due', 'map'], ['over_90', 'map'],
  ],
  collection: [
    ['due', 'map'], ['collected', 'map'], ['outstanding', 'map'], ['collection_rate', 'pctmap'],
  ],
  vacant_units: [['vacant_count', 'num'], ['monthly_loss', 'map'], ['annual_loss', 'map']],
  property_revenue: [
    ['invoiced', 'map'], ['collected', 'map'], ['outstanding', 'map'], ['overdue', 'map'],
  ],
}

export default {
  name: 'RealtyReportsIndex',

  data() {
    return {
      metaLoading: true,
      metaError: null,
      reportKeys: [],
      properties: [],
      active: null,
      loading: false,
      exporting: false,
      error: null,
      items: [],
      stats: {},
      reqId: 0,
      filters: { property: 'all', start_date: '', end_date: '', days: 90 },
    }
  },

  computed: {
    colDefs() {
      return (COLS[this.active] || []).map(([key, type]) => ({ key, type }))
    },
    statDefs() {
      return (STATS[this.active] || []).map(([key, type]) => ({ key, type }))
    },
    showDates() {
      return this.active === 'collection' || this.active === 'property_revenue'
    },
    canExport() {
      return this.$store.getters['auth/hasPermission']('export_reports')
    },
    numLocale() {
      return this.$i18n.locale === 'en' ? 'en-US' : 'ar-SA'
    },
  },

  watch: {
    filters: {
      deep: true,
      handler() {
        this.load()
      },
    },
  },

  async mounted() {
    try {
      const res = await axios.get('/admin/reports/realty')
      const data = res.data?.data || {}
      this.reportKeys = data.reports || []
      this.properties = data.properties || []
      if (this.reportKeys.length) {
        this.active = this.reportKeys[0]
        await this.load()
      }
    } catch (e) {
      this.metaError = e.response?.data?.message || this.$t('reports.realty.loadFailed')
    } finally {
      this.metaLoading = false
    }
  },

  methods: {
    propertyLabel(p) {
      return this.$i18n.locale === 'en' && p.name_en ? p.name_en : p.name
    },

    params() {
      const p = { lang: this.$i18n.locale }
      if (this.filters.property === 'all') p.all = 1
      else p.property_id = this.filters.property
      if (this.showDates) {
        if (this.filters.start_date) p.start_date = this.filters.start_date
        if (this.filters.end_date) p.end_date = this.filters.end_date
      }
      if (this.active === 'expiring_contracts') p.days = this.filters.days
      return p
    },

    async switchTab(key) {
      if (key === this.active) return
      this.active = key
      await this.load()
    },

    async load() {
      if (!this.active) return
      const id = ++this.reqId
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(`/admin/reports/realty/${this.active}`, { params: this.params() })
        if (id !== this.reqId) return
        if (!res.data?.success) throw new Error(res.data?.message || '')
        this.items = Array.from(res.data.data?.items || [])
        this.stats = res.data.data?.stats || {}
      } catch (e) {
        if (id !== this.reqId) return
        this.items = []
        this.stats = {}
        this.error = e.response?.data?.message || e.message || this.$t('reports.realty.loadFailed')
      } finally {
        if (id === this.reqId) this.loading = false
      }
    },

    async exportExcel() {
      this.exporting = true
      this.error = null
      try {
        const res = await axios.get(`/admin/reports/realty/${this.active}/export`, {
          params: this.params(),
          responseType: 'blob',
        })
        if (res.data?.type?.includes('json')) {
          const body = JSON.parse(await res.data.text())
          throw new Error(body.message || '')
        }
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const a = document.createElement('a')
        a.href = url
        a.setAttribute('download', `realty_${this.active}_${new Date().toISOString().split('T')[0]}.xlsx`)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } catch (e) {
        let msg = e.message || ''
        const d = e.response?.data
        if (e.response?.status === 404) {
          msg = this.$t('reports.realty.noData')
        } else if (d instanceof Blob) {
          try {
            msg = JSON.parse(await d.text()).message || msg
          } catch (err) {
            /* keep msg */
          }
        }
        this.error = this.$t('reports.realty.exportFailed') + (msg ? ': ' + msg : '')
      } finally {
        this.exporting = false
      }
    },

    fmt(v, d = 2) {
      const n = Number(v)
      if (v === null || v === undefined || v === '' || !isFinite(n)) return '-'
      return new Intl.NumberFormat(this.numLocale, {
        minimumFractionDigits: d,
        maximumFractionDigits: d,
      }).format(n)
    },

    mapLines(map, pct = false) {
      return Object.entries(map || {}).map(([cur, v]) => ({
        cur,
        text: pct ? this.fmt(v, 1) + '%' : this.fmt(v, 2),
      }))
    },

    cell(c, row) {
      const v = row[c.key]
      if (v === null || v === undefined || v === '') return '-'
      switch (c.type) {
        case 'num':
          return this.fmt(v, 0)
        case 'money':
          return this.fmt(v, 2)
        case 'bucket':
          return Number(v) > 0 ? this.fmt(v, 2) : '-'
        case 'pct':
          return this.fmt(v, 1) + '%'
        case 'freq':
          return this.$te('reports.realty.freq.' + v) ? this.$t('reports.realty.freq.' + v) : v
        default:
          return v
      }
    },

    cellClass(c, row) {
      const v = row[c.key]
      if (c.key === 'days_remaining' && v !== null && v !== undefined) {
        if (v < 0) return 'text-red-600 font-semibold'
        if (v <= 30) return 'text-orange-600 font-semibold'
      }
      if (c.key === 'b90_plus' && Number(v) > 0) return 'text-red-700 font-semibold'
      return 'text-gray-700 dark:text-gray-300'
    },
  },
}
</script>
