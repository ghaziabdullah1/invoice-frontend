<template>
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">
            {{ $t('reports.export_options') }}
          </h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div class="space-y-4">
          <button @click="exportDirect" :disabled="isLoading" class="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-left flex items-start gap-4 disabled:opacity-50">
            <div class="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </div>
            <div>
              <p class="font-semibold text-gray-900 dark:text-white">{{ $t('reports.export_direct') }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('reports.export_direct_desc') }}</p>
            </div>
          </button>

          <button @click="exportServer" :disabled="isLoading" class="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 dark:hover:border-green-500 transition-colors text-left flex items-start gap-4 disabled:opacity-50">
            <div class="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>
            </div>
            <div>
              <p class="font-semibold text-gray-900 dark:text-white">{{ $t('reports.export_server') }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('reports.export_server_desc') }}</p>
            </div>
          </button>
        </div>

        <div v-if="errorMsg" class="mt-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm rounded-lg">
          {{ errorMsg }}
        </div>

        <div class="mt-6 flex justify-end">
          <button @click="$emit('close')" class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            {{ $t('common.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExportModal',
  props: {
    activeTab: { type: String, required: true },
    loading: { type: Boolean, default: false },
  },
  emits: ['close', 'export-direct', 'export-server'],
  data() {
    return { errorMsg: null, isLoading: false }
  },
  methods: {
    async exportDirect() {
      this.errorMsg = null;
      this.isLoading = true;
      try {
        await this.$store.dispatch('report/handleDirectExport');
        this.$emit('close');
      } catch (e) {
        this.errorMsg = e.message || 'Failed to export data. The server returned an error (404).';
      } finally {
        this.isLoading = false;
      }
    },
    async exportServer() {
      this.errorMsg = null;
      this.isLoading = true;
      try {
        await this.$store.dispatch('report/handleServerExport');
        this.$emit('close');
      } catch (e) {
        this.errorMsg = e.message || 'Failed to export data. The server returned an error (404).';
      } finally {
        this.isLoading = false;
      }
    },
  },
}
</script>
