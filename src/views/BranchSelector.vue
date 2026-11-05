<template>
  <div class="relative" ref="branchDropdownRef">
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      :class="{ 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400': isOpen }"
      :title="selectedBranch?.name || $t('branch.select_branch')"
    >
      <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
        <svg
          class="w-4 h-4 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      </div>
      <span class="font-medium truncate max-w-[120px] hidden md:block">
        {{ selectedBranch?.name || $t('branch.select_branch') }}
      </span>
      <svg
        class="w-3 h-3 text-gray-400 transition-transform duration-200"
        :class="isOpen ? 'rotate-180' : ''"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-2"
    >
      <div
        v-if="isOpen"
        class="absolute mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/30 border border-gray-100 dark:border-slate-700 z-50 overflow-hidden"
        :class="$i18n.locale === 'ar' ? 'left-0' : 'right-0'"
      >
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
          <p class="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {{ $t('branch.your_branches') }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ $t('branch.select_to_filter') }}
          </p>
        </div>

        <!-- Branches List -->
        <div class="max-h-64 overflow-y-auto custom-scrollbar">
          <button
            v-for="branch in branches"
            :key="branch.id"
            @click="selectBranch(branch.id)"
            class="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors"
            :class="[
              selectedBranchId == branch.id
                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-r-2 border-blue-500'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-700/50',
            ]"
          >
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="selectedBranchId == branch.id
                ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600'
                : 'bg-gray-100 dark:bg-slate-700 text-gray-500'"
            >
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </div>
            <div class="flex-1 text-right">
              <p class="font-medium">{{ branch.name }}</p>
              <p v-if="branch.city" class="text-xs text-gray-500 dark:text-gray-400">
                {{ branch.city }}
              </p>
            </div>
            <div v-if="selectedBranchId == branch.id" class="flex-shrink-0">
              <svg class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </button>
        </div>

        <!-- Footer -->
        <div v-if="isSuperAdmin" class="px-4 py-2 border-t border-gray-100 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-900/30">
          <router-link
            to="/admin/branches"
            class="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
            @click="isOpen = false"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            {{ $t('branch.manage_branches') }}
          </router-link>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'BranchSelector',

  data() {
    return {
      isOpen: false,
    }
  },

  computed: {
    ...mapState('branch', ['branches', 'selectedBranchId']),
    ...mapState('auth', ['user']),
    ...mapGetters('branch', ['selectedBranch']),
    isSuperAdmin() {
      return this.$store.state.auth?.is_admin || false
    },
  },

  methods: {

    toggleDropdown() {
      this.isOpen = !this.isOpen
    },

    async selectBranch(branchId) {
      if (branchId == this.selectedBranchId) {
        this.isOpen = false
        return
      }

      await this.$store.dispatch('branch/selectBranch', branchId)
      this.isOpen = false

      this.$toast?.success(this.$t('branch.branch_changed', { name: this.selectedBranch?.name }))

      // ملاحظة: ما نحتاج نعيد الجلب هنا يدويًا - DefaultLayout.vue يعيد
      // بناء الصفحة الحالية تلقائيًا عند تغيّر selectedBranchId (عبر :key
      // على router-view)، فتُعاد كل الصفحات من الصفر بشكل موحّد.
    },

    handleClickOutside(event) {
      if (this.$refs.branchDropdownRef && !this.$refs.branchDropdownRef.contains(event.target)) {
        this.isOpen = false
      }
    },
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside)
    this.$store.dispatch('branch/fetchMyBranches')
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>
