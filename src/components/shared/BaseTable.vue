<template>
  <div class="table-container">
    <div v-if="showHeader" class="table-header">
      <div class="table-title">
        <h3 v-if="title" class="text-lg font-semibold text-gray-900 dark:text-slate-100">{{ title }}</h3>
        <p v-if="description" class="text-sm text-gray-600 dark:text-slate-400 mt-1">{{ description }}</p>
      </div>

      <div v-if="$slots.actions" class="table-actions">
        <slot name="actions"></slot>
      </div>
    </div>

    <div class="table-wrapper">
      <table :class="tableClasses" class="base-table">
        <thead>
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'table-header-cell',
                column.align ? `text-${column.align}` : '',
                column.class || '',
              ]"
            >
              <div class="header-content">
                <span>{{ column.label }}</span>
                <button v-if="column.sortable" @click="sortBy(column.key)" class="sort-button">
                  <font-awesome-icon
                    :icon="[
                      'fas',
                      sortKey === column.key
                        ? sortOrder === 'asc'
                          ? 'sort-up'
                          : 'sort-down'
                        : 'sort',
                    ]"
                  />
                </button>
              </div>
            </th>
            <th v-if="showActions" class="table-header-cell text-center">الإجراءات</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td :colspan="columns.length + (showActions ? 1 : 0)" class="text-center py-8">
              <LoadingSpinner />
              <p class="text-gray-500 mt-2">{{ $t('common.loading') }}</p>
            </td>
          </tr>

          <tr v-else-if="!data || data.length === 0">
            <td :colspan="columns.length + (showActions ? 1 : 0)" class="text-center py-8">
              <div class="empty-state">
                <font-awesome-icon :icon="['fas', 'inbox']" class="text-gray-400 text-4xl mb-3" />
                <p class="text-gray-500">{{ emptyText }}</p>
              </div>
            </td>
          </tr>

          <tr
            v-else
            v-for="(row, index) in sortedData"
            :key="row.id || index"
            :class="['table-row', { 'hover-row': hoverable }]"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="['table-cell', column.align ? `text-${column.align}` : '']"
            >
              <slot :name="`cell-${column.key}`" :row="row">
                {{ row[column.key] }}
              </slot>
            </td>

            <td v-if="showActions" class="table-cell">
              <div class="action-buttons">
                <slot name="actions" :row="row"></slot>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showPagination && pagination" class="table-footer">
      <div class="pagination-info">
        عرض {{ pagination.from }} إلى {{ pagination.to }} من {{ pagination.total }} عنصر
      </div>

      <div class="pagination-controls">
        <BaseButton
          @click="previousPage"
          :disabled="!pagination.prev_page_url"
          size="sm"
          type="outline"
        >
          السابق
        </BaseButton>

        <div class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="['page-button', { active: page === pagination.current_page }]"
          >
            {{ page }}
          </button>
        </div>

        <BaseButton
          @click="nextPage"
          :disabled="!pagination.next_page_url"
          size="sm"
          type="outline"
        >
          التالي
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import LoadingSpinner from './LoadingSpinner.vue'
import BaseButton from './BaseButton.vue'

export default {
  name: 'BaseTable',
  components: {
    LoadingSpinner,
    BaseButton,
  },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    showActions: {
      type: Boolean,
      default: false,
    },
    showPagination: {
      type: Boolean,
      default: false,
    },
    hoverable: {
      type: Boolean,
      default: true,
    },
    striped: {
      type: Boolean,
      default: false,
    },
    bordered: {
      type: Boolean,
      default: true,
    },
    emptyText: {
      type: String,
      default: 'لا توجد بيانات',
    },
    pagination: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      sortKey: '',
      sortOrder: 'asc',
    }
  },
  computed: {
    tableClasses() {
      return ['base-table', { 'table-striped': this.striped }, { 'table-bordered': this.bordered }]
    },

    sortedData() {
      if (!this.sortKey) return this.data

      return [...this.data].sort((a, b) => {
        let aValue = a[this.sortKey]
        let bValue = b[this.sortKey]

        // Handle null/undefined values
        if (aValue == null) aValue = ''
        if (bValue == null) bValue = ''

        // Convert to string for comparison if not both numbers
        if (typeof aValue !== 'number' || typeof bValue !== 'number') {
          aValue = String(aValue).toLowerCase()
          bValue = String(bValue).toLowerCase()
        }

        if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1
        return 0
      })
    },

    visiblePages() {
      if (!this.pagination) return []

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

      range.forEach((i) => {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1)
          } else if (i - l !== 1) {
            rangeWithDots.push('...')
          }
        }
        rangeWithDots.push(i)
        l = i
      })

      return rangeWithDots
    },
  },
  methods: {
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortKey = key
        this.sortOrder = 'asc'
      }
      this.$emit('sort', { key: this.sortKey, order: this.sortOrder })
    },

    previousPage() {
      if (this.pagination && this.pagination.current_page > 1) {
        this.$emit('page-change', this.pagination.current_page - 1)
      }
    },

    nextPage() {
      if (this.pagination && this.pagination.current_page < this.pagination.last_page) {
        this.$emit('page-change', this.pagination.current_page + 1)
      }
    },

    goToPage(page) {
      if (page !== '...' && page !== this.pagination.current_page) {
        this.$emit('page-change', page)
      }
    },
  },
}
</script>

<style scoped>
.table-container {
  @apply bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700;
}

.table-header {
  @apply px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between;
}

.table-title {
  @apply flex-1;
}

.table-actions {
  @apply flex items-center gap-2;
}

.table-wrapper {
  @apply overflow-x-auto;
}

.base-table {
  @apply min-w-full divide-y divide-gray-200 dark:divide-slate-700;
}

.table-header-cell {
  @apply px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-slate-700/50;
}

.header-content {
  @apply flex items-center gap-2;
}

.sort-button {
  @apply text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none;
}

.table-cell {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100;
}

.table-row {
  @apply transition-colors duration-150;
}

.hover-row:hover {
  @apply bg-gray-50 dark:bg-slate-700/30;
}

.table-striped tbody tr:nth-child(odd) {
  @apply bg-gray-50/50 dark:bg-slate-700/10;
}

.table-bordered {
  @apply border border-gray-200 dark:border-slate-700;
}

.empty-state {
  @apply py-8 text-center;
}

.action-buttons {
  @apply flex items-center gap-2 justify-center;
}

.table-footer {
  @apply px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between;
}

.pagination-info {
  @apply text-sm text-gray-700 dark:text-gray-400;
}

.pagination-controls {
  @apply flex items-center gap-2;
}

.page-numbers {
  @apply flex items-center gap-1;
}

.page-button {
  @apply w-8 h-8 flex items-center justify-center text-sm rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 transition-colors;
}

.page-button.active {
  @apply bg-primary-600 text-white hover:bg-primary-700;
}

.rtl .header-content {
  @apply flex-row-reverse;
}
</style>
