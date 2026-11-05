<template>
  <div class="action-menu">
    <button
      @click="$emit('toggle')"
      class="p-2 text-gray-400 hover:text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:bg-slate-800 rounded-lg transition-colors duration-200"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
        />
      </svg>
    </button>

    <div v-if="show" class="action-dropdown">
      <button @click="$emit('view')" class="action-item view-item">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <span>عرض</span>
      </button>

      <button @click="$emit('edit')" class="action-item edit-item">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        <span>تعديل</span>
      </button>

      <div class="action-divider"></div>

      <button @click="$emit('delete')" class="action-item delete-item">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        <span>حذف</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActionMenu',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['toggle', 'view', 'edit', 'delete'],
}
</script>

<style scoped>
.action-menu {
  @apply relative;
}

.action-dropdown {
  @apply absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200/60 py-2 z-10 backdrop-blur-sm bg-white/95;
}

.action-item {
  @apply w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 flex items-center space-x-3;
}

.edit-item {
  @apply hover:bg-green-50 hover:text-green-600;
}

.delete-item {
  @apply hover:bg-red-50 hover:text-red-600;
}

.action-divider {
  @apply border-t border-gray-200/60 my-1;
}
</style>
