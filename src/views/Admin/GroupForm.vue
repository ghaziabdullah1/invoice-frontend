<template>
  <transition name="modal-fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50"
      @click.self="$emit('close')"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 transition-colors duration-300"
      >
        <!-- Modal Header -->
        <div
          class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300"
        >
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg
                  class="w-5 h-5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  {{ isEditing ? $t('groups.edit_group') : $t('groups.create_group') }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {{ isEditing ? $t('groups.edit_subtitle') : $t('groups.create_subtitle') }}
                </p>
              </div>
            </div>
            <button
              @click="$emit('close')"
              class="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <form @submit.prevent="handleSubmit" class="p-6">
          <!-- Form Error -->
          <div
            v-if="formError"
            class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 transition-colors duration-300"
          >
            <div class="flex items-start">
              <div class="flex-shrink-0 pt-0.5">
                <svg
                  class="w-5 h-5 text-red-500 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="mr-3 flex-1">
                <p class="text-sm text-red-700 dark:text-red-300">{{ formError }}</p>
              </div>
              <button
                @click="formError = null"
                class="p-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="space-y-4">
            <!-- Name English -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('groups.name_en') }}
                <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="form.title_en"
                required
                class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                :placeholder="$t('groups.name_en_placeholder')"
              />
            </div>

            <!-- Name Arabic -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('groups.name_ar') }}
                <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="form.title_ar"
                required
                class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                :placeholder="$t('groups.name_ar_placeholder')"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('groups.description') }}
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                class="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                :placeholder="$t('groups.description_placeholder')"
              ></textarea>
            </div>

            <!-- Status Toggle -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('common.status') }}
              </label>
              <div
                class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300"
              >
                <span class="text-gray-700 dark:text-gray-200">
                  {{ form.is_active ? $t('groups.status.active') : $t('groups.status.inactive') }}
                </span>
                <label class="inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="form.is_active" class="sr-only peer" />
                  <div
                    class="relative w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:ring-4 peer-focus:ring-blue-300/50 dark:peer-focus:ring-blue-800/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 dark:border-slate-600 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 dark:peer-checked:bg-green-500"
                  ></div>
                </label>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="mt-8 flex justify-end gap-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200 border border-gray-300 dark:border-gray-600"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg
                v-if="submitting"
                class="w-4 h-4 animate-spin"
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
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              <span class="font-medium">
                {{
                  submitting
                    ? $t('common.saving')
                    : isEditing
                      ? $t('common.update')
                      : $t('common.save')
                }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'GroupForm',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    group: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      submitting: false,
      formError: null,
      form: {
        title_en: '',
        title_ar: '',
        description: '',
        is_active: true,
      },
    }
  },
  computed: {
    isEditing() {
      return this.group !== null
    },
  },
  watch: {
    show(val) {
      if (val) {
        this.initForm()
        this.formError = null
      }
    },
  },
  methods: {
    ...mapActions('groups', ['createAdminGroup', 'updateAdminGroup']),

    initForm() {
      if (this.isEditing) {
        this.form = {
          title_en: this.group.title_en,
          title_ar: this.group.title_ar,
          description: this.group.description || '',
          is_active: this.group.is_active,
        }
      } else {
        this.form = {
          title_en: '',
          title_ar: '',
          description: '',
          is_active: true,
        }
      }
    },

    async handleSubmit() {
      this.submitting = true
      this.formError = null

      try {
        // Client-side validation
        if (!this.form.title_en.trim()) {
          throw new Error(this.$t('validation.title_en_required'))
        }
        if (!this.form.title_ar.trim()) {
          throw new Error(this.$t('validation.title_ar_required'))
        }

        if (this.isEditing) {
          await this.updateAdminGroup({
            id: this.group.id,
            data: this.form,
          })
        } else {
          await this.createAdminGroup(this.form)
        }

        this.$emit('saved')
        this.$emit('close')
        this.$swal?.fire({
          icon: 'success',
          title: this.isEditing
            ? this.$t('groups.messages.update_success')
            : this.$t('groups.messages.create_success'),
          showConfirmButton: false,
          timer: 1500,
        })
      } catch (error) {
        console.error('Error saving group:', error)
        // If validation error from server (422)
        if (error.response?.status === 422) {
          this.formError = error.response.data.message || this.$t('errors.validation_error')
        } else {
          this.formError = error.message || this.$t('errors.failed_to_save_group')
        }
        this.$swal?.fire({
          icon: 'error',
          title: this.$t('errors.error'),
          text: this.formError,
        })
      } finally {
        this.submitting = false
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

/* تحسين شريط التمرير في الوضع الداكن */
:deep(.dark) ::-webkit-scrollbar {
  width: 8px;
}
:deep(.dark) ::-webkit-scrollbar-track {
  background: #1f2937;
}
:deep(.dark) ::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 4px;
}
:deep(.dark) ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
