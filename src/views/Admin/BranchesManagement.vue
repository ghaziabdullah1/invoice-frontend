<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 py-6 md:py-8">
    <div class="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100">{{ $t('branch.title') || 'الفروع' }}</h1>
          <p class="text-gray-600 dark:text-slate-400 text-sm mt-1">{{ $t('branch.subtitle') || 'إدارة فروع الشركة' }}</p>
        </div>
        <button
          @click="openCreateModal"
          class="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ $t('branch.add_branch') || 'إضافة فرع' }}
        </button>
      </div>

      <div v-if="loading" class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>

      <div v-else class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div v-if="branches.length === 0" class="text-center py-12 px-4 text-gray-600 dark:text-slate-400">
          {{ $t('branch.empty') || 'لا توجد فروع بعد' }}
        </div>
        <table v-else class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead class="bg-gray-50 dark:bg-slate-900">
            <tr>
              <th class="px-6 py-3 text-start text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase">{{ $t('branch.name') || 'الاسم' }}</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase">{{ $t('branch.code') || 'الرمز' }}</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase">{{ $t('branch.city') || 'المدينة' }}</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase">{{ $t('branch.status') || 'الحالة' }}</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase">{{ $t('common.actions') || 'إجراءات' }}</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            <tr v-for="branch in branches" :key="branch.id" class="hover:bg-blue-50/30">
              <td class="px-6 py-4">
                <div class="font-medium text-gray-900 dark:text-slate-100">{{ branch.name }}</div>
                <div v-if="branch.is_main" class="text-xs text-blue-600">{{ $t('branch.main') || 'الفرع الرئيسي' }}</div>
              </td>
              <td class="px-6 py-4 text-center text-sm text-gray-700 dark:text-slate-300">{{ branch.code }}</td>
              <td class="px-6 py-4 text-center text-sm text-gray-700 dark:text-slate-300">{{ branch.city || '-' }}</td>
              <td class="px-6 py-4 text-center">
                <button
                  @click="toggleActive(branch)"
                  class="px-3 py-1.5 rounded-full text-xs font-semibold"
                  :class="branch.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'"
                >
                  {{ branch.is_active ? ($t('branch.active') || 'نشط') : ($t('branch.inactive') || 'غير نشط') }}
                </button>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-1">
                  <button @click="openEditModal(branch)" class="p-2 text-gray-600 dark:text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg" :title="$t('common.edit')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(branch)" class="ui-icon-btn" :title="$t('common.delete')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">
          {{ editingBranch ? ($t('branch.edit_branch') || 'تعديل فرع') : ($t('branch.add_branch') || 'إضافة فرع') }}
        </h3>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{{ $t('branch.name') || 'الاسم' }} *</label>
            <input v-model="form.name" required class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{{ $t('branch.name_en') || 'الاسم (إنجليزي)' }}</label>
            <input v-model="form.name_en" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{{ $t('branch.code') || 'الرمز' }} *</label>
              <input v-model="form.code" required class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{{ $t('branch.city') || 'المدينة' }}</label>
              <input v-model="form.city" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{{ $t('branch.phone') || 'الهاتف' }}</label>
            <input v-model="form.phone" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg" />
          </div>
          <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
            <input type="checkbox" v-model="form.is_active" />
            {{ $t('branch.active') || 'نشط' }}
          </label>
          <div class="flex justify-end gap-3 pt-3 border-t">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg">
              {{ $t('common.cancel') || 'إلغاء' }}
            </button>
            <button type="submit" :disabled="submitting" class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
              {{ submitting ? ($t('common.saving') || 'جاري الحفظ...') : ($t('common.save') || 'حفظ') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'BranchesManagement',

  data() {
    return {
      branches: [],
      loading: false,
      submitting: false,
      showModal: false,
      editingBranch: null,
      form: {
        name: '',
        name_en: '',
        code: '',
        city: '',
        phone: '',
        is_active: true,
      },
    }
  },

  mounted() {
    this.loadBranches()
  },

  methods: {
    ...mapActions('branch', [
      'fetchAllBranches',
      'createBranch',
      'updateBranch',
      'deleteBranch',
    ]),

    async loadBranches() {
      this.loading = true
      try {
        const result = await this.fetchAllBranches()
        this.branches = result?.data || result || []
      } catch (e) {
        this.$toast?.error(e.message || this.$t('common.error'))
      } finally {
        this.loading = false
      }
    },

    openCreateModal() {
      this.editingBranch = null
      this.form = { name: '', name_en: '', code: '', city: '', phone: '', is_active: true }
      this.showModal = true
    },

    openEditModal(branch) {
      this.editingBranch = branch
      this.form = {
        name: branch.name,
        name_en: branch.name_en,
        code: branch.code,
        city: branch.city,
        phone: branch.phone,
        is_active: !!branch.is_active,
      }
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
    },

    async submitForm() {
      this.submitting = true
      try {
        if (this.editingBranch) {
          await this.updateBranch({ id: this.editingBranch.id, payload: this.form })
          this.$toast?.success(this.$t('branch.updated') || 'تم تحديث الفرع')
        } else {
          await this.createBranch(this.form)
          this.$toast?.success(this.$t('branch.created') || 'تم إنشاء الفرع')
        }
        this.showModal = false
        await this.loadBranches()
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || e.message || this.$t('common.error'))
      } finally {
        this.submitting = false
      }
    },

    async toggleActive(branch) {
      try {
        await this.updateBranch({ id: branch.id, payload: { is_active: !branch.is_active } })
        await this.loadBranches()
      } catch (e) {
        this.$toast?.error(e.message || this.$t('common.error'))
      }
    },

    async confirmDelete(branch) {
      const result = await this.$swal?.fire({
        title: this.$t('common.are_you_sure') || 'هل أنت متأكد؟',
        text: branch.name,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: this.$t('common.delete') || 'حذف',
        cancelButtonText: this.$t('common.cancel') || 'إلغاء',
      })
      if (result && !result.isConfirmed) return

      try {
        await this.deleteBranch(branch.id)
        this.$toast?.success(this.$t('messages.deleteSuccess') || 'تم الحذف بنجاح')
        await this.loadBranches()
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || e.message || this.$t('common.error'))
      }
    },
  },
}
</script>