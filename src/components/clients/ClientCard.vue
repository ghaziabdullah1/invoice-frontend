<template>
  <div class="client-card">
    <!-- رأس البطاقة -->
    <div class="card-header">
      <div class="client-info">
        <!-- الصورة الرمزية -->
        <div class="avatar" :class="avatarColor">
          {{ clientInitials }}
        </div>

        <!-- المعلومات الأساسية -->
        <div class="client-details">
          <h3 class="client-name">{{ client.name }}</h3>
          <div class="client-email">
            <!-- أيقونة البريد الإلكتروني مباشرة -->
            <svg
              class="w-4 h-4 text-gray-400 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>{{ client.email || 'لا يوجد بريد إلكتروني' }}</span>
          </div>
        </div>
      </div>

      <!-- قائمة الإجراءات -->
      <ActionMenu
        :show="showActions"
        @toggle="showActions = !showActions"
        @view="$emit('view', client)"
        @edit="$emit('edit', client)"
        @delete="handleDelete"
      />
    </div>

    <!-- محتوى البطاقة -->
    <div class="card-content">
      <!-- معلومات الاتصال -->
      <div class="contact-grid">
        <!-- الهاتف -->
        <div class="info-item">
          <div class="info-icon">
            <svg
              class="w-4 h-4 text-gray-600 dark:text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <div class="info-content">
            <p class="info-label">الهاتف</p>
            <p class="info-value">{{ client.phone || 'غير متوفر' }}</p>
          </div>
        </div>

        <!-- الشركة -->
        <div class="info-item">
          <div class="info-icon">
            <svg
              class="w-4 h-4 text-gray-600 dark:text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div class="info-content">
            <p class="info-label">الشركة</p>
            <p class="info-value">{{ client.company_name || 'غير متوفر' }}</p>
          </div>
        </div>

        <!-- الرقم الضريبي -->
        <div class="info-item">
          <div class="info-icon">
            <svg
              class="w-4 h-4 text-gray-600 dark:text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
              />
            </svg>
          </div>
          <div class="info-content">
            <p class="info-label">الرقم الضريبي</p>
            <p class="info-value">{{ client.tax_number || 'غير متوفر' }}</p>
          </div>
        </div>

        <!-- تاريخ التسجيل -->
        <div class="info-item">
          <div class="info-icon">
            <svg
              class="w-4 h-4 text-gray-600 dark:text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div class="info-content">
            <p class="info-label">تاريخ التسجيل</p>
            <p class="info-value">{{ formatDate(client.created_at) }}</p>
          </div>
        </div>
      </div>

      <!-- العنوان -->
      <AddressSection :address="client.address" />

      <!-- أزرار سريعة -->
      <div class="card-footer">
        <div class="last-updated">آخر تحديث: {{ formatDate(client.updated_at) }}</div>
        <div class="action-buttons">
          <button @click="$emit('view', client)" class="btn-view">عرض التفاصيل</button>
          <button @click="$emit('edit', client)" class="btn-edit">تعديل</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ActionMenu from './ActionMenu.vue'
import AddressSection from './AddressSection.vue'

export default {
  name: 'ClientCard',
  components: {
    ActionMenu,
    AddressSection,
  },
  props: {
    client: {
      type: Object,
      required: true,
    },
  },
  emits: ['view', 'edit', 'delete'],
  data() {
    return {
      showActions: false,
    }
  },
  computed: {
    clientInitials() {
      if (!this.client.name) return '?'
      return this.client.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },

    avatarColor() {
      const colors = ['blue', 'green', 'purple', 'orange', 'red', 'indigo']
      const nameHash = this.client.name.split('').reduce((a, b) => {
        a = (a << 5) - a + b.charCodeAt(0)
        return a & a
      }, 0)
      return colors[Math.abs(nameHash) % colors.length]
    },
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '-'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },

    handleDelete() {
      if (confirm(`هل أنت متأكد من حذف العميل "${this.client.name}"؟`)) {
        this.$emit('delete', this.client)
      }
    },
  },
}
</script>

<style scoped>
.client-card {
  @apply bg-white rounded-2xl shadow-sm border border-gray-200/60 hover:shadow-lg hover:border-blue-200/50 transition-all duration-300;
}

.card-header {
  @apply p-6 border-b border-gray-200/60 flex items-start justify-between;
}

.client-info {
  @apply flex items-start space-x-4 flex-1 min-w-0;
}

.avatar {
  @apply w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 text-white font-bold text-base flex-shrink-0;
}

.avatar.blue {
  @apply bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/25;
}
.avatar.green {
  @apply bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/25;
}
.avatar.purple {
  @apply bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/25;
}
.avatar.orange {
  @apply bg-gradient-to-br from-orange-500 to-orange-600 shadow-orange-500/25;
}
.avatar.red {
  @apply bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/25;
}
.avatar.indigo {
  @apply bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-indigo-500/25;
}

.client-details {
  @apply flex-1 min-w-0;
}

.client-name {
  @apply text-lg font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors duration-200;
}

.client-email {
  @apply flex items-center space-x-2 mt-2 text-sm text-gray-600;
}

.card-content {
  @apply p-6;
}

.contact-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4 mb-4;
}

.info-item {
  @apply flex items-center space-x-3;
}

.info-icon {
  @apply p-2 bg-gray-50 rounded-lg;
}

.info-content {
  @apply min-w-0 flex-1;
}

.info-label {
  @apply text-sm text-gray-500;
}

.info-value {
  @apply text-gray-900 font-medium truncate;
}

.card-footer {
  @apply flex items-center justify-between mt-6 pt-4 border-t border-gray-200/60;
}

.last-updated {
  @apply text-xs text-gray-500;
}

.action-buttons {
  @apply flex items-center space-x-2;
}

.btn-view {
  @apply px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 font-medium;
}

.btn-edit {
  @apply px-4 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200 font-medium;
}
</style>
