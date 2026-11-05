<template>
  <div class="relative w-full" :style="{ height: `${height}px` }">
    <canvas ref="canvas" role="img" :aria-label="ariaLabel"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

// دمج عميق للكائنات البسيطة فقط (المصفوفات والدوال تُستبدل كما هي)
const deepMerge = (target, source) => {
  const result = { ...target }

  Object.keys(source || {}).forEach((key) => {
    result[key] =
      isPlainObject(result[key]) && isPlainObject(source[key])
        ? deepMerge(result[key], source[key])
        : source[key]
  })

  return result
}

/**
 * غلاف عام لـ Chart.js يتعامل مع:
 * - البيانات كنسخة عادية (بدون Proxy) لتفادي أخطاء التفاعلية مع Chart.js
 * - الوضع الداكن (يتغير لون النصوص والشبكة عند تبديل كلاس dark)
 * - إعادة الرسم عند تغير البيانات أو الخيارات
 */
export default {
  name: 'BaseChart',

  props: {
    type: { type: String, required: true },
    chartData: { type: Object, required: true },
    chartOptions: { type: Object, default: () => ({}) },
    height: { type: Number, default: 280 },
    ariaLabel: { type: String, default: '' },
  },

  data() {
    return {
      isDark: false,
    }
  },

  watch: {
    chartData: {
      deep: true,
      handler() {
        this.refresh()
      },
    },
    chartOptions: {
      deep: true,
      handler() {
        this.refresh()
      },
    },
    type() {
      this.render()
    },
    isDark() {
      this.refresh()
    },
  },

  mounted() {
    this.observeTheme()
    this.render()
  },

  beforeUnmount() {
    if (this.observer) this.observer.disconnect()
    this.destroy()
  },

  methods: {
    observeTheme() {
      const root = document.documentElement
      this.isDark = root.classList.contains('dark')

      this.observer = new MutationObserver(() => {
        this.isDark = root.classList.contains('dark')
      })
      this.observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    },

    themedOptions() {
      const text = this.isDark ? '#cbd5e1' : '#475569'
      const grid = this.isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(100, 116, 139, 0.15)'

      const merged = deepMerge(
        {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 500 },
          plugins: { legend: { labels: { color: text, usePointStyle: true } } },
        },
        this.chartOptions,
      )

      const scales = {}
      Object.entries(merged.scales || {}).forEach(([key, scale]) => {
        scales[key] = deepMerge(
          { ticks: { color: text }, grid: { color: grid }, angleLines: { color: grid } },
          scale,
        )
        if (scale.title) scales[key].title = deepMerge({ color: text }, scale.title)
      })
      merged.scales = scales

      return merged
    },

    cloneData() {
      return JSON.parse(JSON.stringify(this.chartData))
    },

    render() {
      this.destroy()
      this.chart = new Chart(this.$refs.canvas, {
        type: this.type,
        data: this.cloneData(),
        options: this.themedOptions(),
      })
    },

    refresh() {
      if (!this.chart) {
        this.render()
        return
      }

      this.chart.data = this.cloneData()
      this.chart.options = this.themedOptions()
      this.chart.update()
    },

    destroy() {
      if (this.chart) {
        this.chart.destroy()
        this.chart = null
      }
    },
  },
}
</script>
