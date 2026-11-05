<template>
  <div class="space-y-6">
    <PageHeader :title="$t('aiDrafts.title')" :subtitle="$t('aiDrafts.subtitle')" :actions="[]" />

    <div
      v-if="message"
      :class="[
        'rounded-xl border px-4 py-3 text-sm',
        message.type === 'success'
          ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400'
          : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400',
      ]"
    >
      {{ message.text }}
    </div>

    <!-- تبويبات الحالة -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="s in statuses"
        :key="s"
        type="button"
        :class="[
          'px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors',
          status === s
            ? 'bg-blue-600 text-white border-blue-600'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-slate-900 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700',
        ]"
        @click="setStatus(s)"
      >
        {{ $t('aiDrafts.status.' + s) }}
      </button>
    </div>

    <div
      class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-x-auto"
    >
      <table class="w-full text-sm">
        <thead class="bg-gray-50 dark:bg-slate-900/40 text-gray-600 dark:text-gray-400">
          <tr>
            <th class="px-4 py-3 text-start font-semibold">{{ $t('aiDrafts.contact') }}</th>
            <th class="px-4 py-3 text-start font-semibold">{{ $t('aiDrafts.reply') }}</th>
            <th class="px-4 py-3 text-start font-semibold">{{ $t('aiDrafts.conversation') }}</th>
            <th class="px-4 py-3 text-start font-semibold">{{ $t('aiDrafts.tokens') }}</th>
            <th class="px-4 py-3 text-start font-semibold">{{ $t('aiDrafts.date') }}</th>
            <th class="px-4 py-3 text-start font-semibold">{{ $t('aiDrafts.actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-slate-700">
          <tr v-if="loading">
            <td colspan="6" class="px-4 py-8 text-center text-gray-500">{{ $t('common.loading') }}</td>
          </tr>
          <tr v-else-if="!items.length">
            <td colspan="6" class="px-4 py-8 text-center text-gray-500">{{ $t('aiDrafts.empty') }}</td>
          </tr>
          <tr v-else v-for="row in items" :key="row.id" class="hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-slate-700/40">
            <td class="px-4 py-3 whitespace-nowrap" dir="ltr">{{ row.conversation?.contact }}</td>
            <td class="px-4 py-3 max-w-md">
              <p class="line-clamp-2">{{ row.body }}</p>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
              <BaseBadge :type="row.conversation?.status === 'human' ? 'warning' : 'success'" size="sm">
                {{ row.conversation?.status === 'human' ? $t('aiDrafts.human') : $t('aiDrafts.bot') }}
              </BaseBadge>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">{{ row.input_tokens + row.output_tokens }}</td>
            <td class="px-4 py-3 whitespace-nowrap">{{ formatDate(row.created_at) }}</td>
            <td class="px-4 py-3 whitespace-nowrap">
              <div class="flex items-center gap-2">
                <BaseButton
                  v-if="['draft', 'failed'].includes(status) && canApprove"
                  size="sm"
                  type="primary"
                  @click="openReview(row)"
                >
                  {{ $t('aiDrafts.review') }}
                </BaseButton>
                <BaseButton
                  v-if="row.conversation?.status === 'human' && canManage"
                  size="sm"
                  type="outline"
                  :loading="busyConversation === row.conversation.id"
                  @click="resume(row)"
                >
                  {{ $t('aiDrafts.resume_bot') }}
                </BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination :pagination="pagination" @change="load" />

    <!-- نافذة المراجعة: تعديل النص ثم إرسال أو رفض -->
    <BaseModal v-model:show="showModal" :title="$t('aiDrafts.review_title')" size="lg">
      <div v-if="current" class="space-y-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ $t('aiDrafts.to') }}: <span dir="ltr" class="font-semibold">{{ current.conversation?.contact }}</span>
        </p>
        <textarea
          v-model="text"
          rows="6"
          maxlength="1000"
          class="w-full rounded-lg border border-gray-300 dark:border-slate-600 dark:bg-slate-900 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        ></textarea>
        <p class="text-xs text-gray-500">{{ $t('aiDrafts.send_warning') }}</p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <BaseButton type="outline" :disabled="submitting" @click="showModal = false">
            {{ $t('aiDrafts.cancel') }}
          </BaseButton>
          <BaseButton type="danger" :loading="submitting === 'reject'" :disabled="!!submitting" @click="reject">
            {{ $t('aiDrafts.reject') }}
          </BaseButton>
          <BaseButton
            type="primary"
            :loading="submitting === 'approve'"
            :disabled="!!submitting || !text.trim()"
            @click="approve"
          >
            {{ $t('aiDrafts.approve') }}
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script>
import PageHeader from '@/components/shared/PageHeader.vue'
import BaseModal from '@/components/shared/BaseModal.vue'
import BaseButton from '@/components/shared/BaseButton.vue'
import BaseBadge from '@/components/shared/BaseBadge.vue'
import Pagination from '@/components/shared/Pagination.vue'

export default {
  name: 'AiDraftsIndex',
  components: { PageHeader, BaseModal, BaseButton, BaseBadge, Pagination },
  data() {
    return {
      statuses: ['draft', 'sent', 'rejected', 'failed'],
      status: 'draft',
      showModal: false,
      current: null,
      text: '',
      submitting: null, // 'approve' | 'reject' | null
      busyConversation: null,
      message: null,
    }
  },
  computed: {
    items() {
      return this.$store.getters['aiDrafts/items']
    },
    pagination() {
      return this.$store.getters['aiDrafts/pagination']
    },
    loading() {
      return this.$store.getters['aiDrafts/loading']
    },
    canApprove() {
      return this.$store.getters['auth/hasPermission']('approve_ai_drafts')
    },
    canManage() {
      return this.$store.getters['auth/hasPermission']('manage_ai_conversations')
    },
  },
  created() {
    this.load(1)
  },
  methods: {
    async load(page = 1) {
      try {
        await this.$store.dispatch('aiDrafts/fetchAll', { status: this.status, page, per_page: 20 })
      } catch (e) {
        this.notify('error', this.errorText(e))
      }
    },
    setStatus(s) {
      this.status = s
      this.message = null
      this.load(1)
    },
    openReview(row) {
      this.current = row
      this.text = row.body || ''
      this.showModal = true
    },
    async approve() {
      this.submitting = 'approve'
      try {
        // نرسل النص فقط إذا عدّله المشرف، وإلا يُرسل النص الأصلي من الخادم
        const edited = this.text.trim() !== (this.current.body || '').trim()
        await this.$store.dispatch('aiDrafts/approve', {
          id: this.current.id,
          body: edited ? this.text.trim() : null,
        })
        this.showModal = false
        this.notify('success', this.$t('aiDrafts.sent_ok'))
      } catch (e) {
        this.showModal = false
        this.notify('error', this.errorText(e))
      } finally {
        this.submitting = null
        this.load(1)
      }
    },
    async reject() {
      this.submitting = 'reject'
      try {
        await this.$store.dispatch('aiDrafts/reject', this.current.id)
        this.showModal = false
        this.notify('success', this.$t('aiDrafts.rejected_ok'))
      } catch (e) {
        this.showModal = false
        this.notify('error', this.errorText(e))
      } finally {
        this.submitting = null
        this.load(1)
      }
    },
    async resume(row) {
      this.busyConversation = row.conversation.id
      try {
        await this.$store.dispatch('aiDrafts/resumeBot', row.conversation.id)
        this.notify('success', this.$t('aiDrafts.resumed_ok'))
      } catch (e) {
        this.notify('error', this.errorText(e))
      } finally {
        this.busyConversation = null
        this.load(this.pagination.current_page)
      }
    },
    notify(type, text) {
      this.message = { type, text }
    },
    errorText(e) {
      return e?.response?.data?.message || e?.message || this.$t('aiDrafts.error')
    },
    formatDate(value) {
      if (!value) return ''
      return new Date(value).toLocaleString(this.$i18n.locale === 'ar' ? 'ar-KW' : 'en-GB')
    },
  },
}
</script>
