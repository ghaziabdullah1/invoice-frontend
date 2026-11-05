<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 md:py-8">
    <div class="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100">{{ $t(config.title) }}</h1>
          <p class="text-gray-600 dark:text-slate-400 text-sm mt-1">{{ $t(config.subtitle) }}</p>
        </div>
        <button
          v-if="canCreate"
          @click="openCreate"
          class="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ $t(config.addLabel) }}
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-4 mb-4 flex flex-col md:flex-row gap-3">
        <input
          v-model="search"
          type="search"
          :placeholder="$t('realty.common.search')"
          class="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
        <select
          v-for="flt in config.filters || []"
          :key="flt.key"
          v-model="extraFilters[flt.key]"
          @change="onFilterChange"
          class="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
        >
          <option value="">{{ $t(flt.label) }}: {{ $t('realty.common.all') }}</option>
          <option v-for="opt in options[flt.key] || []" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
        <select
          v-model="activeFilter"
          @change="onFilterChange"
          class="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800"
        >
          <option value="">{{ $t('realty.common.status') }}: {{ $t('realty.common.all') }}</option>
          <option value="1">{{ $t('realty.common.active') }}</option>
          <option value="0">{{ $t('realty.common.inactive') }}</option>
        </select>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
      </div>

      <!-- Table -->
      <div v-else class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div v-if="items.length === 0" class="text-center py-12 px-4 text-gray-600 dark:text-slate-400">
          {{ $t(config.emptyLabel) }}
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead class="bg-gray-50 dark:bg-slate-900">
              <tr>
                <th
                  v-for="col in config.columns"
                  :key="col.key"
                  class="px-6 py-3 text-start text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase whitespace-nowrap"
                >
                  {{ $t(col.label) }}
                </th>
                <th
                  v-if="canEdit || canDelete"
                  class="px-6 py-3 text-center text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase"
                >
                  {{ $t('realty.common.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              <tr v-for="row in items" :key="row.id" class="hover:bg-blue-50/30">
                <td v-for="col in config.columns" :key="col.key" class="px-6 py-4 text-sm text-gray-700 dark:text-slate-300">
                  <template v-if="col.type === 'status'">
                    <button
                      v-if="canEdit"
                      @click="toggleActive(row)"
                      class="px-3 py-1.5 rounded-full text-xs font-semibold"
                      :class="row.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'"
                    >
                      {{ row.is_active ? $t('realty.common.active') : $t('realty.common.inactive') }}
                    </button>
                    <span
                      v-else
                      class="px-3 py-1.5 rounded-full text-xs font-semibold"
                      :class="row.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'"
                    >
                      {{ row.is_active ? $t('realty.common.active') : $t('realty.common.inactive') }}
                    </span>
                  </template>
                  <template v-else-if="col.type === 'primary'">
                    <div class="font-medium text-gray-900 dark:text-slate-100">{{ cell(row, col) }}</div>
                    <div v-if="col.subKey && row[col.subKey]" class="text-xs text-gray-500">
                      {{ row[col.subKey] }}
                    </div>
                  </template>
                  <template v-else>{{ cell(row, col) }}</template>
                </td>
                <td v-if="canEdit || canDelete" class="px-6 py-4 text-center">
                  <div class="flex items-center justify-center gap-1">
                    <button
                      v-if="canEdit"
                      @click="openEdit(row)"
                      class="p-2 text-gray-600 dark:text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                      :title="$t('realty.common.edit')"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      v-if="canDelete"
                      @click="confirmRemove(row)"
                      class="p-2 text-gray-600 dark:text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      :title="$t('realty.common.delete')"
                    >
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

      <!-- Pagination -->
      <div
        v-if="!loading && pagination.last_page > 1"
        class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4"
      >
        <p class="text-sm text-gray-600 dark:text-slate-400">
          {{ $t('realty.common.showing', { from: pagination.from, to: pagination.to, total: pagination.total }) }}
        </p>
        <div class="flex items-center gap-1">
          <button
            :disabled="page <= 1"
            @click="goTo(page - 1)"
            class="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg disabled:opacity-40"
          >
            {{ $t('realty.common.prev') }}
          </button>
          <button
            v-for="n in pageNumbers"
            :key="n"
            @click="goTo(n)"
            class="px-3 py-1.5 text-sm border rounded-lg"
            :class="n === page ? 'bg-blue-900 text-white border-blue-900' : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300'"
          >
            {{ n }}
          </button>
          <button
            :disabled="page >= pagination.last_page"
            @click="goTo(page + 1)"
            class="px-3 py-1.5 text-sm bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg disabled:opacity-40"
          >
            {{ $t('realty.common.next') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-bold text-gray-900 dark:text-slate-100 mb-4">
          {{ editing ? $t(config.editLabel) : $t(config.addLabel) }}
        </h3>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div v-for="f in config.fields" :key="f.key">
            <label v-if="f.type === 'checkbox'" class="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
              <input type="checkbox" v-model="form[f.key]" />
              {{ $t(f.label) }}
            </label>

            <template v-else>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                {{ $t(f.label) }}<span v-if="f.required"> *</span>
              </label>

              <textarea
                v-if="f.type === 'textarea'"
                v-model="form[f.key]"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg"
              ></textarea>

              <select
                v-else-if="f.type === 'select'"
                v-model="form[f.key]"
                :required="f.required"
                :disabled="editing && f.lockOnEdit"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 disabled:bg-gray-100 dark:bg-slate-800"
              >
                <option value="">{{ f.required ? $t('realty.common.select') : $t('realty.common.none') }}</option>
                <option
                  v-for="opt in options[f.key] || []"
                  :key="opt.value"
                  :value="opt.value"
                  :disabled="opt.disabled && opt.value !== form[f.key]"
                >
                  {{ opt.label }}
                </option>
              </select>

              <input
                v-else
                v-model="form[f.key]"
                :type="f.type || 'text'"
                :step="f.type === 'number' ? (f.step || 'any') : undefined"
                :min="f.type === 'number' && f.min !== undefined ? f.min : undefined"
                :required="f.required"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg"
              />
            </template>

            <p v-if="errors[f.key]" class="text-xs text-red-600 mt-1">{{ errors[f.key][0] }}</p>
          </div>

          <div class="flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg"
            >
              {{ $t('realty.common.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {{ submitting ? $t('realty.common.saving') : $t('realty.common.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify'

export default {
  name: 'CrudManager',

  props: {
    config: { type: Object, required: true },
  },

  data() {
    const extraFilters = {}
    ;(this.config.filters || []).forEach((f) => {
      extraFilters[f.key] = ''
    })

    return {
      items: [],
      pagination: { current_page: 1, last_page: 1, per_page: 10, total: 0, from: 0, to: 0 },
      loading: false,
      submitting: false,
      showModal: false,
      editing: null,
      form: {},
      errors: {},
      options: {},
      page: 1,
      search: '',
      activeFilter: '',
      extraFilters,
      searchTimer: null,
    }
  },

  computed: {
    canCreate() {
      return this.hasPerm(this.config.permissions?.create)
    },
    canEdit() {
      return this.hasPerm(this.config.permissions?.edit)
    },
    canDelete() {
      return this.hasPerm(this.config.permissions?.delete)
    },
    pageNumbers() {
      const last = this.pagination.last_page || 1
      const start = Math.max(1, this.page - 2)
      const end = Math.min(last, start + 4)
      const from = Math.max(1, end - 4)
      const list = []
      for (let n = from; n <= end; n++) list.push(n)
      return list
    },
  },

  watch: {
    search() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.page = 1
        this.fetch()
      }, 350)
    },
  },

  mounted() {
    this.loadOptions()
    this.fetch()
  },

  beforeUnmount() {
    clearTimeout(this.searchTimer)
  },

  methods: {
    hasPerm(permission) {
      if (!permission) return false
      if (this.$store.state.auth?.is_admin) return true
      const getter = this.$store.getters['auth/hasPermission']
      return typeof getter === 'function' ? !!getter(permission) : false
    },

    cell(row, col) {
      const value = col.get ? col.get(row) : row[col.key]
      return value === null || value === undefined || value === '' ? '-' : value
    },

    apiError(e) {
      return e?.response?.data?.message || e?.message || this.$t('realty.common.error')
    },

    async loadOptions() {
      const sources = [...(this.config.fields || []), ...(this.config.filters || [])]
      for (const src of sources) {
        if (typeof src.optionsLoader !== 'function') continue
        try {
          this.options[src.key] = await src.optionsLoader()
        } catch (e) {
          this.options[src.key] = []
        }
      }
    },

    async fetch() {
      this.loading = true
      try {
        const params = { page: this.page, per_page: 10 }
        if (this.search.trim()) params.search = this.search.trim()
        if (this.activeFilter !== '') params.is_active = this.activeFilter
        Object.entries(this.extraFilters).forEach(([key, value]) => {
          if (value !== '' && value !== null) params[key] = value
        })

        const result = await this.$store.dispatch(`${this.config.store}/fetchAll`, params)
        // Fix: Handle both raw Laravel response and unwrapped store response
        if (result.items && result.pagination) {
          this.items = result.items
          this.pagination = result.pagination
        } else if (result.data && Array.isArray(result.data)) {
          // Laravel paginated response format
          this.items = result.data
          this.pagination = {
            current_page: result.current_page,
            last_page: result.last_page,
            per_page: result.per_page,
            total: result.total,
            from: result.from,
            to: result.to,
          }
        } else if (Array.isArray(result)) {
          this.items = result
          this.pagination = {
            current_page: 1, last_page: 1, per_page: result.length, total: result.length, from: 1, to: result.length
          }
        } else {
          this.items = []
        }
      } catch (e) {
        toast.error(this.apiError(e))
      } finally {
        this.loading = false
        this.$emit("data-loaded", { items: this.items, pagination: this.pagination })
      }
    },

    onFilterChange() {
      this.page = 1
      this.fetch()
    },

    goTo(n) {
      if (n < 1 || n > this.pagination.last_page) return
      this.page = n
      this.fetch()
    },

    emptyForm() {
      const form = {}
      this.config.fields.forEach((f) => {
        form[f.key] = f.type === 'checkbox' ? true : ''
      })
      return form
    },

    async openCreate() {
      this.editing = null
      this.errors = {}
      this.form = this.emptyForm()
      this.showModal = true
      await this.loadOptions()
    },

    async openEdit(row) {
      this.editing = row
      this.errors = {}
      const form = {}
      this.config.fields.forEach((f) => {
        if (f.type === 'checkbox') form[f.key] = !!row[f.key]
        else form[f.key] = row[f.key] ?? ''
      })
      this.form = form
      this.showModal = true
      await this.loadOptions()
    },

    closeModal() {
      this.showModal = false
    },

    buildPayload() {
      const payload = {}
      this.config.fields.forEach((f) => {
        let value = this.form[f.key]
        if (f.type === 'checkbox') {
          value = !!value
        } else if (value === '' || value === undefined || value === null) {
          value = null
        } else if (f.type === 'number' || f.type === 'select') {
          const num = Number(value)
          value = Number.isNaN(num) ? value : num
        }
        payload[f.key] = value
      })
      return payload
    },

    async submitForm() {
      this.submitting = true
      this.errors = {}
      try {
        const payload = this.buildPayload()
        if (this.editing) {
          await this.$store.dispatch(`${this.config.store}/update`, {
            id: this.editing.id,
            payload,
          })
        } else {
          await this.$store.dispatch(`${this.config.store}/create`, payload)
        }
        toast.success(this.$t('realty.common.saved'))
        this.showModal = false
        await this.fetch()
        await this.loadOptions()
      } catch (e) {
        this.errors = e?.response?.data?.errors || {}
        toast.error(this.apiError(e))
      } finally {
        this.submitting = false
      }
    },

    async toggleActive(row) {
      try {
        await this.$store.dispatch(`${this.config.store}/update`, {
          id: row.id,
          payload: { is_active: !row.is_active },
        })
        await this.fetch()
      } catch (e) {
        toast.error(this.apiError(e))
      }
    },

    async confirmRemove(row) {
      const name = row[this.config.nameKey || 'name'] || ''
      let confirmed = true

      if (this.$swal?.fire) {
        const result = await this.$swal.fire({
          title: this.$t('realty.common.confirm_delete'),
          text: String(name),
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#EF4444',
          cancelButtonColor: '#6B7280',
          confirmButtonText: this.$t('realty.common.delete'),
          cancelButtonText: this.$t('realty.common.cancel'),
        })
        confirmed = !!result.isConfirmed
      } else {
        confirmed = window.confirm(`${this.$t('realty.common.confirm_delete')} ${name}`)
      }

      if (!confirmed) return

      try {
        await this.$store.dispatch(`${this.config.store}/remove`, row.id)
        toast.success(this.$t('realty.common.deleted'))
        if (this.items.length === 1 && this.page > 1) this.page -= 1
        await this.fetch()
        await this.loadOptions()
      } catch (e) {
        toast.error(this.apiError(e))
      }
    },
  },
}
</script>
