```vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
    <div
      class="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-md dark:shadow-none border border-transparent dark:border-slate-700 w-full max-w-md">
      <h2 class="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
        {{ $t('otp.title') }}
      </h2>

      <p class="text-center text-gray-500 dark:text-slate-400 text-sm mb-8">
        {{ $t('otp.subtitle') }}
      </p>

      <!-- خطأ عام -->
      <div v-if="error"
        class="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg p-3 mb-4 text-center">
        {{ error }}
      </div>

      <!-- المرحلة 1: إدخال الإيميل -->
      <form v-if="step === 1" @submit.prevent="handleSendOtp">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            {{ $t('otp.emailLabel') }}
          </label>

          <input v-model="email" type="email" :placeholder="$t('otp.emailPlaceholder')"
            class="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="loading" required />
        </div>

        <button type="submit"
          class="w-full bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          :disabled="loading">
          {{ loading ? $t('otp.sending') : $t('otp.sendCode') }}
        </button>

        <p class="text-center mt-4 text-sm text-gray-500 dark:text-slate-400">
          {{ $t('otp.or') }}

          <router-link to="/login" class="text-blue-600 dark:text-blue-400 hover:underline">
            {{ $t('otp.loginWithPassword') }}
          </router-link>
        </p>
      </form>

      <!-- المرحلة 2: إدخال الرمز -->
      <form v-if="step === 2" @submit.prevent="handleVerifyOtp">
        <p class="text-center text-sm text-gray-600 dark:text-slate-400 mb-4">
          {{ $t('otp.codeSentTo') }}

          <span class="font-semibold text-gray-800 dark:text-white">
            {{ email }}
          </span>
        </p>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            {{ $t('otp.codeLabel') }}
          </label>

          <input v-model="otp" type="text" inputmode="numeric" autocomplete="one-time-code" placeholder="000000"
            maxlength="6"
            class="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-sm text-center tracking-widest text-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="loading" required />
        </div>

        <button type="submit"
          class="w-full bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
          :disabled="loading">
          {{ loading ? $t('otp.verifying') : $t('otp.verifyCode') }}
        </button>

        <!-- إعادة الإرسال -->
        <p class="text-center mt-4 text-sm text-gray-500 dark:text-slate-400">
          {{ $t('otp.didntReceive') }}

          <button type="button" class="text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
            :disabled="cooldown > 0 || loading" @click="handleResend">
            {{
              cooldown > 0
                ? $t('otp.resendAfter', { seconds: cooldown })
                : $t('otp.resend')
            }}
          </button>
        </p>

        <p class="text-center mt-2 text-sm text-gray-500 dark:text-slate-400">
          <button type="button" class="text-gray-400 dark:text-slate-500 hover:underline" @click="backToEmailStep">
            {{ $t('otp.changeEmail') }}
          </button>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OtpLogin',

  data() {
    return {
      step: 1,
      email: '',
      otp: '',
      cooldown: 0,
      cooldownTimer: null,
    }
  },

  computed: {
    loading() {
      return this.$store.getters['auth/isLoading']
    },

    error() {
      return this.$store.getters['auth/loginError']
    },
  },

  mounted() {
    const queryEmail = this.$route.query.email

    if (queryEmail && typeof queryEmail === 'string') {
      this.email = queryEmail
      this.step = 2
      this.startCooldown()
    }
  },

  unmounted() {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer)
    }
  },

  methods: {
    async handleSendOtp() {
      const result = await this.$store.dispatch('auth/sendOtp', this.email)

      if (result.success) {
        this.step = 2
        this.startCooldown()
      }
    },

    async handleVerifyOtp() {
      const result = await this.$store.dispatch('auth/verifyOtp', {
        email: this.email,
        otp: this.otp,
      })

      if (result.success) {
        this.$router.push('/dashboard')
      }
    },

    async handleResend() {
      this.otp = ''

      const result = await this.$store.dispatch('auth/sendOtp', this.email)

      if (result.success) {
        this.startCooldown()
      }
    },

    backToEmailStep() {
      this.step = 1
      this.otp = ''

      if (this.cooldownTimer) {
        clearInterval(this.cooldownTimer)
      }

      this.cooldown = 0
    },

    startCooldown() {
      if (this.cooldownTimer) {
        clearInterval(this.cooldownTimer)
      }

      this.cooldown = 120

      this.cooldownTimer = setInterval(() => {
        this.cooldown--

        if (this.cooldown <= 0) {
          clearInterval(this.cooldownTimer)
        }
      }, 1000)
    },
  },
}
</script>
```
