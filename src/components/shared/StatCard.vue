<template>
  <div class="stat-card bg-white dark:bg-slate-800 rounded-lg shadow p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-600 dark:text-slate-400">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-slate-100 mt-2">{{ value }}</p>
      </div>
      <div :class="['p-3 rounded-lg', `bg-${color}-50`]">
        <i :class="[icon, `text-${color}-600`]" class="text-xl"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatCard',

  props: {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    color: {
      type: String,
      default: 'blue',
    },
  },
}
</script>
