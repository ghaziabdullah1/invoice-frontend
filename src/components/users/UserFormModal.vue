<template>
  <transition name="modal-fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      @click.self="$emit('close')"
    >
      <div
        class="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/50"
      >
        <!-- Modal Header -->
        <div class="px-8 py-6 border-b border-gray-200 dark:border-slate-700/50 bg-gradient-to-r from-blue-50 to-white">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-8a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-slate-100">
                  {{ editingUser ? $t('users.edit_user') : $t('users.create_user') }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-slate-400 mt-1">
                  {{ editingUser ? $t('users.edit_subtitle') : $t('users.create_subtitle') }}
                </p>
              </div>
            </div>
            <button
              @click="$emit('close')"
              class="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:bg-slate-800 rounded-xl transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <form @submit.prevent="submit" class="p-8">
          <!-- Form Error -->
          <div
            v-if="formError"
            class="mb-6 bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200/50 rounded-xl p-4"
          >
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="mr-3 flex-1">
                <p class="text-sm text-red-700">{{ formError }}</p>
              </div>
              <button @click="$emit('clear-error')" type="button" class="p-1 text-red-500 hover:text-red-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="space-y-6">
            <!-- Full Name -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                {{ $t('users.full_name') }} <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="form.name"
                required
                class="w-full px-4 py-3.5 bg-white dark:bg-slate-800/80 border border-gray-300 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
                :placeholder="$t('users.name_placeholder')"
              />
            </div>

            <!-- Email -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                {{ $t('users.email') }} <span class="text-red-500">*</span>
              </label>
              <input
                type="email"
                v-model="form.email"
                required
                class="w-full px-4 py-3.5 bg-white dark:bg-slate-800/80 border border-gray-300 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400"
                :placeholder="$t('users.email_placeholder')"
              />
            </div>

            <!-- Group -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                {{ $t('users.group') }} <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select
                  v-model="form.admin_group_id"
                  required
                  class="w-full px-4 py-3.5 bg-white dark:bg-slate-800/80 border border-gray-300 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 appearance-none pr-10"
                >
                  <option value="">{{ $t('users.select_group') }}</option>
                  <option v-for="group in groups" :key="group.id" :value="group.id">
                    {{ $i18n.locale === 'ar' ? group.title_ar : group.title_en }}
                  </option>
                </select>
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

                        <!-- Branches -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                {{ $t('branch.select_branch') }}
              </label>
              <div class="max-h-40 overflow-y-auto rounded-xl border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/80 divide-y divide-gray-100 dark:divide-slate-800">
                <p v-if="loadingBranches" class="p-3 text-sm text-gray-500">...</p>
                <label
                  v-for="branch in branchesList"
                  :key="branch.id"
                  class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50/40"
                >
                  <input type="checkbox" :value="branch.id" v-model="form.branch_ids" class="w-4 h-4 rounded border-gray-300 dark:border-slate-600" />
                  <span class="text-sm text-gray-700 dark:text-slate-300">{{ branch.name }}</span>
                </label>
              </div>
            </div>

            <!-- Password Section -->
            <div :class="!editingUser ? 'bg-gradient-to-r from-blue-50/50 to-blue-100/30 p-5 rounded-xl' : ''">
              <div v-if="!editingUser">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                    {{ $t('users.password') }} <span class="text-red-500">*</span>
                    <span class="text-xs text-gray-500 font-normal">({{ $t('users.password_min_length') }})</span>
                  </label>
                  <input
                    type="password"
                    v-model="form.password"
                    required
                    minlength="8"
                    class="w-full px-4 py-3.5 bg-white dark:bg-slate-800/80 border border-gray-300 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                    :placeholder="$t('users.password_placeholder')"
                  />
                </div>

                <div class="space-y-2 mt-4">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                    {{ $t('users.confirm_password') }} <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    v-model="form.password_confirmation"
                    required
                    minlength="8"
                    class="w-full px-4 py-3.5 bg-white dark:bg-slate-800/80 border border-gray-300 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                    :placeholder="$t('users.confirm_password_placeholder')"
                  />
                </div>
              </div>

              <div v-if="editingUser" class="space-y-4">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                    {{ $t('users.new_password') }}
                    <span class="text-xs text-gray-500 font-normal">({{ $t('users.password_optional') }})</span>
                  </label>
                  <input
                    type="password"
                    v-model="form.password"
                    minlength="8"
                    class="w-full px-4 py-3.5 bg-white dark:bg-slate-800/80 border border-gray-300 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                    :placeholder="$t('users.new_password_placeholder')"
                  />
                </div>

                <div v-if="form.password" class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">
                    {{ $t('users.confirm_new_password') }}
                  </label>
                  <input
                    type="password"
                    v-model="form.password_confirmation"
                    minlength="8"
                    class="w-full px-4 py-3.5 bg-white dark:bg-slate-800/80 border border-gray-300 dark:border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200"
                    :placeholder="$t('users.confirm_new_password_placeholder')"
                  />
                </div>
              </div>
            </div>

            <!-- Status Toggle -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-slate-300">{{ $t('common.status') }}</label>
              <div
                class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/30 rounded-xl border border-gray-200 dark:border-slate-700/50"
              >
                <span class="text-gray-700 dark:text-slate-300 font-medium">
                  {{ form.is_active ? $t('users.status.active') : $t('users.status.inactive') }}
                </span>
                <label class="inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="form.is_active" class="sr-only peer" />
                  <div
                    class="relative w-12 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white dark:bg-slate-800 after:border-gray-300 dark:border-slate-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600"
                  ></div>
                </label>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="mt-10 flex justify-end gap-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 text-gray-700 dark:text-slate-300 rounded-xl hover:shadow transition-all duration-200 transform hover:-translate-y-0.5 border border-gray-200 dark:border-slate-700/50"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              <svg
                v-if="submitting"
                class="w-5 h-5 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              <span class="font-semibold">
                {{ submitting ? $t('common.saving') : editingUser ? $t('common.update') : $t('common.save') }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
const emptyForm = () => ({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  admin_group_id: '',
  is_active: true,
  branch_ids: [],
})

export default {
  name: 'UserFormModal',

  props: {
    show: {
      type: Boolean,
      default: false,
    },
    editingUser: {
      type: Object,
      default: null,
    },
    groups: {
      type: Array,
      default: () => [],
    },
    submitting: {
      type: Boolean,
      default: false,
    },
    formError: {
      type: String,
      default: null,
    },
  },

  emits: ['close', 'submit', 'clear-error'],

  data() {
    return {
      form: emptyForm(),
      branchesList: [],
      loadingBranches: false,
    }
  },

  watch: {
    show(isOpen) {
      if (isOpen) {
        this.loadBranches()
        this.form = this.editingUser
          ? {
              name: this.editingUser.name,
              email: this.editingUser.email,
              admin_group_id: this.editingUser.admin_group_id,
              is_active: this.editingUser.is_active,
              branch_ids: (this.editingUser.branches || []).map((b) => b.id),
              password: '',
              password_confirmation: '',
            }
          : emptyForm()
      }
    },
  },

  methods: {
    submit() {
      const payload = { ...this.form }
      // في التعديل: إن لم تصل الفروع مع المستخدم لا نرسل branch_ids حتى لا تُفصل فروعه بالخطأ
      if (this.editingUser && !Array.isArray(this.editingUser.branches)) {
        delete payload.branch_ids
      }
      this.$emit('submit', payload)
    },

    async loadBranches() {
      if (this.branchesList.length) return
      this.loadingBranches = true
      try {
        const res = await this.$store.dispatch('branch/fetchAllBranches')
        const list = Array.isArray(res) ? res : res?.data || res?.branches || []
        this.branchesList = Array.isArray(list) ? list : []
      } catch (e) {
        console.error('Failed to load branches', e)
      } finally {
        this.loadingBranches = false
      }
    },
  },
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
