<template>
  <div>
    <div
      v-if="options.length > 1"
      class="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 pt-4 flex items-center justify-end"
    >
      <select
        :value="current"
        :aria-label="$t('nav.dashboard')"
        class="min-w-[12rem] px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-sm font-medium text-gray-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        @change="choose($event.target.value)"
      >
        <option
          v-for="option in options"
          :key="option.key"
          :value="option.key"
          class="dark:bg-slate-800 dark:text-slate-100"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <Dashboard v-if="current === 'general'" />
    <component :is="active.component" v-else-if="active" />
  </div>
</template>

<script>
import Dashboard from '@/views/Dashboard.vue'
import { DASHBOARD_MODULES } from '@/components/dashboard/modules'

const STORAGE_KEY = 'dashboard_view'
const GENERAL = 'general'

export default {
  name: 'DashboardPage',

  components: { Dashboard },

  data() {
    return {
      selected: this.readSaved(),
    }
  },

  computed: {
    // أقسام الموديولات التي يملك المستخدم صلاحية عرضها
    visibleModules() {
      const hasPermission = this.$store.getters['auth/hasPermission']
      return DASHBOARD_MODULES.filter((module) => hasPermission(module.permission))
    },

    // الخيارات: لوحة التحكم دائماً، ثم كل موديول مسموح للمستخدم
    options() {
      return [
        { key: GENERAL, label: this.$t('nav.dashboard') },
        ...this.visibleModules.map((module) => ({
          key: module.key,
          label: this.$t(module.labelKey || module.key),
        })),
      ]
    },

    // إن لم يعد الخيار المحفوظ مسموحاً (تغيّرت الصلاحيات) نرجع للوحة التحكم
    current() {
      return this.options.some((option) => option.key === this.selected) ? this.selected : GENERAL
    },

    active() {
      return this.visibleModules.find((module) => module.key === this.current) || null
    },
  },

  methods: {
    choose(key) {
      this.selected = key
      try {
        localStorage.setItem(STORAGE_KEY, key)
      } catch {
        // التخزين المحلي غير متاح: لا يؤثر على العرض
      }
    },

    readSaved() {
      try {
        return localStorage.getItem(STORAGE_KEY) || GENERAL
      } catch {
        return GENERAL
      }
    },
  },
}
</script>
