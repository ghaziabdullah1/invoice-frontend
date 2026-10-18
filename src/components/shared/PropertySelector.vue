<template>
  <div v-if="properties.length" class="relative" ref="dropdownRef">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
      :class="{ 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400': isOpen }"
      :title="currentLabel"
    >
      <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-sm flex-shrink-0">
        <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      </div>
      <span class="font-medium truncate max-w-[120px] hidden md:block">{{ currentLabel }}</span>
      <svg class="w-3 h-3 text-gray-400 transition-transform duration-200" :class="isOpen ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
        <div class="px-4 py-3 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
          <p class="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {{ tr('property_scope.your_properties', 'عقاراتي', 'My properties') }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {{ tr('property_scope.select_to_filter', 'اختر عقاراً لعرض بياناته', 'Select a property to view its data') }}
          </p>
        </div>

        <div class="max-h-64 overflow-y-auto">
          <button
            v-for="property in properties"
            :key="property.id"
            @click="select(property.id)"
            class="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors"
            :class="
              selectedPropertyId == property.id
                ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50'
            "
          >
            <div class="flex-1 text-start">
              <p class="font-medium">{{ label(property) }}</p>
              <p v-if="property.city" class="text-xs text-gray-500 dark:text-gray-400">{{ property.city }}</p>
            </div>
            <svg v-if="selectedPropertyId == property.id" class="w-5 h-5 text-teal-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'PropertySelector',

  data() {
    return { isOpen: false }
  },

  computed: {
    ...mapState('propertyScope', ['properties', 'selectedPropertyId']),
    ...mapGetters('propertyScope', ['selectedProperty']),
    currentLabel() {
      return this.selectedProperty
        ? this.label(this.selectedProperty)
        : this.tr('property_scope.select_property', 'اختر العقار', 'Select property')
    },
  },

  methods: {
    tr(key, ar, en) {
      if (this.$te(key)) return this.$t(key)
      return this.$i18n.locale === 'ar' ? ar : en
    },

    label(property) {
      return this.$i18n.locale === 'ar' ? property.name : property.name_en || property.name
    },

    async select(id) {
      if (id == this.selectedPropertyId) {
        this.isOpen = false
        return
      }
      await this.$store.dispatch('propertyScope/selectProperty', id)
      this.isOpen = false
    },

    handleClickOutside(event) {
      if (this.$refs.dropdownRef && !this.$refs.dropdownRef.contains(event.target)) {
        this.isOpen = false
      }
    },
  },

  mounted() {
    document.addEventListener('click', this.handleClickOutside)
    this.$store.dispatch('propertyScope/fetchMyProperties').catch((e) => {
      console.error('Failed to load properties', e)
    })
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
}
</script>
