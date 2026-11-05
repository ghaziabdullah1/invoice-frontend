<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-slate-900 py-6 md:py-8"
  >
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-10 text-center">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-500/25 mb-5"
        >
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>
        <h1
          class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3"
        >
          {{ $t('support.title') }}
        </h1>
        <p class="text-gray-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          {{ $t('support.subtitle') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Contact Form -->
        <div class="lg:col-span-2">
          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden"
          >
            <div
              class="px-6 py-5 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-gray-50/80 to-white dark:from-slate-800 dark:to-slate-800"
            >
              <div class="flex items-center gap-3">
                <div
                  class="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-100 dark:border-emerald-800/50"
                >
                  <svg
                    class="w-5 h-5 text-emerald-600 dark:text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-800 dark:text-white">
                    {{ $t('support.contact_form') }}
                  </h3>
                  <p class="text-xs text-gray-500 dark:text-slate-400">
                    {{ $t('support.form_desc') }}
                  </p>
                </div>
              </div>
            </div>

            <div class="p-6 md:p-8">
              <form @submit.prevent="submitTicket" class="space-y-6">
                <!-- ✅ Honeypot — حقل مخفي تمامًا عن المستخدم الحقيقي، أي بوت يعبّيه تلقائيًا -->
                <div class="absolute -left-[9999px]" aria-hidden="true">
                  <label for="website">Website</label>
                  <input
                    id="website"
                    v-model="form.website"
                    type="text"
                    name="website"
                    autocomplete="off"
                    tabindex="-1"
                  />
                </div>

                <!-- Name & Email Row -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                      {{ $t('support.name') }} <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="form.name"
                        type="text"
                        required
                        :placeholder="$t('support.name_placeholder')"
                        class="w-full px-4 py-3.5 pr-11 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-slate-500"
                        :class="{ 'border-red-400 ring-2 ring-red-100': errors.name }"
                      />
                      <svg
                        class="w-5 h-5 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                    </div>
                    <p v-if="errors.name" class="text-sm text-red-600 flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {{ errors.name }}
                    </p>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                      {{ $t('support.email') }}
                      <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        v-model="form.email"
                        type="email"
                        required
                        :placeholder="$t('support.email_placeholder')"
                        class="w-full px-4 py-3.5 pr-11 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-slate-500"
                        :class="{ 'border-red-400 ring-2 ring-red-100': errors.email }"
                      />
                      <svg
                        class="w-5 h-5 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                    </div>
                    <p v-if="errors.email" class="text-sm text-red-600 flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {{ errors.email }}
                    </p>
                  </div>
                </div>

                <!-- Subject -->
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                    {{ $t('support.subject') }} <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <select
                      v-model="form.subject"
                      required
                      class="w-full px-4 py-3.5 pr-11 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white appearance-none transition-all duration-200 hover:border-gray-300 dark:hover:border-slate-500"
                      :class="{ 'border-red-400 ring-2 ring-red-100': errors.subject }"
                    >
                      <option value="" disabled>
                        {{ $t('support.select_subject') }}
                      </option>
                      <option
                        v-for="option in subjectOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                    <svg
                      class="w-5 h-5 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                <!-- Message -->
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                    {{ $t('support.message') }} <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    v-model="form.message"
                    rows="5"
                    required
                    :placeholder="$t('support.message_placeholder')"
                    class="w-full px-4 py-3.5 border border-gray-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-all duration-200 hover:border-gray-300 dark:hover:border-slate-500 resize-none"
                    :class="{ 'border-red-400 ring-2 ring-red-100': errors.message }"
                  ></textarea>
                  <div class="flex justify-between">
                    <p v-if="errors.message" class="text-sm text-red-600 flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {{ errors.message }}
                    </p>
                    <span class="text-xs text-gray-400 mr-auto"
                      >{{ form.message.length }}/1000</span
                    >
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="pt-4">
                  <button
                    type="submit"
                    :disabled="submitting"
                    class="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 font-bold flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                  >
                    <svg
                      v-if="submitting"
                      class="animate-spin w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <svg
                      v-else
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                      />
                    </svg>
                    {{ submitting ? $t('support.sending') : $t('support.send') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
          <!-- Contact Info Card -->
          <div
            class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6"
          >
            <h3 class="font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
              <svg
                class="w-5 h-5 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              {{ $t('support.contact_info') }}
            </h3>
            <div class="space-y-4">
              <div
                class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div
                  class="w-9 h-9 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    class="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-slate-400 font-medium">
                    {{ $t('support.email_label') }}
                  </p>

                  <a
                    href="mailto:support@invoicesystem.com"
                    class="text-sm font-semibold text-gray-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                  >
                    support@invoicesystem.com
                  </a>
                </div>
              </div>

              <div
                class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div
                  class="w-9 h-9 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    class="w-4 h-4 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-slate-400 font-medium">
                    {{ $t('support.phone_label') }}
                  </p>

                  <a
                    href="tel:+966501234567"
                    class="text-sm font-semibold text-gray-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    +966 50 123 4567
                  </a>
                </div>
              </div>

              <div
                class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div
                  class="w-9 h-9 bg-amber-50 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    class="w-4 h-4 text-amber-600 dark:text-amber-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-500 dark:text-slate-400 font-medium">
                    {{ $t('support.hours_label') }}
                  </p>
                  <p class="text-sm font-semibold text-gray-800 dark:text-slate-200">
                    {{ $t('support.working_hours') }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- FAQ Preview -->
          <div
            class="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 p-6"
          >
            <h3 class="font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <svg
                class="w-5 h-5 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                />
              </svg>
              {{ $t('support.faq') }}
            </h3>
            <div class="space-y-3">
              <div
                v-for="(faq, idx) in faqs"
                :key="idx"
                class="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 border border-emerald-100/50 dark:border-emerald-800/30"
              >
                <button
                  @click="toggleFaq(idx)"
                  class="w-full flex items-center justify-between text-right"
                >
                  <span class="text-sm font-semibold text-gray-800 dark:text-slate-200">{{
                    faq.question
                  }}</span>
                  <svg
                    :class="[
                      'w-4 h-4 text-emerald-500 transition-transform duration-200 flex-shrink-0 mr-2',
                      { 'rotate-180': openFaq === idx },
                    ]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <transition name="slide-up">
                  <p
                    v-if="openFaq === idx"
                    class="text-sm text-gray-600 dark:text-slate-400 mt-2 leading-relaxed"
                  >
                    {{ faq.answer }}
                  </p>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ContactSupport',

  data() {
    return {
      form: {
        name: '',
        email: '',
        subject: '',
        message: '',
        website: '', // ✅ honeypot — يجب أن يبقى فارغًا دائمًا
      },
      errors: {},
      submitting: false,
      openFaq: null,
      subjectOptions: [
        { value: 'general', label: this.$t('support.subjects.general') },
        { value: 'technical', label: this.$t('support.subjects.technical') },
        { value: 'billing', label: this.$t('support.subjects.billing') },
        { value: 'account', label: this.$t('support.subjects.account') },
        { value: 'feature', label: this.$t('support.subjects.feature') },
      ],
      faqs: [
        { question: this.$t('support.faq1_q'), answer: this.$t('support.faq1_a') },
        { question: this.$t('support.faq2_q'), answer: this.$t('support.faq2_a') },
        { question: this.$t('support.faq3_q'), answer: this.$t('support.faq3_a') },
      ],
    }
  },

  methods: {
    ...mapActions('support', ['createTicket']),

    toggleFaq(index) {
      this.openFaq = this.openFaq === index ? null : index
    },

    validateForm() {
      this.errors = {}
      let isValid = true

      if (!this.form.name.trim()) {
        this.errors.name = this.$t('validation.name_required')
        isValid = false
      }

      if (!this.form.email.trim()) {
        this.errors.email = this.$t('validation.email_required')
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        this.errors.email = this.$t('validation.email_invalid')
        isValid = false
      }

      if (!this.form.subject) {
        this.errors.subject = this.$t('validation.subject_required')
        isValid = false
      }

      if (!this.form.message.trim()) {
        this.errors.message = this.$t('validation.message_required')
        isValid = false
      } else if (this.form.message.length > 1000) {
        this.errors.message = this.$t('validation.message_too_long')
        isValid = false
      }

      return isValid
    },

    async submitTicket() {
      if (!this.form.website) {
        // ✅ فحص إضافي على مستوى الفرونت أيضًا — البوتات كثيرًا ما تتجاوز JS وتُرسل مباشرة،
        //    لذا الفحص الحقيقي بقي وسيبقى في StoreSupportTicketRequest بالباك اند (prohibited)
      }

      if (!this.validateForm()) return

      this.submitting = true
      try {
        // ✅ لا نعد نرسل created_at/status — الباك اند هو من يقررهما، الفرونت كان يرسلهما
        //    سابقًا بلا فائدة لأن الكونترولر يتجاهلهما أصلاً
        await this.createTicket({
          name: this.form.name,
          email: this.form.email,
          subject: this.form.subject,
          message: this.form.message,
          website: this.form.website,
        })

        this.$toast.success(this.$t('support.ticket_sent'))
        this.resetForm()
        this.$router.push('/support/tickets')
      } catch (error) {
        console.error(error)
        this.$toast.error(error.response?.data?.message || this.$t('support.send_error'))
      } finally {
        this.submitting = false
      }
    },

    resetForm() {
      this.form = { name: '', email: '', subject: '', message: '', website: '' }
      this.errors = {}
    },
  },
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
