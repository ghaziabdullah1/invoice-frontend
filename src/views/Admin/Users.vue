<template>
  <div class="min-h-screen py-6 md:py-8 bg-page dark:bg-gray-900 transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
      <!-- Header with Glassmorphism -->
      <div class="mb-8">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div
                class="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-200/50 border border-blue-100"
              >
                <svg
                  class="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-8a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {{ $t('users.title') }}
                </h1>
                <p class="text-gray-600 dark:text-gray-300 text-sm mt-1 flex items-center gap-2">
                  <span class="w-1 h-1 bg-blue-400 rounded-full"></span>
                  {{ $t('users.subtitle') }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <button
              @click="openAddModal"
              class="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group transform hover:-translate-y-0.5"
            >
              <svg
                class="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span class="font-semibold">{{ $t('users.create_new') }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <UsersStatsGrid
        :total-users="storeUsers.length"
        :active-users="activeUsersCount"
        :inactive-users="inactiveUsersCount"
        :total-groups="storeGroups.length"
      />

      <!-- Filters -->
      <UserFilters
        v-model="filters"
        :groups="storeGroups"
        @search="loadData"
        @reset="resetFilters"
      />
      <!-- Loading State -->
      <div v-if="storeLoading" class="mb-8">
        <div
          class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-gray-700/50 shadow-lg p-12"
        >
          <div class="text-center space-y-4">
            <div class="relative inline-block">
              <div
                class="w-16 h-16 border-4 border-blue-100 dark:border-blue-900 rounded-full"
              ></div>
              <div
                class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"
              ></div>
            </div>
            <div>
              <p class="text-lg font-semibold text-gray-800 dark:text-white">
                {{ $t('common.loading') }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {{ $t('users.loading_subtitle') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="storeError" class="mb-8">
        <div
          class="bg-gradient-to-r from-red-50/80 to-red-100/50 dark:from-red-900/30 dark:to-red-800/20 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 rounded-2xl p-6 shadow-lg"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <div class="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <svg
                  class="w-6 h-6 text-red-600 dark:text-red-400"
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
            </div>
            <div class="mr-4 flex-1">
              <h3 class="text-lg font-semibold text-red-800 dark:text-red-300">
                {{ $t('errors.load_failed') }}
              </h3>
              <p class="text-red-700 dark:text-red-400 mt-2">{{ storeError }}</p>
            </div>
            <button
              @click="clearStoreError"
              class="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
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
      </div>

      <!-- Table Section -->
      <div v-else>
        <div
          class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-gray-700/50 shadow-xl shadow-blue-100/20 dark:shadow-none overflow-hidden"
        >
          <!-- Table Header -->
          <div
            class="px-6 py-5 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-white dark:from-gray-800/50 dark:to-gray-800"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                    {{ $t('users.user_list') }}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {{ $t('users.list_subtitle') }}
                  </p>
                </div>
              </div>
              <!--<div
                class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-sm"
              >
                 <span class="font-bold">{{ storeUsers.length }}</span>
                <span class="text-blue-100 mr-1">{{ $t('common.total') }}</span>
              </div>-->
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="storeUsers.length === 0" class="text-center py-16 px-4">
            <div class="max-w-md mx-auto">
              <div class="relative mb-6">
                <div
                  class="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-3xl mx-auto flex items-center justify-center shadow-lg"
                >
                  <svg
                    class="w-12 h-12 text-blue-400 dark:text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-8a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {{ $t('users.no_users') }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-8">
                {{ $t('users.start_creating_message') }}
              </p>
              <button
                @click="openAddModal"
                class="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto transform hover:-translate-y-0.5"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {{ $t('users.create_first') }}
              </button>
            </div>
          </div>

          <!-- Table Content -->
          <div v-else class="overflow-hidden">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
                <thead>
                  <tr
                    class="bg-gradient-to-r from-gray-50 to-gray-100/30 dark:from-gray-800 dark:to-gray-800/50"
                  >
                    <th class="table-header text-start text-gray-700 dark:text-gray-300">
                      {{ $t('users.name') }}
                    </th>
                    <th class="table-header text-start text-gray-700 dark:text-gray-300">
                      {{ $t('users.email') }}
                    </th>
                    <th class="table-header text-center text-gray-700 dark:text-gray-300">
                      {{ $t('users.group') }}
                    </th>
                    <th class="table-header text-center text-gray-700 dark:text-gray-300">
                      {{ $t('common.status') }}
                    </th>
                    <th class="table-header text-center text-gray-700 dark:text-gray-300">
                      {{ $t('common.created_at') }}
                    </th>
                    <th class="table-header text-center text-gray-700 dark:text-gray-300">
                      {{ $t('common.actions') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200/30 dark:divide-gray-700/30">
                  <tr
                    v-for="user in storeUsers"
                    :key="user.id"
                    class="hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <!-- Name -->
                    <td class="table-cell">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 ml-4">
                          <div
                            class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-md mr-4"
                          >
                            <span class="text-white font-bold text-lg">
                              {{ getInitials(user.name) }}
                            </span>
                          </div>
                        </div>
                        <div class="mr-4">
                          <div class="text-base font-bold text-gray-900 dark:text-white text-start" dir="auto">
                            {{ user.name }}
                          </div>
                          <div class="flex items-center gap-2 mt-1">
                            <span class="text-xs text-gray-500 dark:text-gray-400" dir="ltr">ID: {{ user.id }}</span>
                            <span
                              v-if="user.id === currentUser?.id"
                              class="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full font-medium"
                            >
                              {{ $t('users.you') }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Email -->
                    <td class="table-cell">
                      <div class="flex flex-col">
                        <span class="text-sm text-gray-900 dark:text-gray-100 font-medium" dir="ltr" style="text-align: left;">{{ user.email }}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{
                          $t('users.primary_email')
                        }}</span>
                      </div>
                    </td>

                    <!-- Group -->
                    <td class="table-cell text-center">
                      <span dir="auto"
                        class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/30 text-blue-800 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50"
                      >
                        {{
                          $i18n.locale === 'ar'
                            ? (user.admin_group?.title_ar || user.admin_group?.title_en || $t('users.no_group'))
                            : (user.admin_group?.title_en || user.admin_group?.title_ar || $t('users.no_group'))
                        }}
                      </span>
                    </td>

                    <!-- Status -->
                    <td class="table-cell text-center">
                      <span
                        :class="[
                          'status-badge',
                          user.is_active
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
                        ]"
                      >
                        <span
                          :class="['status-dot', user.is_active ? 'bg-green-500' : 'bg-red-500']"
                        ></span>
                        {{
                          user.is_active ? $t('users.status.active') : $t('users.status.inactive')
                        }}
                      </span>
                    </td>

                    <!-- Created Date -->
                    <td class="table-cell text-center">
                      <div>
                        <div class="text-sm text-gray-900 dark:text-gray-100 font-bold">
                          {{ formatDate(user.created_at) }}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {{ $t('common.created') }}
                        </div>
                      </div>
                    </td>

                    <!-- Actions -->
                    <td class="table-cell text-center">
                      <div class="flex items-center justify-center gap-2">
                        <button
                          @click="editUser(user)"
                          class="ui-icon-btn"
                          :title="$t('buttons.edit')"
                        >
                          <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          @click="toggleUserStatus(user)"
                          :class="[
                            'p-2.5 rounded-xl transition-all duration-200 transform hover:scale-110',
                            user.is_active
                              ? 'text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30'
                              : 'text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30',
                          ]"
                          :title="user.is_active ? $t('users.deactivate') : $t('users.activate')"
                        >
                          <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              v-if="!user.is_active"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                            <path
                              v-else
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636"
                            />
                          </svg>
                        </button>
                        <button
                          v-if="user.id !== currentUser?.id"
                          @click="confirmDelete(user)"
                          class="ui-icon-btn"
                          :title="$t('buttons.delete')"
                        >
                          <svg
                            class="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <UserFormModal
      :show="showModal"
      :editing-user="editingUser"
      :groups="storeGroups"
      :submitting="submitting"
      :form-error="formError"
      @close="closeModal"
      @submit="handleSubmit"
      @clear-error="formError = null"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import UsersStatsGrid from '@/components/users/UsersStatsGrid.vue'
import UserFilters from '@/components/users/UserFilters.vue'
import UserFormModal from '@/components/users/UserFormModal.vue'

export default {
  name: 'AdminUsers',

  components: {
    UsersStatsGrid,
    UserFilters,
    UserFormModal,
  },

  data() {
    return {
      showModal: false,
      submitting: false,
      editingUser: null,
      formError: null,
      filters: {
        search: '',
        group_id: '',
        status: 'all',
        date_from: '',
      },
    }
  },

  computed: {
    ...mapState('users', {
      storeUsers: (state) => state.users,
      storeGroups: (state) => state.groups,
      storeLoading: (state) => state.isLoading,
      storeError: (state) => state.error,
    }),
    ...mapState('auth', {
      currentUser: (state) => state.user,
    }),
    activeUsersCount() {
      return this.storeUsers.filter((u) => u.is_active).length
    },
    inactiveUsersCount() {
      return this.storeUsers.filter((u) => !u.is_active).length
    },
  },

  async mounted() {
    await this.loadData()
  },

  methods: {
    ...mapActions('users', [
      'getUsers',
      'getUserGroups',
      'createUser',
      'updateUser',
      'deleteUser',
      'updateUserStatus',
      'clearError',
    ]),

    async loadData() {
      try {
        await Promise.all([this.getUsers(this.filters), this.getUserGroups()])
      } catch (error) {
        console.error('Error loading data:', error)
        this.$toast.error(this.$t('errors.failed_to_load_data'))
      }
    },

    resetFilters() {
      this.filters = {
        search: '',
        group_id: '',
        status: 'all',
        date_from: '',
      }
      this.loadData()
      this.$toast.info(this.$t('reports.buttons.reset_filters'), {
        icon: '🔄',
        position: 'top-right',
      })
    },

    clearStoreError() {
      this.clearError()
    },

    getInitials(name) {
      if (!name) return '؟؟'
      return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },

    formatDate(date) {
      if (!date) return '-'
      const dateObj = new Date(date)
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },

    openAddModal() {
      this.editingUser = null
      this.formError = null
      this.showModal = true
    },

    editUser(user) {
      this.editingUser = user
      this.formError = null
      this.showModal = true
    },

    validatePassword(formData) {
      if (!this.editingUser) {
        if (!formData.password || formData.password.length < 8) {
          throw new Error(this.$t('errors.password_min_length'))
        }
      } else if (formData.password && formData.password.length < 8) {
        throw new Error(this.$t('errors.password_min_length'))
      }

      if (formData.password !== formData.password_confirmation) {
        throw new Error(this.$t('errors.password_mismatch'))
      }
    },

    async handleSubmit(formData) {
      this.submitting = true
      this.formError = null

      try {
        if (!this.editingUser || formData.password) {
          this.validatePassword(formData)
        }

        if (this.editingUser) {
          await this.updateUser({ id: this.editingUser.id, data: formData })
          await this.loadData()
          this.$toast.success(this.$t('users.messages.update_success'), {
            icon: '✅',
            position: 'top-right',
          })
        } else {
          await this.createUser(formData)
          await this.loadData()
          this.$toast.success(this.$t('users.messages.create_success'), {
            icon: '✅',
            position: 'top-right',
          })
        }

        this.closeModal()
      } catch (error) {
        const message =
          error.message ||
          this.$t(
            this.editingUser ? 'errors.failed_to_update_user' : 'errors.failed_to_create_user',
          )
        this.formError = message
        this.$toast.error(message, { icon: '❌', position: 'top-right' })
      } finally {
        this.submitting = false
      }
    },

    async toggleUserStatus(user) {
      const action = user.is_active ? this.$t('users.deactivate') : this.$t('users.activate')
      const confirmed = await this.$swal({
        title: this.$t('users.confirm_status_change_title'),
        text: this.$t('users.confirm_status_change', { name: user.name, action: action }),
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: user.is_active ? '#EAB308' : '#10B981',
        cancelButtonColor: '#6B7280',
        confirmButtonText: action,
        cancelButtonText: this.$t('common.cancel'),
        reverseButtons: true,
        focusCancel: true,
      })

      if (confirmed.isConfirmed) {
        try {
          await this.updateUserStatus({
            id: user.id,
            is_active: !user.is_active,
          })
          await this.loadData()
          this.$toast.success(this.$t('users.messages.status_change_success', { action: action }), {
            icon: '✅',
            position: 'top-right',
          })
        } catch (error) {
          this.$toast.error(error.message || this.$t('errors.failed_to_change_status'), {
            icon: '❌',
            position: 'top-right',
          })
        }
      }
    },

    async confirmDelete(user) {
      const confirmed = await this.$swal({
        title: this.$t('users.delete_confirm_title'),
        text: this.$t('users.delete_confirm', { name: user.name }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: this.$t('common.delete'),
        cancelButtonText: this.$t('common.cancel'),
        reverseButtons: true,
        focusCancel: true,
      })

      if (confirmed.isConfirmed) {
        try {
          await this.deleteUser(user.id)
          await this.loadData()
          this.$toast.success(this.$t('users.messages.delete_success'), {
            icon: '✅',
            position: 'top-right',
          })
        } catch (error) {
          this.$toast.error(error.message || this.$t('errors.failed_to_delete_user'), {
            icon: '❌',
            position: 'top-right',
          })
        }
      }
    },

    closeModal() {
      this.showModal = false
      this.editingUser = null
      this.formError = null
    },
  },
}
</script>

<style scoped>
.table-header {
  @apply px-6 py-4 text-start text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider;
}
.table-cell {
  @apply px-6 py-4;
}
.status-badge {
  @apply px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1;
}
.status-dot {
  @apply w-2 h-2 rounded-full;
}
</style>
