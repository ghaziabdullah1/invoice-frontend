<template>
  <div class="container mx-auto px-4 py-8">
    <!-- العنوان -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-slate-100">{{ $t('profile.title') }}</h1>
      <p class="text-gray-600 dark:text-slate-400 mt-2">{{ $t('profile.subtitle') }}</p>
    </div>

    <!-- حالة التحميل (Skeleton Loading) -->
    <div v-if="loading" class="space-y-4">
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 animate-pulse">
        <div class="flex items-center space-x-4 rtl:space-x-reverse">
          <div class="rounded-full bg-gray-300 h-20 w-20"></div>
          <div class="flex-1 space-y-3">
            <div class="h-4 bg-gray-300 rounded w-3/4"></div>
            <div class="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 mt-4">
          <div class="h-4 bg-gray-300 rounded"></div>
          <div class="h-4 bg-gray-300 rounded"></div>
          <div class="h-4 bg-gray-300 rounded"></div>
          <div class="h-4 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>

    <!-- حالة الخطأ -->
    <div
      v-else-if="error"
      class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center"
    >
      <i class="fas fa-exclamation-circle ml-2 text-xl"></i>
      {{ error }}
    </div>

    <!-- المحتوى الرئيسي -->
    <div v-else-if="user" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- ========== العمود الأيسر: بطاقة المستخدم (ثابتة) ========== -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden sticky top-4">
          <!-- الغلاف الملون -->
          <div class="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

          <!-- محتوى البطاقة -->
          <div class="relative px-6 pb-6">
            <!-- الصورة مع إمكانية التغيير (عند الضغط) -->
            <div class="flex justify-center -mt-16">
              <div class="relative group">
                <div
                  class="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg overflow-hidden cursor-pointer"
                  @click="triggerFileInput"
                >
                  <img
                    v-if="user.img_url"
                    :src="user.img_url"
                    class="w-full h-full object-cover"
                    alt="صورة المستخدم"
                  />
                  <span v-else>{{ initials }}</span>

                  <!-- أيقونة الكاميرا عند التحويم -->
                  <div
                    class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <i class="fas fa-camera text-white text-xl"></i>
                  </div>
                </div>
                <!-- input file مخفي -->
                <input
                  type="file"
                  ref="fileInput"
                  class="hidden"
                  accept="image/*"
                  @change="handleImgChange"
                />
              </div>
            </div>

            <!-- الاسم والحالة -->
            <div class="text-center mt-4">
              <h2 class="text-xl font-bold text-gray-900 dark:text-slate-100">{{ user.name }}</h2>
              <p class="text-gray-600 dark:text-slate-400 mt-1">{{ user.email }}</p>
              <div class="mt-3">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="
                    user.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  "
                >
                  <span
                    class="w-2 h-2 rounded-full ml-2"
                    :class="user.is_active ? 'bg-green-500' : 'bg-red-500'"
                  ></span>
                  {{ user.is_active ? $t('profile.active') : $t('profile.inactive') }}
                </span>
              </div>
            </div>

            <!-- معلومات إضافية -->
            <div class="mt-6 space-y-3 border-t border-gray-100 pt-4">
              <div class="flex items-center text-gray-700 dark:text-slate-300">
                <i class="fas fa-phone-alt w-6 text-blue-500"></i>
                <span class="mr-2">{{ user.phone || $t('profile.not_provided') }}</span>
              </div>
              <div class="flex items-center text-gray-700 dark:text-slate-300">
                <i class="fas fa-building w-6 text-blue-500"></i>
                <span class="mr-2">{{ user.company_name || $t('profile.not_provided') }}</span>
              </div>
              <div class="flex items-center text-gray-700 dark:text-slate-300">
                <i class="fas fa-layer-group w-6 text-blue-500"></i>
                <span class="mr-2">{{ user.adminGroup?.title_ar || $t('profile.no_group') }}</span>
              </div>
              <div class="flex items-center text-gray-700 dark:text-slate-300">
                <i class="fas fa-id-badge w-6 text-blue-500"></i>
                <span class="mr-2">{{
                  user.is_admin ? $t('profile.administrator') : $t('profile.user')
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== العمود الأيمن: محتوى قابل للتبديل ========== -->
      <div class="lg:col-span-2 space-y-6">
        <!-- تبويبات (Tabs) -->
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
          <div class="border-b border-gray-200 dark:border-slate-700">
            <nav class="flex space-x-8 rtl:space-x-reverse px-6" aria-label="Tabs">
              <button
                @click="activeTab = 'account'"
                class="py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
                :class="
                  activeTab === 'account'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:border-slate-600'
                "
              >
                <i class="fas fa-user-circle ml-2"></i>
                {{ $t('profile.account_info') }}
              </button>
              <button
                @click="activeTab = 'security'"
                class="py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200"
                :class="
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-slate-300 hover:border-gray-300 dark:border-slate-600'
                "
              >
                <i class="fas fa-lock ml-2"></i>
                {{ $t('profile.security') }}
              </button>
            </nav>
          </div>

          <div class="p-6">
            <!-- ===== تبويب المعلومات الشخصية ===== -->
            <div v-if="activeTab === 'account'">
              <!-- رأس التبويب مع زر التعديل -->
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  {{ $t('profile.personal_details') }}
                </h3>
                <button
                  @click="toggleEditMode"
                  class="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center transition-colors"
                >
                  <i class="fas fa-pen ml-1"></i>
                  {{ editMode ? $t('common.cancel') : $t('common.edit') }}
                </button>
              </div>

              <!-- وضع العرض -->
              <div v-if="!editMode" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">{{
                    $t('profile.full_name')
                  }}</label>
                  <p class="text-gray-900 dark:text-slate-100 bg-gray-50 dark:bg-slate-900 rounded-lg px-4 py-2">{{ user.name }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">{{
                    $t('profile.email')
                  }}</label>
                  <p class="text-gray-900 dark:text-slate-100 bg-gray-50 dark:bg-slate-900 rounded-lg px-4 py-2">{{ user.email }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">{{
                    $t('profile.phone')
                  }}</label>
                  <p class="text-gray-900 dark:text-slate-100 bg-gray-50 dark:bg-slate-900 rounded-lg px-4 py-2">
                    {{ user.phone || $t('profile.not_provided') }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">{{
                    $t('profile.company')
                  }}</label>
                  <p class="text-gray-900 dark:text-slate-100 bg-gray-50 dark:bg-slate-900 rounded-lg px-4 py-2">
                    {{ user.company_name || $t('profile.not_provided') }}
                  </p>
                </div>
              </div>

              <!-- وضع التعديل (نموذج) -->
              <div v-else>
                <form @submit.prevent="submitProfileUpdate">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- صورة المستخدم (معاينة) -->
                    <div class="col-span-1 md:col-span-2">
                      <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{{
                        $t('profile.profile_image')
                      }}</label>
                      <div class="flex items-center space-x-4 rtl:space-x-reverse">
                        <div class="flex-shrink-0">
                          <div
                            class="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-white shadow-lg overflow-hidden"
                          >
                            <img
                              v-if="imgPreview || user.img_url"
                              :src="imgPreview || user.img_url"
                              class="w-full h-full object-cover"
                              alt="معاينة الصورة"
                            />
                            <span v-else>{{ initials }}</span>
                          </div>
                        </div>
                        <div class="flex-1">
                          <button
                            type="button"
                            @click="triggerFileInput"
                            class="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-200 transition text-sm"
                          >
                            <i class="fas fa-upload ml-1"></i>
                            {{ $t('profile.change_image') }}
                          </button>
                          <p class="text-xs text-gray-500 mt-1">{{ $t('profile.img_hint') }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- حقول النموذج -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        {{ $t('profile.full_name') }} <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="editForm.name"
                        type="text"
                        class="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        {{ $t('profile.email') }} <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="editForm.email"
                        type="email"
                        class="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        :class="{ 'border-red-500': emailError }"
                        required
                        @input="validateEmail"
                      />
                      <p v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailError }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        {{ $t('profile.phone') }}
                      </label>
                      <input
                        v-model="editForm.phone"
                        type="text"
                        class="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                        {{ $t('profile.company') }}
                      </label>
                      <input
                        v-model="editForm.company_name"
                        type="text"
                        class="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <!-- أزرار التحكم -->
                  <div class="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      @click="cancelEdit"
                      class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:bg-slate-900 transition"
                    >
                      {{ $t('common.cancel') }}
                    </button>
                    <button
                      type="submit"
                      :disabled="profileUpdating || !isFormValid"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                    >
                      <i v-if="profileUpdating" class="fas fa-spinner fa-spin ml-2"></i>
                      {{ $t('common.save') }}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- ===== تبويب الأمان ===== -->
            <div v-else-if="activeTab === 'security'">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-slate-100">{{ $t('profile.password') }}</h3>
                  <p class="text-gray-600 dark:text-slate-400 text-sm mt-1">{{ $t('profile.password_info') }}</p>
                </div>
                <button
                  @click="openPasswordModal"
                  class="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-200 transition inline-flex items-center"
                >
                  <i class="fas fa-key ml-2"></i>
                  {{ $t('profile.change_password') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- مودال تغيير كلمة المرور (مُحسّن) -->
    <Transition name="fade">
      <div
        v-if="showPasswordModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closePasswordModal"
      >
        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4 flex items-center">
              <i class="fas fa-lock text-blue-500 ml-2"></i>
              {{ $t('profile.change_password') }}
            </h3>
            <form @submit.prevent="submitPasswordChange">
              <div class="space-y-4">
                <!-- كلمة المرور الحالية -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {{ $t('profile.current_password') }} <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="passwordForm.current_password"
                    type="password"
                    class="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <!-- كلمة المرور الجديدة -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {{ $t('profile.new_password') }} <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="passwordForm.new_password"
                    type="password"
                    class="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                    @input="checkPasswordStrength"
                  />
                  <!-- مؤشر قوة كلمة المرور -->
                  <div class="mt-2">
                    <div class="flex items-center space-x-1 rtl:space-x-reverse">
                      <div
                        class="h-2 flex-1 rounded transition-colors duration-300"
                        :class="strengthClass(1)"
                      ></div>
                      <div
                        class="h-2 flex-1 rounded transition-colors duration-300"
                        :class="strengthClass(2)"
                      ></div>
                      <div
                        class="h-2 flex-1 rounded transition-colors duration-300"
                        :class="strengthClass(3)"
                      ></div>
                    </div>
                    <p class="text-xs mt-1" :class="strengthTextClass">
                      {{ strengthText }}
                    </p>
                  </div>
                </div>

                <!-- تأكيد كلمة المرور الجديدة -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    {{ $t('profile.confirm_password') }} <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="passwordForm.new_password_confirmation"
                    type="password"
                    class="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    :class="{
                      'border-red-500':
                        passwordForm.new_password_confirmation &&
                        passwordForm.new_password !== passwordForm.new_password_confirmation,
                    }"
                    required
                  />
                  <p
                    v-if="
                      passwordForm.new_password_confirmation &&
                      passwordForm.new_password !== passwordForm.new_password_confirmation
                    "
                    class="text-red-500 text-xs mt-1"
                  >
                    {{ $t('profile.password_mismatch') }}
                  </p>
                </div>
              </div>

              <!-- رسالة الخطأ العامة -->
              <div v-if="passwordError" class="mt-4 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <i class="fas fa-exclamation-circle ml-1"></i>
                {{ passwordError }}
              </div>

              <!-- أزرار التحكم -->
              <div class="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  @click="closePasswordModal"
                  class="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:bg-slate-900 transition"
                >
                  {{ $t('common.cancel') }}
                </button>
                <button
                  type="submit"
                  :disabled="passwordUpdating || !isPasswordFormValid"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                >
                  <i v-if="passwordUpdating" class="fas fa-spinner fa-spin ml-2"></i>
                  {{ $t('common.save') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Notifications -->
    <Transition name="toast">
      <div
        v-if="toast.visible"
        class="fixed bottom-4 left-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center"
        :class="toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'"
      >
        <i :class="toast.icon" class="ml-2 text-xl"></i>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Profile',
  data() {
    return {
      activeTab: 'account', // 'account' or 'security'
      editMode: false,
      editForm: {
        name: '',
        email: '',
        phone: '',
        company_name: '',
      },
      // بيانات الصورة
      imgFile: null,
      imgPreview: null,
      // حالة التحديث
      profileUpdating: false,
      // التحقق من البريد الإلكتروني
      emailError: null,
      // مودال كلمة المرور
      showPasswordModal: false,
      passwordForm: {
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      },
      passwordUpdating: false,
      passwordError: null,
      passwordStrength: 0, // 0-3
      // Toast
      toast: {
        visible: false,
        message: '',
        type: 'success',
        icon: 'fas fa-check-circle',
      },
      toastTimeout: null,
    }
  },
  computed: {
    ...mapGetters('profile', ['user', 'permissions', 'loading', 'error', 'initials']),

    // التحقق من صحة النموذج (جميع الحقول المطلوبة موجودة ولا يوجد خطأ بريد)
    isFormValid() {
      return (
        this.editForm.name &&
        this.editForm.email &&
        !this.emailError
      )
    },

    // التحقق من صحة نموذج كلمة المرور
    isPasswordFormValid() {
      return (
        this.passwordForm.current_password &&
        this.passwordForm.new_password &&
        this.passwordForm.new_password_confirmation &&
        this.passwordForm.new_password === this.passwordForm.new_password_confirmation &&
        this.passwordStrength >= 1 // على الأقل ضعيفة
      )
    },

    // نص قوة كلمة المرور
    strengthText() {
      if (this.passwordStrength === 0) return this.$t('profile.password_weak')
      if (this.passwordStrength === 1) return this.$t('profile.password_fair')
      if (this.passwordStrength === 2) return this.$t('profile.password_good')
      return this.$t('profile.password_strong')
    },

    // لون نص القوة
    strengthTextClass() {
      if (this.passwordStrength === 0) return 'text-red-600'
      if (this.passwordStrength === 1) return 'text-orange-600'
      if (this.passwordStrength === 2) return 'text-yellow-600'
      return 'text-green-600'
    },
  },
  methods: {
    ...mapActions('profile', ['fetchProfile', 'updateProfile', 'changePassword']),

    // فتح اختيار الصورة
    triggerFileInput() {
      this.$refs.fileInput.click()
    },

    // معالجة اختيار الصورة
    handleImgChange(event) {
      const file = event.target.files[0]
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          this.showToast(this.$t('profile.img_too_large'), 'error')
          event.target.value = ''
          return
        }
        if (!file.type.match('image.*')) {
          this.showToast(this.$t('profile.img_invalid_type'), 'error')
          event.target.value = ''
          return
        }
        this.imgFile = file
        this.imgPreview = URL.createObjectURL(file)
      } else {
        this.imgFile = null
        this.imgPreview = null
      }
    },

    // التحقق الفوري من البريد الإلكتروني
    validateEmail() {
      const email = this.editForm.email
      if (!email) {
        this.emailError = this.$t('validation.email_required')
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        this.emailError = this.$t('validation.email_invalid')
      } else {
        this.emailError = null
      }
    },

    // تبديل وضع التعديل
    toggleEditMode() {
      if (!this.editMode) {
        // تهيئة النموذج
        this.editForm = {
          name: this.user.name || '',
          email: this.user.email || '',
          phone: this.user.phone || '',
          company_name: this.user.company_name || '',
        }
        this.imgPreview = null
        this.imgFile = null
        this.validateEmail()
      }
      this.editMode = !this.editMode
    },

    // إرسال تحديث الملف الشخصي
    async submitProfileUpdate() {
      if (!this.isFormValid) return
      this.profileUpdating = true
      try {
        const success = await this.updateProfile({
          name: this.editForm.name,
          email: this.editForm.email,
          phone: this.editForm.phone || '',
          company_name: this.editForm.company_name || '',
          imgFile: this.imgFile,
        })

        if (success) {
          this.editMode = false
          this.imgPreview = null
          this.imgFile = null
          this.showToast(this.$t('profile.update_success'))
        }
      } finally {
        this.profileUpdating = false
      }
    },

    cancelEdit() {
      this.editMode = false
      this.editForm = { name: '', email: '', phone: '', company_name: '' }
      this.imgPreview = null
      this.imgFile = null
      this.emailError = null
    },

    // فتح مودال تغيير كلمة المرور
    openPasswordModal() {
      this.passwordForm = {
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      }
      this.passwordError = null
      this.passwordStrength = 0
      this.showPasswordModal = true
    },

    closePasswordModal() {
      this.showPasswordModal = false
    },

    // التحقق من قوة كلمة المرور
    checkPasswordStrength() {
      const password = this.passwordForm.new_password
      let strength = 0
      if (password.length >= 6) strength++
      if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
      if (password.match(/\d/) && password.match(/[^a-zA-Z\d]/)) strength++
      this.passwordStrength = Math.min(strength, 3)
    },

    // إرسال تغيير كلمة المرور
    async submitPasswordChange() {
      if (!this.isPasswordFormValid) return
      this.passwordUpdating = true
      this.passwordError = null
      try {
        const success = await this.changePassword({
          current_password: this.passwordForm.current_password,
          new_password: this.passwordForm.new_password,
          new_password_confirmation: this.passwordForm.new_password_confirmation,
        })
        if (success) {
          this.closePasswordModal()
          this.showToast(this.$t('profile.password_changed'))
        } else {
          this.passwordError = this.error || this.$t('profile.password_error')
        }
      } finally {
        this.passwordUpdating = false
      }
    },

    // دالة مساعدة للحصول على class شريط القوة
    strengthClass(level) {
      if (this.passwordStrength >= level) {
        if (this.passwordStrength === 1) return 'bg-orange-500'
        if (this.passwordStrength === 2) return 'bg-yellow-500'
        if (this.passwordStrength === 3) return 'bg-green-500'
        return 'bg-red-500'
      }
      return 'bg-gray-200'
    },

    // عرض Toast
    showToast(message, type = 'success') {
      if (this.toastTimeout) clearTimeout(this.toastTimeout)
      this.toast = {
        visible: true,
        message,
        type,
        icon: type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle',
      }
      this.toastTimeout = setTimeout(() => {
        this.toast.visible = false
      }, 3000)
    },
  },
  created() {
    this.fetchProfile()
  },
  beforeUnmount() {
    if (this.toastTimeout) clearTimeout(this.toastTimeout)
  },
}
</script>

<style scoped>
/* انتقالات Fade للمودال */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* انتقال Toast من الأسفل */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* تحسين مظهر العناصر */
input:focus {
  outline: none;
}
</style>
