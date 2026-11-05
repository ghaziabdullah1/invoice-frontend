<template>
  <div
    class="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg shadow-blue-100/30 p-6 mb-8"
  >
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg border border-blue-200/50">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-slate-200">{{ $t('common.filters') }}</h2>
          <p class="text-sm text-gray-500">{{ $t('users.filter_subtitle') }}</p>
        </div>
      </div>

      <div class="flex gap-3">
        <button
          @click="$emit('search')"
          class="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 transform hover:-translate-y-0.5"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {{ $t('buttons.search') }}
        </button>
        <button
          @click="$emit('reset')"
          class="px-5 py-2.5 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-700 dark:text-slate-300 rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2 border border-gray-200 dark:border-slate-700/50"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {{ $t('reports.buttons.reset_filters') }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Search -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">{{ $t('common.search') }}</label>
        <div class="relative">
          <input
            type="text"
            :value="modelValue.search"
            @input="update('search', $event.target.value)"
            :placeholder="$t('users.search_placeholder')"
            class="w-full px-4 py-3 pl-11 bg-white dark:bg-slate-800/80 border border-gray-300 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
          />
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            v-if="modelValue.search"
            @click="update('search', '')"
            type="button"
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-slate-400 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Group -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">{{ $t('users.group') }}</label>
        <div class="relative">
          <select
            :value="modelValue.group_id"
            @change="update('group_id', $event.target.value)"
            class="w-full px-4 py-3 bg-white dark:bg-slate-800/80 border border-gray-300 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 appearance-none pr-10"
          >
            <option value="">{{ $t('common.all') }}</option>
            <option v-for="group in groups" :key="group.id" :value="group.id">
              {{ $i18n.locale === 'ar' ? group.title_ar : group.title_en }}
            </option>
          </select>
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Status -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">{{ $t('common.status') }}</label>
        <div class="relative">
          <select
            :value="modelValue.status"
            @change="update('status', $event.target.value)"
            class="w-full px-4 py-3 bg-white dark:bg-slate-800/80 border border-gray-300 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 appearance-none pr-10"
          >
            <option value="all">{{ $t('common.all') }}</option>
            <option value="active">{{ $t('users.status.active') }}</option>
            <option value="inactive">{{ $t('users.status.inactive') }}</option>
          </select>
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Date From -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">{{ $t('common.date_from') }}</label>
        <div class="relative">
          <input
            type="date"
            :value="modelValue.date_from"
            @input="update('date_from', $event.target.value)"
            class="w-full px-4 py-3 bg-white dark:bg-slate-800/80 border border-gray-300 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
          />
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserFilters',

  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    groups: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['update:modelValue', 'search', 'reset'],

  methods: {
    update(field, value) {
      this.$emit('update:modelValue', { ...this.modelValue, [field]: value })
    },
  },
}
</script>
