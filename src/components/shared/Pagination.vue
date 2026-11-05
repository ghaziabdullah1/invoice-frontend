<template>
  <div
    v-if="pagination && pagination.total > pagination.per_page"
    class="mt-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-4"
  >
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="text-sm text-gray-700 dark:text-slate-300">
        {{
          $t('pagination.showing', {
            from: pagination.from || 1,
            to: pagination.to || pagination.total,
            total: pagination.total,
          })
        }}
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="$emit('change', pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="px-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded-lg text-sm hover:bg-gray-50 dark:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="hidden sm:inline">{{ $t('pagination.previous') }}</span>
        </button>

        <div class="flex items-center gap-1">
          <button
            v-for="page in paginationRange"
            :key="page"
            @click="page !== '...' && $emit('change', page)"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200',
              page === pagination.current_page
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:bg-slate-900',
              page === '...' ? 'cursor-default hover:bg-transparent' : '',
            ]"
            :disabled="page === '...'"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="$emit('change', pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="px-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded-lg text-sm hover:bg-gray-50 dark:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <span class="hidden sm:inline">{{ $t('pagination.next') }}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',

  props: {
    pagination: {
      type: Object,
      required: true,
    },
  },

  emits: ['change'],

  computed: {
    paginationRange() {
      const current = this.pagination.current_page
      const last = this.pagination.last_page
      const delta = 2
      const range = []
      const rangeWithDots = []
      let l

      for (let i = 1; i <= last; i++) {
        if (i === 1 || i === last || (i >= current - delta && i <= current + delta)) {
          range.push(i)
        }
      }

      for (const i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1)
          } else if (i - l !== 1) {
            rangeWithDots.push('...')
          }
        }
        rangeWithDots.push(i)
        l = i
      }

      return rangeWithDots
    },
  },
}
</script>
