<template>
  <div class="mb-5">
    <h4 class="font-semibold text-gray-900 dark:text-slate-100 mb-2">{{ $t('procurement.chain.title') }}</h4>

    <div
      v-if="!steps.length"
      class="text-sm text-gray-500 dark:text-slate-400 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 p-4 text-center"
    >
      {{ $t('procurement.chain.none') }}
    </div>

    <ol v-else class="space-y-2">
      <li
        v-for="a in steps"
        :key="a.id"
        class="flex items-start gap-3 rounded-xl border p-3"
        :class="boxClass(a.status)"
      >
        <span
          class="w-7 h-7 flex-shrink-0 rounded-full text-xs font-bold flex items-center justify-center"
          :class="dotClass(a.status)"
        >
          {{ a.step }}
        </span>
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <p class="text-sm font-semibold text-gray-900 dark:text-slate-100">{{ a.approver?.name || '-' }}</p>
            <span class="px-2 py-0.5 rounded-full text-[11px] font-semibold" :class="badgeClass(a.status)">
              {{ $t(`procurement.chain.status.${a.status}`) }}
            </span>
          </div>
          <p v-if="isOpen(a)" class="text-xs text-gray-500 dark:text-slate-400 mt-1">
            {{ $t('procurement.chain.deadline') }}: {{ dt(a.deadline_at) }}
            <span v-if="isOverdue(a)" class="text-red-600 dark:text-red-400 font-semibold"> • {{ $t('procurement.chain.overdue') }}</span>
          </p>
          <p v-if="a.signed_at" class="text-xs text-gray-500 dark:text-slate-400 mt-1">{{ dt(a.signed_at) }}</p>
          <p v-if="a.reason" class="text-xs text-gray-600 dark:text-slate-300 mt-1">{{ a.reason }}</p>
        </div>
      </li>
    </ol>
  </div>
</template>

<script>
const BOX = {
  waiting: 'border-gray-200 dark:border-slate-700',
  pending: 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-900/10',
  escalated: 'border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-900/10',
  approved: 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10',
  rejected: 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10',
  skipped: 'border-gray-200 opacity-60 dark:border-slate-700',
}
const DOT = {
  waiting: 'bg-gray-200 text-gray-600 dark:bg-slate-700 dark:text-slate-300',
  pending: 'bg-yellow-500 text-white',
  escalated: 'bg-orange-500 text-white',
  approved: 'bg-green-600 text-white',
  rejected: 'bg-red-600 text-white',
  skipped: 'bg-gray-200 text-gray-500 dark:bg-slate-700 dark:text-slate-400',
}
const BADGE = {
  waiting: 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-slate-200',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-400',
  escalated: 'bg-orange-100 text-orange-800 dark:bg-orange-500/10 dark:text-orange-400',
  approved: 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400',
  skipped: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
}

export default {
  name: 'ApprovalChain',
  props: {
    approvals: { type: Array, default: () => [] },
  },
  computed: {
    steps() {
      return [...(this.approvals || [])].sort((x, y) => x.step - y.step)
    },
  },
  methods: {
    boxClass(s) { return BOX[s] || BOX.waiting },
    dotClass(s) { return DOT[s] || DOT.waiting },
    badgeClass(s) { return BADGE[s] || BADGE.waiting },
    isOpen(a) { return a.status === 'pending' || a.status === 'escalated' },
    isOverdue(a) { return this.isOpen(a) && a.deadline_at && new Date(a.deadline_at) < new Date() },
    dt(v) {
      if (!v) return '-'
      const d = new Date(v)
      return isNaN(d) ? '-' : d.toLocaleString('en-US')
    },
  },
}
</script>
