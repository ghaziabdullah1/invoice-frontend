<template>
  <transition name="modal-fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      @click.self="$emit('close')"
    >
      <div
        class="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/50 dark:border-gray-700 transition-colors duration-300"
      >
        <!-- Modal Header -->
        <div
          class="px-8 py-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800 transition-colors duration-300"
        >
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div
                class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl shadow-md"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                  {{
                    isEditing ? $t('permissions.edit_permission') : $t('permissions.add_permission')
                  }}
                </h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{
                    isEditing ? $t('permissions.edit_subtitle') : $t('permissions.create_subtitle')
                  }}
                </p>
              </div>
            </div>
            <button
              @click="$emit('close')"
              class="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <form @submit.prevent="handleSubmit" class="p-8">
          <div class="space-y-6">
            <!-- اسم الصلاحية -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ $t('permissions.permission_name') }}
                <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="form.title"
                required
                class="w-full px-4 py-3.5 bg-white/80 dark:bg-gray-700/80 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                :placeholder="$t('permissions.name_placeholder')"
              />
            </div>

            <!-- الوصف بالعربية -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ $t('permissions.description_ar') }}
              </label>
              <input
                type="text"
                v-model="form.description_ar"
                class="w-full px-4 py-3.5 bg-white/80 dark:bg-gray-700/80 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                :placeholder="$t('permissions.description_ar_placeholder')"
              />
            </div>

            <!-- الوصف بالإنجليزية -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ $t('permissions.description_en') }}
              </label>
              <input
                type="text"
                v-model="form.description_en"
                class="w-full px-4 py-3.5 bg-white/80 dark:bg-gray-700/80 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white"
                :placeholder="$t('permissions.description_en_placeholder')"
              />
            </div>

            <!-- القائمة الرئيسية -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ $t('permissions.main_menu') }}
              </label>
              <select
                v-model="form.admin_menu_id"
                class="w-full px-4 py-3.5 bg-white/80 dark:bg-gray-700/80 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 text-gray-900 dark:text-white"
              >
                <option value="">{{ $t('common.select') }}</option>
                <option v-for="menu in menus" :key="menu.id" :value="menu.id">
                  {{ menu.title_ar }} - {{ menu.title_en }}
                </option>
              </select>
            </div>

            <!-- القائمة الفرعية -->
            <div class="space-y-2" v-if="form.admin_menu_id">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ $t('permissions.sub_menu') }}
              </label>
              <select
                v-model="form.admin_sub_menu_id"
                class="w-full px-4 py-3.5 bg-white/80 dark:bg-gray-700/80 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 text-gray-900 dark:text-white"
              >
                <option value="">{{ $t('common.none') }}</option>
                <option
                  v-for="subMenu in getSubMenus(form.admin_menu_id)"
                  :key="subMenu.id"
                  :value="subMenu.id"
                >
                  {{ subMenu.title_ar }} - {{ subMenu.title_en }}
                </option>
              </select>
            </div>

            <!-- نوع الصلاحية -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ $t('permissions.type') }}
              </label>
              <div
                class="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/30 dark:from-gray-900/50 dark:to-gray-800/30 rounded-xl border border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300"
              >
                <span class="text-gray-700 dark:text-gray-200 font-medium">
                  {{ form.is_parent ? $t('permissions.parent') : $t('permissions.child') }}
                </span>
                <label class="inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="form.is_parent" class="sr-only peer" />
                  <div
                    class="relative w-12 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/50 dark:peer-focus:ring-blue-800/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 dark:border-slate-600 dark:after:border-gray-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600"
                  ></div>
                </label>
              </div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {{ $t('permissions.parent_permission_hint') }}
              </p>
            </div>

            <!-- الصلاحية الأب -->
            <div class="space-y-2" v-if="!form.is_parent">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ $t('permissions.parent_permission') }}
              </label>
              <select
                v-model="form.parent_id"
                class="w-full px-4 py-3.5 bg-white/80 dark:bg-gray-700/80 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 text-gray-900 dark:text-white"
              >
                <option value="">{{ $t('common.none') }}</option>
                <option v-for="parent in parentPermissions" :key="parent.id" :value="parent.id">
                  {{ parent.title }} - {{ parent.description_ar }}
                </option>
              </select>
            </div>

            <!-- حالة التفعيل -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ $t('common.status') }}
              </label>
              <div class="flex items-center gap-4">
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    v-model="form.is_active"
                    :value="true"
                    class="ml-2 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span class="text-gray-700 dark:text-gray-200">{{ $t('common.active') }}</span>
                </label>
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    v-model="form.is_active"
                    :value="false"
                    class="ml-2 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span class="text-gray-700 dark:text-gray-200">{{ $t('common.inactive') }}</span>
                </label>
              </div>
            </div>

            <!-- أزرار -->
            <div class="mt-10 flex justify-end gap-3">
              <button
                type="button"
                @click="$emit('close')"
                class="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 hover:from-gray-200 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:shadow transition-all duration-200 transform hover:-translate-y-0.5 border border-gray-200/50 dark:border-gray-600/50"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'PermissionForm',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    permission: {
      type: Object,
      default: null,
    },
    menus: {
      type: Array,
      required: true,
    },
    parentPermissions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      submitting: false,
      form: {
        title: '',
        description_ar: '',
        description_en: '',
        admin_menu_id: '',
        admin_sub_menu_id: '',
        parent_id: '',
        is_parent: false,
        is_active: true,
      },
    }
  },
  computed: {
    isEditing() {
      return this.permission !== null
    },
  },
  watch: {
    show(val) {
      if (val) {
        this.initForm()
      }
    },
  },
  methods: {
    ...mapActions('permissions', ['createPermission', 'updatePermission']),

    initForm() {
      if (this.isEditing) {
        this.form = {
          title: this.permission.title,
          description_ar: this.permission.description_ar || '',
          description_en: this.permission.description_en || '',
          admin_menu_id: this.permission.admin_menu_id || '',
          admin_sub_menu_id: this.permission.admin_sub_menu_id || '',
          parent_id: this.permission.parent_id || '',
          is_parent: this.permission.is_parent || false,
          is_active: this.permission.is_active !== undefined ? this.permission.is_active : true,
        }
      } else {
        this.form = {
          title: '',
          description_ar: '',
          description_en: '',
          admin_menu_id: '',
          admin_sub_menu_id: '',
          parent_id: '',
          is_parent: false,
          is_active: true,
        }
      }
    },

    getSubMenus(menuId) {
      const menu = this.menus.find((m) => m.id === menuId)
      return menu?.sub_menus || []
    },

    async handleSubmit() {
      this.submitting = true
      try {
        if (this.isEditing) {
          await this.updatePermission({
            id: this.permission.id,
            data: this.form,
          })
        } else {
          await this.createPermission(this.form)
        }
        this.$emit('saved')
        this.$emit('close')
        this.$swal?.fire({
          icon: 'success',
          title: this.isEditing
            ? this.$t('permissions.messages.update_success')
            : this.$t('permissions.create_success'),
          showConfirmButton: false,
          timer: 1500,
        })
      } catch (error) {
        console.error('Error saving permission:', error)
        // إذا كان الخطأ 422 (عنوان مكرر) نعرض رسالة واضحة
        if (error.response?.status === 422) {
          const message = error.response.data.message || this.$t('errors.validation_error')
          this.$swal?.fire({
            icon: 'error',
            title: this.$t('errors.validation_error'),
            text: message,
          })
        } else {
          this.$swal?.fire({
            icon: 'error',
            title: this.isEditing
              ? this.$t('errors.failed_to_update_permission')
              : this.$t('errors.failed_to_create_permission'),
            text: error.message,
          })
        }
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
</style>
