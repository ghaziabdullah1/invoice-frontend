<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 md:py-12"
  >
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-10 text-center">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/25 mb-5"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
        </div>
        <h1
          class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3"
        >
          {{ $t('privacy.title') || 'سياسة الخصوصية' }}
        </h1>
        <p class="text-gray-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          {{ $t('privacy.subtitle') || 'نلتزم بحماية بياناتك الشخصية وضمان خصوصيتك' }}
        </p>
        <div
          v-if="privacyData.last_updated"
          class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm text-sm text-gray-500 dark:text-slate-400"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ $t('privacy.last_updated') || 'آخر تحديث' }}:
          {{ formatDate(privacyData.last_updated) }}
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
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
          @click="fetchPrivacyData"
          class="mt-4 px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
        >
          {{ $t('common.retry') || 'إعادة المحاولة' }}
        </button>
      </div>

      <!-- Content -->
      <div v-else class="space-y-6">
        <!-- Introduction Card -->
        <div
          class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 md:p-8"
        >
          <div class="prose dark:prose-invert max-w-none">
            <p class="text-gray-600 dark:text-slate-300 leading-relaxed text-lg">
              {{ privacyData.introduction || $t('privacy.default_intro') }}
            </p>
          </div>
        </div>

        <!-- Sections -->
        <div
          v-for="(section, index) in privacyData.sections"
          :key="index"
          class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden group hover:shadow-md transition-shadow duration-300"
        >
          <div class="p-6 md:p-8">
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-800/50"
              >
                <span class="text-blue-600 dark:text-blue-400 font-bold text-sm">{{
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
                <!-- Sub-items if exists -->
                <ul v-if="section.items" class="mt-4 space-y-2">
                  <li
                    v-for="(item, iIdx) in section.items"
                    :key="iIdx"
                    class="flex items-start gap-3"
                  >
                    <svg
                      class="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span class="text-gray-600 dark:text-slate-300">{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Section -->
        <div
          class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50 p-6 md:p-8"
        >
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {{ $t('privacy.questions') || 'لديك أسئلة؟' }}
              </h3>
              <p class="text-gray-600 dark:text-slate-300 text-sm">
                {{
                  $t('privacy.contact_us') || 'تواصل معنا للمزيد من المعلومات حول سياسة الخصوصية'
                }}
              </p>
            </div>
            <router-link
              to="/support"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold flex items-center gap-2 transform hover:-translate-y-0.5"
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
  name: 'PrivacyPolicy',

  computed: {
    ...mapGetters('content', ['privacyData', 'loading', 'error']),
  },

  mounted() {
    this.fetchPrivacyData(this.$i18n.locale)
  },

  watch: {
    '$i18n.locale'(newLocale) {
      this.fetchPrivacyData(newLocale)
    },
  },

  methods: {
    ...mapActions('content', ['fetchPrivacyData']),

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

<style scoped>
.prose p {
  margin-bottom: 1rem;
}
.prose p:last-child {
  margin-bottom: 0;
}
</style>
