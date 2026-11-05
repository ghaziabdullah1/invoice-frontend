<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 py-6 md:py-8">
    <div class="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100">
            {{ $t('procurement.department.title') }}
          </h1>
          <p class="text-gray-600 text-sm mt-1 dark:text-slate-400">
            {{ $t('procurement.department.subtitle') }}
          </p>
        </div>
        <button
          v-if="canManage"
          @click="openCreate"
          class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          {{ $t('procurement.department.add') }}
        </button>
      </div>

      <!-- Search -->
      <div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-3 mb-4">
        <input
          v-model="search"
          @input="debouncedSearch"
          type="text"
          :placeholder="$t('common.search')"
          class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      <!-- Table -->
      <div v-if="loading" class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
      </div>
      <div v-else class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div v-if="items.length === 0" class="text-center py-12 text-gray-500 dark:text-slate-400">
          {{ $t('procurement.department.empty') }}
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-slate-900/50">
              <tr>
                <th class="px-5 py-3 text-start text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase">{{ $t('procurement.department.code') }}</th>
                <th class="px-5 py-3 text-start text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase">{{ $t('procurement.department.name') }}</th>
                <th class="px-5 py-3 text-start text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase">{{ $t('procurement.department.manager') }}</th>
                <th class="px-5 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase">{{ $t('realty.common.status') }}</th>
                <th class="px-5 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase">{{ $t('realty.common.actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-slate-700">
              <tr v-for="d in items" :key="d.id" class="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                <td class="px-5 py-3 text-sm font-mono text-gray-900 dark:text-slate-100" dir="ltr" style="text-align: start">{{ d.code }}</td>
                <td class="px-5 py-3 text-sm text-gray-900 dark:text-slate-100" dir="auto" style="text-align: start">
                  {{ $i18n.locale === 'ar' ? d.name : (d.name_en || d.name) }}
                </td>
                <td class="px-5 py-3 text-sm text-gray-700 dark:text-slate-300">
                  {{ d.manager?.name || '—' }}
                </td>
                <td class="px-5 py-3 text-center">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                    :class="d.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-300'">
                    <span class="w-1.5 h-1.5 rounded-full" :class="d.is_active ? 'bg-green-500' : 'bg-gray-400'"></span>
                    {{ d.is_active ? $t('realty.common.active') : $t('realty.common.inactive') }}
                  </span>
                </td>
                <td class="px-5 py-3 text-center">
                  <div class="flex items-center justify-center gap-1">
                    <button v-if="canManage" @click="openEdit(d)" class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition" :title="$t('buttons.edit')">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </button>
                    <button v-if="canManage" @click="confirmDelete(d)" class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-slate-300 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition" :title="$t('buttons.delete')">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="closeModal">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6">
          <h3 class="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">
            {{ editing ? $t('procurement.department.edit') : $t('procurement.department.add') }}
          </h3>

          <form @submit.prevent="submit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{{ $t('procurement.department.code') }} *</label>
              <input v-model="form.code" required maxlength="30" dir="ltr" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{{ $t('procurement.department.name') }} *</label>
                <input v-model="form.name" required class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{{ $t('procurement.department.name_en') }}</label>
                <input v-model="form.name_en" dir="ltr" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{{ $t('procurement.department.manager') }}</label>
              <select v-model="form.manager_id" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                <option value="">{{ $t('realty.common.none') }}</option>
                <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{{ $t('procurement.department.description') }}</label>
              <textarea v-model="form.description" rows="2" class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"></textarea>
            </div>
            <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
              <input type="checkbox" v-model="form.is_active" class="rounded border-gray-300 dark:border-slate-600" />
              {{ $t('realty.common.active') }}
            </label>

            <p v-if="error" class="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-2 rounded">{{ error }}</p>

            <div class="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-slate-700">
              <button type="button" @click="closeModal" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200">
                {{ $t('realty.common.cancel') }}
              </button>
              <button type="submit" :disabled="submitting" class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
                {{ submitting ? $t('realty.common.saving') : $t('realty.common.save') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify'
import departmentApi from '@/api/department'
import usersApi from '@/api/users'
import { unwrapList } from '@/api/crud'

const emptyForm = () => ({
  code: '', name: '', name_en: '', description: '', manager_id: '', is_active: true,
})

export default {
  name: 'DepartmentsManagement',
  data() {
    return {
      items: [],
      users: [],
      loading: false,
      submitting: false,
      search: '',
      searchTimer: null,
      showModal: false,
      editing: null,
      form: emptyForm(),
      error: '',
    }
  },
  computed: {
    canManage() {
      if (this.$store.state.auth?.is_admin) return true
      const getter = this.$store.getters['auth/hasPermission']
      return typeof getter === 'function' ? !!getter('manage_departments') : false
    },
  },
  mounted() {
    this.fetch()
    this.loadUsers()
  },
  beforeUnmount() {
    clearTimeout(this.searchTimer)
  },
  methods: {
    async fetch() {
      this.loading = true
      try {
        const params = {}
        if (this.search.trim()) params.search = this.search.trim()
        const res = await departmentApi.getAll(params)
        const { items } = unwrapList(res)
        this.items = items
      } catch (e) {
        toast.error(e?.response?.data?.message || this.$t('realty.common.error'))
      } finally {
        this.loading = false
      }
    },
    async loadUsers() {
      try {
        const res = await usersApi.getAll?.({ per_page: 200 }) || { data: { data: [] } }
        const { items } = unwrapList(res)
        this.users = items
      } catch {
        this.users = []
      }
    },
    debouncedSearch() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => this.fetch(), 400)
    },
    openCreate() {
      this.editing = null
      this.form = emptyForm()
      this.error = ''
      this.showModal = true
    },
    openEdit(d) {
      this.editing = d
      this.form = {
        code: d.code,
        name: d.name,
        name_en: d.name_en || '',
        description: d.description || '',
        manager_id: d.manager_id || '',
        is_active: !!d.is_active,
      }
      this.error = ''
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
    async submit() {
      this.submitting = true
      this.error = ''
      try {
        const payload = {
          code: this.form.code.trim(),
          name: this.form.name.trim(),
          name_en: this.form.name_en.trim() || null,
          description: this.form.description.trim() || null,
          manager_id: this.form.manager_id || null,
          is_active: !!this.form.is_active,
        }
        if (this.editing) {
          await departmentApi.update(this.editing.id, payload)
          toast.success(this.$t('procurement.department.updated'))
        } else {
          await departmentApi.create(payload)
          toast.success(this.$t('procurement.department.created'))
        }
        this.showModal = false
        this.fetch()
      } catch (e) {
        const errors = e?.response?.data?.errors
        this.error = errors ? Object.values(errors).flat().join(' ') : (e?.response?.data?.message || 'Error')
      } finally {
        this.submitting = false
      }
    },
    async confirmDelete(d) {
      const ok = await this.$swal({
        title: this.$t('procurement.department.delete_confirm'),
        text: d.name,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        confirmButtonText: this.$t('common.delete'),
        cancelButtonText: this.$t('realty.common.cancel'),
      })
      if (!ok.isConfirmed) return
      try {
        await departmentApi.remove(d.id)
        toast.success(this.$t('procurement.department.deleted'))
        this.fetch()
      } catch (e) {
        toast.error(e?.response?.data?.message || this.$t('realty.common.error'))
      }
    },
  },
}
</script>
