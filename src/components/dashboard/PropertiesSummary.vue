<template>
  <section class="ps-root">
    <div class="ps-content">
      <!-- ============ Hero ============ -->
      <header class="ps-hero">
        <div class="ps-hero-bg">
          <div class="ps-mesh ps-mesh-1"></div>
          <div class="ps-mesh ps-mesh-2"></div>
          <div class="ps-mesh ps-mesh-3"></div>
        </div>
        <div class="ps-hero-inner">
          <div class="ps-hero-main">
            <div v-if="summary" class="ps-badge">
              <span class="ps-badge-dot"></span>
              <span>{{ $t('realty.summary.kpi.properties') }}: {{ formatNumber(totals.properties_count) }}</span>
            </div>
            <h2 class="ps-hero-title">{{ $t('realty.summary.title') }}</h2>
            <p class="ps-hero-sub">
              {{ scoped ? $t('realty.summary.subtitle_one') : $t('realty.summary.subtitle_all') }}
            </p>
            <div class="ps-hero-controls">
              <select
                :value="selectedId ?? ''"
                :disabled="!rows.length"
                :aria-label="$t('realty.summary.select_property')"
                class="ps-select"
                @change="select($event.target.value ? Number($event.target.value) : null)"
              >
                <option value="">{{ $t('realty.summary.all_properties') }}</option>
                <option v-for="property in rows" :key="property.id" :value="property.id">
                  {{ propertyName(property) }}
                </option>
              </select>
              <button
                type="button"
                :disabled="loading"
                :title="$t('realty.summary.refresh')"
                class="ps-icon-btn"
                @click="load"
              >
                <svg :class="{ 'ps-spin': loading }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="summary" class="ps-perf">
            <div class="ps-perf-label">{{ $t('realty.summary.kpi.occupancy') }}</div>
            <div class="ps-perf-value">
              <span class="ps-perf-num">{{ totals.occupancy_rate ?? 0 }}<span class="ps-perf-unit">%</span></span>
            </div>
            <div class="ps-perf-bar">
              <div class="ps-perf-fill" :style="{ width: Math.min(totals.occupancy_rate ?? 0, 100) + '%' }"></div>
            </div>
            <div class="ps-perf-sub">
              {{ formatNumber(totals.occupied_units) }} / {{ formatNumber(totals.units_count) }}
              {{ $t('realty.summary.status.occupied') }}
            </div>
          </div>
        </div>
      </header>

      <!-- ============ Error ============ -->
      <div v-if="error" class="ps-error">{{ error }}</div>

      <!-- ============ Loading (first load) ============ -->
      <div v-if="!summary && loading" class="ps-kpi-grid">
        <div v-for="n in 6" :key="n" class="ps-skel"></div>
      </div>

      <!-- ============ Empty ============ -->
      <div v-else-if="summary && !rows.length" class="ps-empty">
        {{ $t('realty.summary.empty') }}
      </div>

      <!-- ============ Content ============ -->
      <div v-else-if="summary" class="ps-body" :class="{ 'ps-dim': loading }">
        <!-- KPIs -->
        <section class="ps-kpi-grid">
          <div
            v-for="kpi in kpis"
            :key="kpi.key"
            class="ps-kpi"
            :class="'ps-k-' + ({ properties: 'blue', floors: 'purple', units: 'blue', occupancy: 'green', contracts: 'amber', rent: 'green', vacant_rent: 'amber' }[kpi.key] || 'blue')"
          >
            <div class="ps-kpi-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path
                  :d="({
                    properties: 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
                    floors: 'M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3',
                    units: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z',
                    occupancy: 'M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6zM13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z',
                    contracts: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z',
                    rent: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33',
                    vacant_rent: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z',
                  })[kpi.key]"
                />
              </svg>
            </div>
            <div class="ps-kpi-value" :class="toneClass(kpi.tone)">{{ kpi.value }}</div>
            <div class="ps-kpi-label">{{ kpi.label }}</div>
            <div v-if="kpi.hint" class="ps-kpi-hint">{{ kpi.hint }}</div>
          </div>
        </section>

        <!-- Types (global only) -->
        <div v-if="!scoped && summary.by_type.length" class="ps-chips">
          <span class="ps-chips-label">{{ $t('realty.summary.by_type') }}</span>
          <span v-for="item in summary.by_type" :key="item.type" class="ps-chip">
            <span class="ps-chip-dot" :style="{ backgroundColor: typeColor(item.type) }"></span>
            {{ typeLabel(item.type) }}
            <span class="ps-chip-meta">
              {{ item.properties_count }} · {{ formatNumber(item.units_count) }} {{ $t('realty.summary.kpi.units') }}
            </span>
          </span>
        </div>

        <!-- Charts -->
        <section v-if="totals.units_count > 0 || hasExpiries" class="ps-charts">
          <!-- 1) Polar area: unit status -->
          <div class="ps-card">
            <div class="ps-card-head">
              <div>
                <h3 class="ps-card-title">{{ $t('realty.summary.charts.unit_status') }}</h3>
                <p class="ps-card-sub">{{ $t('realty.summary.charts.unit_status_hint') }}</p>
              </div>
            </div>
            <div class="ps-card-body">
              <BaseChart
                type="polarArea"
                :chart-data="unitStatusData"
                :chart-options="unitStatusOptions"
                :height="300"
                :aria-label="$t('realty.summary.charts.unit_status')"
              />
            </div>
          </div>

          <!-- 2) Stacked horizontal bars -->
          <div class="ps-card">
            <div class="ps-card-head">
              <div>
                <h3 class="ps-card-title">
                  {{ scoped ? $t('realty.summary.charts.by_floor') : $t('realty.summary.charts.by_property') }}
                </h3>
                <p class="ps-card-sub">{{ $t('realty.summary.charts.by_hint') }}</p>
              </div>
            </div>
            <div class="ps-card-body">
              <BaseChart
                v-if="stackedRows.length"
                type="bar"
                :chart-data="stackedData"
                :chart-options="stackedOptions"
                :height="stackedHeight"
                :aria-label="scoped ? $t('realty.summary.charts.by_floor') : $t('realty.summary.charts.by_property')"
              />
              <p v-else class="ps-muted">{{ $t('realty.summary.no_floors') }}</p>
            </div>
          </div>

          <!-- 3) Bubble (global) | Property details (scoped) -->
          <div class="ps-card">
            <template v-if="!scoped">
              <div class="ps-card-head">
                <div>
                  <h3 class="ps-card-title">{{ $t('realty.summary.charts.portfolio') }}</h3>
                  <p class="ps-card-sub">{{ $t('realty.summary.charts.portfolio_hint') }}</p>
                </div>
              </div>
              <div class="ps-card-body">
                <BaseChart
                  v-if="bubbleHasData"
                  type="bubble"
                  :chart-data="bubbleData"
                  :chart-options="bubbleOptions"
                  :height="300"
                  :aria-label="$t('realty.summary.charts.portfolio')"
                />
                <p v-else class="ps-muted">{{ $t('realty.summary.no_units') }}</p>
              </div>
            </template>

            <template v-else>
              <div class="ps-card-head">
                <div>
                  <h3 class="ps-card-title">{{ propertyName(summary.property) }}</h3>
                  <p class="ps-card-sub">{{ $t('realty.summary.info.title') }}</p>
                </div>
                <button type="button" class="ps-link" @click="select(null)">
                  {{ $t('realty.summary.back_to_all') }}
                </button>
              </div>
              <dl class="ps-card-body ps-info">
                <div v-for="item in infoItems" :key="item.key">
                  <dt class="ps-dt">{{ item.label }}</dt>
                  <dd class="ps-dd">
                    <span v-if="item.key === 'type'" class="ps-type">
                      <span class="ps-chip-dot" :style="{ backgroundColor: typeColor(summary.property.type) }"></span>
                      {{ item.value }}
                    </span>
                    <template v-else>{{ item.value || '—' }}</template>
                  </dd>
                </div>
              </dl>
            </template>
          </div>

          <!-- 4) Combo: expiry timeline -->
          <div class="ps-card">
            <div class="ps-card-head">
              <div>
                <h3 class="ps-card-title">{{ $t('realty.summary.charts.expiry') }}</h3>
                <p class="ps-card-sub">{{ $t('realty.summary.charts.expiry_hint') }}</p>
              </div>
            </div>
            <div class="ps-card-body">
              <BaseChart
                v-if="hasExpiries"
                type="bar"
                :chart-data="expiryData"
                :chart-options="expiryOptions"
                :height="300"
                :aria-label="$t('realty.summary.charts.expiry')"
              />
              <p v-else class="ps-muted">{{ $t('realty.summary.charts.no_expiries') }}</p>
            </div>
          </div>
        </section>

        <!-- Properties table (global) -->
        <div v-if="!scoped" class="ps-card">
          <div class="ps-card-head">
            <h3 class="ps-card-title">{{ $t('realty.summary.table.title') }}</h3>
          </div>
          <div class="ps-table-wrap">
            <table class="ps-table">
              <thead>
                <tr>
                  <th>{{ $t('realty.summary.table.property') }}</th>
                  <th>{{ $t('realty.summary.table.type') }}</th>
                  <th>{{ $t('realty.summary.table.floors') }}</th>
                  <th>{{ $t('realty.summary.table.units') }}</th>
                  <th class="ps-col-status">{{ $t('realty.summary.table.status') }}</th>
                  <th>{{ $t('realty.summary.table.occupancy') }}</th>
                  <th>{{ $t('realty.summary.table.rent') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in rows" :key="row.id" tabindex="0" @click="select(row.id)" @keydown.enter="select(row.id)">
                  <td>
                    <p class="ps-name">{{ propertyName(row) }}</p>
                    <p class="ps-city">
                      {{ row.city || '—' }}
                      <span v-if="!row.is_active" class="ps-pill">{{ $t('realty.summary.inactive') }}</span>
                    </p>
                  </td>
                  <td>{{ typeLabel(row.type) }}</td>
                  <td>{{ row.floors_count }}</td>
                  <td>{{ row.units_count }}</td>
                  <td>
                    <div class="ps-bar" :title="statusTitle(row)">
                      <div
                        v-for="status in statuses"
                        :key="status"
                        :style="{ width: segmentWidth(row, status), backgroundColor: statusColor(status) }"
                      ></div>
                    </div>
                    <p class="ps-bar-text">{{ statusTitle(row) }}</p>
                  </td>
                  <td class="ps-occ" :class="toneClass(occupancyTone(row.occupancy_rate))">{{ row.occupancy_rate }}%</td>
                  <td class="ps-rent">{{ formatMoney(row.contracted_monthly_rent) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Units by floor (scoped) -->
        <div v-else class="ps-card">
          <div class="ps-card-head">
            <h3 class="ps-card-title">{{ $t('realty.summary.units_title') }}</h3>
            <div class="ps-legend">
              <span v-for="status in statuses" :key="status" class="ps-legend-item">
                <span class="ps-chip-dot" :style="{ backgroundColor: statusColor(status) }"></span>
                {{ $t(`realty.summary.status.${status}`) }}
              </span>
            </div>
          </div>
          <div class="ps-card-body ps-floors">
            <p v-if="!summary.floors.length" class="ps-muted">{{ $t('realty.summary.no_floors') }}</p>

            <div v-for="floor in summary.floors" :key="floor.id">
              <div class="ps-floor-head">
                <h4 class="ps-floor-name">{{ floor.name }}</h4>
                <span class="ps-floor-meta">
                  {{ floor.occupied_units }}/{{ floor.units_count }} {{ $t('realty.summary.status.occupied') }}
                </span>
              </div>
              <p v-if="!floor.units.length" class="ps-floor-meta">{{ $t('realty.summary.no_units') }}</p>
              <div v-else class="ps-units">
                <span
                  v-for="unit in floor.units"
                  :key="unit.id"
                  class="ps-unit border"
                  :class="unitChipClass(unit.status)"
                  :title="unitTitle(unit)"
                >
                  {{ unit.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BaseChart from '@/components/charts/BaseChart.vue'
import propertySummaryApi from '@/api/propertySummary'
import { isRTL } from '@/plugins/i18n'

const STATUSES = ['occupied', 'reserved', 'vacant', 'inactive']

const STATUS_COLORS = {
  occupied: '#10b981',
  reserved: '#3b82f6',
  vacant: '#f59e0b',
  inactive: '#94a3b8',
}

const TYPE_COLORS = {
  residential: '#6366f1',
  commercial: '#0ea5e9',
  mixed: '#8b5cf6',
  industrial: '#f97316',
  unspecified: '#94a3b8',
}

export default {
  name: 'PropertiesSummary',

  components: { BaseChart },

  data() {
    return {
      summary: null,
      showAll: false,
      ready: false,
      loading: false,
      error: '',
      requestCounter: 0,
      statuses: STATUSES,
    }
  },

  computed: {
    isRtl() {
      return isRTL()
    },

    // العقار المختار في الشريط العلوي (مصدر الاختيار الوحيد)
    storeSelectedId() {
      return this.$store.state.propertyScope?.selectedPropertyId ?? null
    },

    // العقار الذي تُعرض بياناته: null = كل عقاراتي
    selectedId() {
      if (this.showAll || !this.storeSelectedId) return null
      return Number(this.storeSelectedId)
    },

    rows() {
      return this.summary?.properties ?? []
    },

    scoped() {
      return !!this.summary?.property
    },

    totals() {
      return this.summary?.totals ?? {}
    },

    hasExpiries() {
      return (this.summary?.expiry_timeline ?? []).some((item) => item.expiring_contracts > 0)
    },

    textDirection() {
      return this.isRtl ? 'rtl' : 'ltr'
    },

    legendOptions() {
      return { position: 'bottom', rtl: this.isRtl, textDirection: this.textDirection }
    },

    tooltipOptions() {
      return { rtl: this.isRtl, textDirection: this.textDirection }
    },

    kpis() {
      const totals = this.totals
      const statusHint = STATUSES.map(
        (status) => `${this.formatNumber(totals[`${status}_units`])} ${this.$t(`realty.summary.status.${status}`)}`,
      ).join(' · ')

      const common = {
        units: {
          key: 'units',
          label: this.$t('realty.summary.kpi.units'),
          value: this.formatNumber(totals.units_count),
          hint: statusHint,
        },
        occupancy: {
          key: 'occupancy',
          label: this.$t('realty.summary.kpi.occupancy'),
          value: `${totals.occupancy_rate ?? 0}%`,
          tone: this.occupancyTone(totals.occupancy_rate),
        },
        contracts: {
          key: 'contracts',
          label: this.$t('realty.summary.kpi.active_contracts'),
          value: this.formatNumber(totals.active_contracts),
          hint: this.$t('realty.summary.kpi.expiring', {
            count: totals.expiring_contracts ?? 0,
            days: this.summary?.expiring_days,
          }),
        },
        rent: {
          key: 'rent',
          label: this.$t('realty.summary.kpi.monthly_rent'),
          value: this.formatMoney(totals.contracted_monthly_rent),
        },
      }

      if (this.scoped) {
        return [
          {
            key: 'floors',
            label: this.$t('realty.summary.kpi.floors'),
            value: this.formatNumber(totals.floors_count),
          },
          common.units,
          common.occupancy,
          common.contracts,
          common.rent,
          {
            key: 'vacant_rent',
            label: this.$t('realty.summary.kpi.vacant_rent'),
            value: this.formatMoney(totals.vacant_monthly_rent),
            tone: totals.vacant_monthly_rent > 0 ? 'warn' : undefined,
          },
        ]
      }

      return [
        {
          key: 'properties',
          label: this.$t('realty.summary.kpi.properties'),
          value: this.formatNumber(totals.properties_count),
        },
        {
          key: 'floors',
          label: this.$t('realty.summary.kpi.floors'),
          value: this.formatNumber(totals.floors_count),
        },
        common.units,
        common.occupancy,
        common.contracts,
        common.rent,
      ]
    },

    infoItems() {
      const property = this.summary?.property
      if (!property) return []

      return [
        { key: 'type', label: this.$t('realty.summary.info.type'), value: this.typeLabel(property.type) },
        { key: 'city', label: this.$t('realty.summary.info.city'), value: property.city },
        { key: 'address', label: this.$t('realty.summary.info.address'), value: property.address },
        { key: 'phone', label: this.$t('realty.summary.info.phone'), value: property.phone },
        { key: 'email', label: this.$t('realty.summary.info.email'), value: property.email },
        { key: 'floors', label: this.$t('realty.summary.info.floors'), value: String(property.floors_count) },
      ]
    },

    // ───────── 1) Polar area: حالة الوحدات ─────────
    unitStatusData() {
      const status = this.summary?.unit_status ?? {}

      return {
        labels: STATUSES.map((item) => this.$t(`realty.summary.status.${item}`)),
        datasets: [
          {
            data: STATUSES.map((item) => status[item] ?? 0),
            backgroundColor: STATUSES.map((item) => `${STATUS_COLORS[item]}cc`),
            borderColor: STATUSES.map((item) => STATUS_COLORS[item]),
            borderWidth: 1,
          },
        ],
      }
    },

    unitStatusOptions() {
      return {
        plugins: { legend: this.legendOptions, tooltip: this.tooltipOptions },
        scales: { r: { ticks: { precision: 0, backdropColor: 'transparent' } } },
      }
    },

    // ───────── 2) Stacked horizontal bars: الوحدات لكل عقار / طابق ─────────
    stackedRows() {
      if (this.scoped) return this.summary?.floors ?? []
      return this.rows.filter((row) => row.units_count > 0)
    },

    stackedHeight() {
      return Math.max(260, this.stackedRows.length * 38 + 90)
    },

    stackedData() {
      return {
        labels: this.stackedRows.map((row) => (this.scoped ? row.name : this.propertyName(row))),
        datasets: STATUSES.map((status) => ({
          label: this.$t(`realty.summary.status.${status}`),
          data: this.stackedRows.map((row) => row[`${status}_units`]),
          backgroundColor: STATUS_COLORS[status],
          borderRadius: 4,
        })),
      }
    },

    stackedOptions() {
      return {
        indexAxis: 'y',
        plugins: { legend: this.legendOptions, tooltip: this.tooltipOptions },
        scales: {
          x: { stacked: true, beginAtZero: true, reverse: this.isRtl, ticks: { precision: 0 } },
          y: { stacked: true, position: this.isRtl ? 'right' : 'left' },
        },
      }
    },

    // ───────── 3) Bubble: خريطة المحفظة (الحجم × الإشغال × الإيجار) ─────────
    bubbleRows() {
      return this.rows.filter((row) => row.units_count > 0)
    },

    bubbleHasData() {
      return this.bubbleRows.length > 0
    },

    bubbleData() {
      const maxRent = Math.max(...this.bubbleRows.map((row) => row.contracted_monthly_rent), 0)
      const types = [...new Set(this.bubbleRows.map((row) => row.type || 'unspecified'))]

      return {
        datasets: types.map((type) => ({
          label: this.typeLabel(type),
          data: this.bubbleRows
            .filter((row) => (row.type || 'unspecified') === type)
            .map((row) => ({
              x: row.units_count,
              y: row.occupancy_rate,
              r: maxRent > 0 ? 6 + (row.contracted_monthly_rent / maxRent) * 16 : 8,
              name: this.propertyName(row),
              rent: row.contracted_monthly_rent,
            })),
          backgroundColor: `${this.typeColor(type)}99`,
          borderColor: this.typeColor(type),
          borderWidth: 1.5,
        })),
      }
    },

    bubbleOptions() {
      return {
        plugins: {
          legend: this.legendOptions,
          tooltip: {
            ...this.tooltipOptions,
            callbacks: {
              label: (context) => {
                const point = context.raw
                return `${point.name} — ${point.x} ${this.$t('realty.summary.kpi.units')} · ${point.y}% · ${this.formatMoney(point.rent)}`
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            reverse: this.isRtl,
            ticks: { precision: 0 },
            title: { display: true, text: this.$t('realty.summary.charts.x_units') },
          },
          y: {
            min: 0,
            max: 100,
            position: this.isRtl ? 'right' : 'left',
            ticks: { callback: (value) => `${value}%` },
            title: { display: true, text: this.$t('realty.summary.charts.y_occupancy') },
          },
        },
      }
    },

    // ───────── 4) Combo bar + line: جدول انتهاء العقود ─────────
    expiryData() {
      const timeline = this.summary?.expiry_timeline ?? []

      return {
        labels: timeline.map((item) => this.formatMonth(item.month)),
        datasets: [
          {
            type: 'bar',
            label: this.$t('realty.summary.charts.contracts'),
            data: timeline.map((item) => item.expiring_contracts),
            backgroundColor: '#6366f1aa',
            borderColor: '#6366f1',
            borderWidth: 1,
            borderRadius: 6,
            yAxisID: 'y',
          },
          {
            type: 'line',
            label: this.$t('realty.summary.charts.rent_at_risk'),
            data: timeline.map((item) => item.monthly_rent),
            borderColor: '#f43f5e',
            backgroundColor: '#f43f5e',
            tension: 0.35,
            pointRadius: 3,
            yAxisID: 'y1',
          },
        ],
      }
    },

    expiryOptions() {
      return {
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: this.legendOptions, tooltip: this.tooltipOptions },
        scales: {
          x: { reverse: this.isRtl },
          y: {
            beginAtZero: true,
            position: this.isRtl ? 'right' : 'left',
            ticks: { precision: 0 },
          },
          y1: {
            beginAtZero: true,
            position: this.isRtl ? 'left' : 'right',
            grid: { drawOnChartArea: false },
          },
        },
      }
    },
  },

  watch: {
    // تغيير العقار من الشريط العلوي: نرجع لعرض العقار المختار ونعيد التحميل
    storeSelectedId() {
      if (!this.ready) return
      this.showAll = false
      this.load()
    },
  },

  async mounted() {
    // ضمان تحميل عقارات المستخدم (الشريط العلوي مخفي على الجوال)
    try {
      await this.$store.dispatch('propertyScope/fetchMyProperties')
    } catch {
      // الخطأ يظهر من طلب الملخص نفسه
    }
    this.ready = true
    this.load()
  },

  methods: {
    async load() {
      const requestId = ++this.requestCounter
      this.loading = true
      this.error = ''

      try {
        const response = await propertySummaryApi.getSummary(
          this.selectedId ? { property_id: this.selectedId } : {},
        )
        if (requestId !== this.requestCounter) return

        this.summary = response.data.data
      } catch (error) {
        if (requestId !== this.requestCounter) return

        // العقار المحفوظ لم يعد موجوداً: نرجع لعرض كل العقارات
        if (this.selectedId && error.response?.status === 404) {
          this.select(null)
          return
        }

        this.error = error.response?.data?.message || this.$t('realty.summary.load_error')
      } finally {
        if (requestId === this.requestCounter) this.loading = false
      }
    },

    select(id) {
      if (!id) {
        // كل عقاراتي: عرض تجميعي محلي لا يغيّر عقار الشريط العلوي
        this.showAll = true
        this.load()
        return
      }

      this.showAll = false

      // الاختيار يُكتب في propertyScope فيتبدّل عقار الشريط العلوي ويُعاد التحميل من المراقب
      if (String(id) === String(this.storeSelectedId)) {
        this.load()
        return
      }
      this.$store.dispatch('propertyScope/selectProperty', id)
    },

    propertyName(property) {
      return this.isRtl ? property.name : property.name_en || property.name
    },

    typeLabel(type) {
      return this.$t(`realty.property.types.${type || 'unspecified'}`)
    },

    typeColor(type) {
      return TYPE_COLORS[type || 'unspecified'] ?? TYPE_COLORS.unspecified
    },

    statusColor(status) {
      return STATUS_COLORS[status]
    },

    segmentWidth(row, status) {
      return row.units_count ? `${(row[`${status}_units`] / row.units_count) * 100}%` : '0%'
    },

    statusTitle(row) {
      return STATUSES.map((status) => `${row[`${status}_units`]} ${this.$t(`realty.summary.status.${status}`)}`).join(' · ')
    },

    unitChipClass(status) {
      const classes = {
        occupied: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300',
        reserved: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
        vacant: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300',
        inactive: 'bg-gray-100 border-gray-200 text-gray-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300',
      }
      return classes[status] || classes.inactive
    },

    unitTitle(unit) {
      const parts = [this.$t(`realty.summary.status.${unit.status}`)]
      if (unit.area) parts.push(`${unit.area} ${this.$t('realty.summary.sqm')}`)
      if (unit.monthly_rent !== null && unit.monthly_rent !== undefined) parts.push(this.formatMoney(unit.monthly_rent))
      return parts.join(' · ')
    },

    occupancyTone(rate) {
      if (rate >= 90) return 'good'
      if (rate >= 60) return 'warn'
      return 'bad'
    },

    toneClass(tone) {
      const classes = {
        good: 'text-emerald-600 dark:text-emerald-400',
        warn: 'text-amber-600 dark:text-amber-400',
        bad: 'text-rose-600 dark:text-rose-400',
      }
      return classes[tone] || 'text-gray-900 dark:text-slate-100'
    },

    formatNumber(value) {
      return Number(value ?? 0).toLocaleString()
    },

    formatMoney(value) {
      return Number(value ?? 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    },

    formatMonth(month) {
      return new Date(`${month}-01T00:00:00`).toLocaleDateString(this.isRtl ? 'ar' : 'en', {
        month: 'short',
        year: '2-digit',
      })
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap');

.ps-root {
  font-family: 'Cairo', sans-serif;
  background: #f8fafc;
  min-height: 100vh;
}
.ps-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
@media (max-width: 480px) {
  .ps-content {
    padding: 1rem;
    gap: 1rem;
  }
}
.ps-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transition: opacity 0.2s;
}
.ps-dim {
  opacity: 0.6;
  pointer-events: none;
}

/* ─── Hero ─── */
.ps-hero {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  background: #0f172a;
  padding: 2.5rem;
}
@media (max-width: 640px) {
  .ps-hero {
    padding: 1.5rem;
    border-radius: 18px;
  }
}
.ps-hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.ps-mesh {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.35;
}
.ps-mesh-1 {
  width: 500px;
  height: 500px;
  top: -200px;
  right: -100px;
  background: rgb(var(--color-primary-500));
}
.ps-mesh-2 {
  width: 350px;
  height: 350px;
  bottom: -150px;
  left: 200px;
  background: #8b5cf6;
}
.ps-mesh-3 {
  width: 250px;
  height: 250px;
  top: 50px;
  left: -50px;
  background: #06b6d4;
  opacity: 0.2;
}
.ps-hero-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
}
.ps-hero-main {
  flex: 1;
  min-width: 280px;
}
.ps-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 100px;
  margin-bottom: 1rem;
  color: #34d399;
  font-size: 0.78rem;
  font-weight: 600;
}
.ps-badge-dot {
  width: 7px;
  height: 7px;
  background: #10b981;
  border-radius: 50%;
  animation: ps-pulse 2s ease-in-out infinite;
}
@keyframes ps-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}
.ps-hero-title {
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.5rem;
  line-height: 1.2;
}
.ps-hero-sub {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.9rem;
  margin: 0;
}
.ps-hero-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.25rem;
}
.ps-select {
  min-width: 13rem;
  padding: 0.6rem 0.9rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #fff;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}
.ps-select:focus {
  outline: none;
  border-color: #a5b4fc;
  box-shadow: 0 0 0 3px rgba(165, 180, 252, 0.25);
}
.ps-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.ps-select option {
  color: #0f172a;
  background: #fff;
}
.ps-icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}
.ps-icon-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.16);
}
.ps-icon-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.ps-icon-btn svg {
  width: 16px;
  height: 16px;
}
.ps-spin {
  animation: ps-rotate 1s linear infinite;
}
@keyframes ps-rotate {
  to {
    transform: rotate(360deg);
  }
}
.ps-perf {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  padding: 1.5rem 2rem;
  min-width: 220px;
  backdrop-filter: blur(10px);
}
.ps-perf-label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.78rem;
  margin-bottom: 0.5rem;
}
.ps-perf-value {
  margin-bottom: 1rem;
}
.ps-perf-num {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}
.ps-perf-unit {
  font-size: 1.2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
}
.ps-perf-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}
.ps-perf-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 99px;
  transition: width 1s ease;
}
.ps-perf-sub {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.72rem;
}

/* ─── States ─── */
.ps-error {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 12px;
  color: #b91c1c;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 14px 18px;
}
.ps-empty {
  background: #fff;
  border: 1px dashed #cbd5e1;
  border-radius: 20px;
  padding: 3rem 1rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
}
.ps-skel {
  height: 118px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #f1f5f9;
  animation: ps-skel 1.4s ease-in-out infinite;
}
@keyframes ps-skel {
  50% {
    opacity: 0.5;
  }
}
.ps-muted {
  padding: 2.5rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: #94a3b8;
}

/* ─── KPI ─── */
.ps-kpi-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 1rem;
}
@media (max-width: 1280px) {
  .ps-kpi-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 760px) {
  .ps-kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 480px) {
  .ps-kpi-grid {
    grid-template-columns: 1fr;
  }
}
.ps-kpi {
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 20px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  transition:
    transform 0.25s,
    box-shadow 0.25s;
}
.ps-kpi:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
}
.ps-kpi-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}
.ps-kpi-icon svg {
  width: 22px;
  height: 22px;
}
.ps-k-green .ps-kpi-icon {
  background: #ecfdf5;
  color: #059669;
}
.ps-k-blue .ps-kpi-icon {
  background: #eef2ff;
  color: #6366f1;
}
.ps-k-purple .ps-kpi-icon {
  background: #f5f3ff;
  color: #7c3aed;
}
.ps-k-amber .ps-kpi-icon {
  background: #fffbeb;
  color: #d97706;
}
.ps-kpi-value {
  font-size: 1.65rem;
  font-weight: 800;
  line-height: 1;
}
.ps-kpi-label {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
}
.ps-kpi-hint {
  font-size: 0.72rem;
  color: #94a3b8;
  line-height: 1.5;
}

