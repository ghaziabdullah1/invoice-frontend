<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 md:py-12"
  >
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-10 text-center">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg shadow-amber-500/25 mb-5"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </div>
        <h1
          class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3"
        >
          {{ $t('terms.title') || 'شروط الخدمة' }}
        </h1>
        <p class="text-gray-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          {{ $t('terms.subtitle') || 'الشروط والأحكام المنظمة لاستخدام نظام الفواتير' }}
        </p>
        <div
          v-if="termsData.version"
          class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm text-sm text-gray-500 dark:text-slate-400"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {{ $t('terms.version') || 'الإصدار' }} {{ termsData.version }}
          <span class="mx-1 text-gray-300">&middot;</span>
          {{ formatDate(termsData.effective_date) }}
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>

      <!-- Error -->
      <div
        v-else-if="error"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center"
      >
        <svg
          class="w-12 h-12 text-red-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 class="text-lg font-bold text-red-800 dark:text-red-300 mb-2">
          {{ $t('common.error') }}
        </h3>
        <p class="text-red-600 dark:text-red-400">{{ error }}</p>
        <button
          @click="fetchTermsData"
          class="mt-4 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
        >
          {{ $t('common.retry') || 'إعادة المحاولة' }}
        </button>
      </div>

      <!-- Content -->
      <div v-else class="space-y-6">
        <!-- Acceptance Banner -->
        <div
          class="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-6 flex items-start gap-4"
        >
          <div
            class="w-10 h-10 bg-amber-100 dark:bg-amber-900/40 rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <svg
              class="w-5 h-5 text-amber-600 dark:text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-amber-900 dark:text-amber-300 mb-1">
              {{ $t('terms.acceptance') || 'قبول الشروط' }}
            </h3>
            <p class="text-amber-800 dark:text-amber-400/80 text-sm leading-relaxed">
              {{ termsData.acceptance_text || $t('terms.default_acceptance') }}
            </p>
          </div>
        </div>

        <!-- Sections -->
        <div
          v-for="(section, index) in termsData.sections"
          :key="index"
          class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
        >
          <div class="p-6 md:p-8">
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl flex items-center justify-center border border-amber-100 dark:border-amber-800/50"
              >
                <span class="text-amber-600 dark:text-amber-400 font-bold text-sm">{{
                  String(index + 1).padStart(2, '0')
                }}</span>
              </div>
              <div class="flex-1">
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {{ section.title }}
                </h2>
                <div class="text-gray-600 dark:text-slate-300 leading-relaxed space-y-3">
                  <p v-for="(paragraph, pIdx) in section.content" :key="pIdx">{{ paragraph }}</p>
                </div>
                <div v-if="section.sub_sections" class="mt-5 space-y-4">
                  <div
                    v-for="(sub, sIdx) in section.sub_sections"
                    :key="sIdx"
                    class="pl-4 border-r-2 border-amber-200 dark:border-amber-800/50 pr-4"
                  >
                    <h4 class="font-semibold text-gray-800 dark:text-slate-200 mb-2">
                      {{ sub.title }}
                    </h4>
                    <p class="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">
                      {{ sub.content }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact -->
        <div
          class="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 md:p-8"
        >
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {{ $t('terms.questions') || 'استفسارات قانونية؟' }}
              </h3>
              <p class="text-gray-500 dark:text-slate-400 text-sm">
                {{ $t('terms.contact_legal') || 'للاستفسارات المتعلقة بالشروط والأحكام' }}
              </p>
            </div>
            <router-link
              to="/support"
              class="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/40 hover:from-amber-600 hover:to-orange-700 transition-all duration-300 font-semibold flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              {{ $t('footer.support') }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'TermsOfService',

  computed: {
    ...mapGetters('content', ['termsData', 'loading', 'error']),
  },

  mounted() {
    this.fetchTermsData()
  },

  methods: {
    ...mapActions('content', ['fetchTermsData']),

    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return new Intl.DateTimeFormat(this.$i18n.locale === 'ar' ? 'en-US' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date)
    },
  },
}
</script>
