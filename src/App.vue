<template>
  <div id="app" :class="appClasses" class="app-container">
    <ToastContainer />

    <!-- إذا لم يتم التحقق من المصادقة بعد، نعرض تحميل -->
    <div v-if="authLoading" class="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
      <p class="mt-4 text-gray-600 dark:text-slate-400 font-medium">{{ $t('common.loading') }}</p>
    </div>

    <!-- عرض المحتوى بعد التحقق -->
    <template v-else-if="isAuthenticated">
      <router-view />
    </template>

    <!-- إذا لم يكن مصادقاً نعرض صفحة تسجيل الدخول (حالة نادرة) -->
    <template v-else>
      <router-view />
    </template>

    <div v-if="globalLoading" class="global-loading-overlay">
      <LoadingSpinner size="lg" />
      <p class="mt-4 text-white font-medium">{{ $t('common.loading') }}</p>
    </div>
  </div>
</template>

<script>
import ToastContainer from '@/components/ToastContainer.vue'
import LoadingSpinner from '@/components/shared/LoadingSpinner.vue'

export default {
  name: 'App',

  components: {
    ToastContainer,
    LoadingSpinner,
  },

  data() {
    return {
      authChecked: false
    }
  },

  computed: {
    isAuthenticated() {
      const token = this.$store.state.auth.token
      const user = this.$store.state.auth.user
      return token && user
    },

    authLoading() {
      return this.$store.state.auth.loading
    },

    appClasses() {
      return {
        'lang-ar': this.$i18n.locale === 'ar',
        'lang-en': this.$i18n.locale === 'en',
        rtl: this.$i18n.locale === 'ar',
        ltr: this.$i18n.locale === 'en',
      }
    },

    globalLoading() {
      return (
        this.$store.state.auth.loading ||
        this.$store.state.invoices?.loading ||
        this.$store.state.clients?.loading
      )
    },
  },

  async created() {
    const savedLang = localStorage.getItem('userLanguage') || 'ar'
    this.$i18n.locale = savedLang
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = savedLang
    document.documentElement.classList.remove('lang-ar', 'lang-en')
    document.documentElement.classList.add(`lang-${savedLang}`)

    const token = localStorage.getItem('token')
    if (token) {
      await this.$store.dispatch('auth/checkAuth')
    }
    this.authChecked = true
  },

  mounted() {
    document.body.classList.add(`lang-${this.$i18n.locale}`)
    if (this.$i18n.locale === 'ar') {
      document.body.classList.add('rtl')
      document.body.classList.remove('ltr')
    } else {
      document.body.classList.add('ltr')
      document.body.classList.remove('rtl')
    }
  },
}
</script>