/* ─── Chips ─── */
.ps-chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}
.ps-chips-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #94a3b8;
}
.ps-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 100px;
  background: #fff;
  border: 1px solid #f1f5f9;
  color: #334155;
  font-size: 0.78rem;
  font-weight: 600;
}
.ps-chip-meta {
  color: #94a3b8;
}
.ps-chip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

/* ─── Cards ─── */
.ps-charts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
@media (max-width: 1100px) {
  .ps-charts {
    grid-template-columns: minmax(0, 1fr);
  }
}
.ps-card {
  background: #fff;
  border: 1px solid #f1f5f9;
  border-radius: 20px;
  overflow: hidden;
}
.ps-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f8fafc;
}
.ps-card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.2rem;
}
.ps-card-sub {
  font-size: 0.78rem;
  color: #94a3b8;
  margin: 0;
}
.ps-card-body {
  padding: 1.5rem;
}
.ps-link {
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  color: #6366f1;
  background: #eef2ff;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}
.ps-link:hover {
  background: #e0e7ff;
}

/* ─── Property info ─── */
.ps-info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem 1.5rem;
  margin: 0;
}
@media (max-width: 640px) {
  .ps-info {
    grid-template-columns: minmax(0, 1fr);
  }
}
.ps-dt {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #94a3b8;
}
.ps-dd {
  margin: 0.3rem 0 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
  word-break: break-word;
}
.ps-type {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  border-radius: 100px;
  background: #f1f5f9;
  font-size: 0.78rem;
}

