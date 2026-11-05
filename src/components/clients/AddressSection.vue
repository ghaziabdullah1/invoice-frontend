<template>
  <div v-if="address" class="address-section">
    <div class="address-header">
      <svg
        class="w-4 h-4 text-gray-600 dark:text-slate-400 mt-0.5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      <span class="address-label">العنوان</span>
    </div>
    <p class="address-text">{{ address }}</p>
  </div>
</template>

<script>
export default {
  name: 'AddressSection',
  props: {
    address: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped>
.address-section {
  @apply mt-4 p-4 bg-gray-50/50 rounded-xl border border-gray-200/50;
}

.address-header {
  @apply flex items-center space-x-2 mb-2;
}

.address-label {
  @apply text-sm font-medium text-gray-700;
}

.address-text {
  @apply text-sm text-gray-700 leading-relaxed;
}
</style>