/* ─── Table ─── */
.ps-table-wrap {
  overflow-x: auto;
}
.ps-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  color: #334155;
}
.ps-table th {
  padding: 0.75rem 1rem;
  text-align: start;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #94a3b8;
  background: #fafbfc;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}
.ps-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #f8fafc;
  vertical-align: middle;
}
.ps-table tbody tr {
  cursor: pointer;
  transition: background 0.2s;
}
.ps-table tbody tr:hover {
  background: #f8fafc;
}
.ps-table tbody tr:last-child td {
  border-bottom: none;
}
.ps-col-status {
  min-width: 11rem;
}
.ps-name {
  margin: 0;
  font-weight: 700;
  color: #0f172a;
}
.ps-city {
  margin: 2px 0 0;
  font-size: 0.72rem;
  color: #94a3b8;
}
.ps-pill {
  margin-inline-start: 8px;
  padding: 2px 8px;
  border-radius: 100px;
  background: #f1f5f9;
  color: #64748b;
}
.ps-bar {
  display: flex;
  height: 10px;
  border-radius: 99px;
  overflow: hidden;
  background: #f1f5f9;
}
.ps-bar-text {
  margin: 4px 0 0;
  font-size: 0.68rem;
  color: #94a3b8;
}
.ps-occ {
  font-weight: 800;
}
.ps-rent {
  font-weight: 700;
  color: #0f172a;
}

/* ─── Floors / units ─── */
.ps-legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.9rem;
}
.ps-legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #64748b;
}
.ps-floors {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.ps-floor-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.ps-floor-name {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 700;
  color: #0f172a;
}
.ps-floor-meta {
  margin: 0;
  font-size: 0.75rem;
  color: #94a3b8;
}
.ps-units {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.ps-unit {
  padding: 0.3rem 0.7rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* ============================================================
   الوضع الداكن — بنفس ألوان لوحة التحكم الرئيسية
   ============================================================ */
.dark .ps-root {
  background: #0b0f19;
}
.dark .ps-kpi,
.dark .ps-card,
.dark .ps-skel,
.dark .ps-chip,
.dark .ps-empty {
  background: #1e293b;
  border-color: #334155;
}
.dark .ps-card-head {
  border-bottom-color: #334155;
}
.dark .ps-card-title,
.dark .ps-dd,
.dark .ps-name,
.dark .ps-rent,
.dark .ps-floor-name {
  color: #f8fafc;
}
.dark .ps-chip,
.dark .ps-table {
  color: #cbd5e1;
}
.dark .ps-table th {
  background: #0f172a;
  border-bottom-color: #334155;
}
.dark .ps-table td {
  border-bottom-color: #334155;
}
.dark .ps-table tbody tr:hover {
  background: #0f172a;
}
.dark .ps-bar {
  background: #334155;
}
.dark .ps-pill,
.dark .ps-type {
  background: #334155;
  color: #cbd5e1;
}
.dark .ps-link {
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
}
.dark .ps-k-green .ps-kpi-icon {
  background: rgba(5, 150, 105, 0.15);
}
.dark .ps-k-blue .ps-kpi-icon {
  background: rgba(99, 102, 241, 0.15);
}
.dark .ps-k-purple .ps-kpi-icon {
  background: rgba(124, 58, 237, 0.15);
}
.dark .ps-k-amber .ps-kpi-icon {
  background: rgba(217, 119, 6, 0.15);
}
.dark .ps-legend-item {
  color: #94a3b8;
}
.dark .ps-error {
  color: #fca5a5;
}
.dark .ps-select option {
  color: #f8fafc;
  background: #1e293b;
}
</style>
