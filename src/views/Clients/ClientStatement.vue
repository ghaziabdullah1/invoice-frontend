<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-6">
    <div class="max-w-5xl mx-auto space-y-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <router-link :to="`/clients/${clientId}`" class="text-sm text-gray-500 hover:text-emerald-600">← العودة للعميل</router-link>
          <h1 class="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">كشف حساب العميل</h1>
          <p v-if="client" class="text-sm text-gray-500 dark:text-slate-400">{{ client.name }}<span v-if="client.company_name"> · {{ client.company_name }}</span></p>
        </div>
        <div class="flex gap-2">
          <button @click="print" :disabled="!sections.length" class="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-600 text-sm font-medium text-gray-700 dark:text-slate-200 disabled:opacity-40">طباعة</button>
          <button @click="exportCsv" :disabled="!sections.length" class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium disabled:opacity-40">تصدير Excel</button>
        </div>
      </div>

      <div class="flex flex-wrap items-end gap-3 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4">
        <div>
          <label class="block text-xs text-gray-500 mb-1">من تاريخ</label>
          <input v-model="from" type="date" class="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">إلى تاريخ</label>
          <input v-model="to" type="date" class="px-3 py-2 border border-gray-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white" />
        </div>
        <button @click="load" class="px-5 py-2 rounded-lg bg-gray-900 dark:bg-slate-600 text-white text-sm font-medium">عرض</button>
      </div>

      <div v-if="loading" class="flex justify-center py-16"><div class="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div></div>
      <p v-else-if="error" class="text-center text-red-500 py-10">{{ error }}</p>
      <p v-else-if="!sections.length" class="text-center text-gray-500 dark:text-slate-400 py-10">لا توجد حركات لهذا العميل</p>

      <template v-else>
        <div v-for="sec in sections" :key="sec.currency" class="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 dark:border-slate-700 font-bold text-gray-900 dark:text-white">العملة: {{ sec.currency || '-' }}</div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
            <div><p class="text-xs text-gray-500">رصيد افتتاحي</p><p class="font-bold text-gray-900 dark:text-white">{{ fmt(sec.opening, sec.currency) }}</p></div>
            <div><p class="text-xs text-gray-500">إجمالي المدين</p><p class="font-bold text-gray-900 dark:text-white">{{ fmt(sec.total_debit, sec.currency) }}</p></div>
            <div><p class="text-xs text-gray-500">إجمالي الدائن</p><p class="font-bold text-gray-900 dark:text-white">{{ fmt(sec.total_credit, sec.currency) }}</p></div>
            <div><p class="text-xs text-gray-500">الرصيد الحالي</p><p class="font-extrabold text-emerald-600">{{ fmt(sec.closing, sec.currency) }}</p></div>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 dark:bg-slate-700/50 text-gray-500 dark:text-slate-400 text-xs">
                <tr>
                  <th class="px-4 py-2 text-right">التاريخ</th>
                  <th class="px-4 py-2 text-right">البيان</th>
                  <th class="px-4 py-2 text-right">المرجع</th>
                  <th class="px-4 py-2 text-right">مدين</th>
                  <th class="px-4 py-2 text-right">دائن</th>
                  <th class="px-4 py-2 text-right">الرصيد</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-slate-700 text-gray-800 dark:text-slate-200">
                <tr v-if="!sec.entries.length"><td colspan="6" class="px-4 py-4 text-center text-gray-400">لا حركات في هذه الفترة</td></tr>
                <tr v-for="(r, i) in sec.entries" :key="i">
                  <td class="px-4 py-2 whitespace-nowrap">{{ r.date }}</td>
                  <td class="px-4 py-2">{{ typeLabel(r.type) }}</td>
                  <td class="px-4 py-2"><router-link :to="`/invoices/${r.invoice_id}`" class="text-emerald-600 hover:underline">{{ r.ref }}</router-link></td>
                  <td class="px-4 py-2">{{ r.debit ? fmt(r.debit, sec.currency) : '' }}</td>
                  <td class="px-4 py-2">{{ r.credit ? fmt(r.credit, sec.currency) : '' }}</td>
                  <td class="px-4 py-2 font-semibold">{{ fmt(r.balance, sec.currency) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import axios from '@/api/axios'
import { formatCurrency } from '@/utils/formatters'
import { COMPANY } from '@/config/company'

export default {
  name: 'ClientStatement',
  data() {
    return { loading: false, error: null, client: null, sections: [], from: '', to: '' }
  },
  computed: {
    clientId() { return this.$route.params.id },
  },
  mounted() { this.load() },
  methods: {
    async load() {
      this.loading = true
      this.error = null
      try {
        const params = {}
        if (this.from) params.from = this.from
        if (this.to) params.to = this.to
        const { data } = await axios.get(`/admin/clients/${this.clientId}/statement`, { params })
        this.client = data.data.client
        this.sections = data.data.sections
      } catch (e) {
        this.sections = []
        this.error = e.response?.data?.message || 'تعذر تحميل الكشف'
      } finally {
        this.loading = false
      }
    },
    fmt(n, cur) { return formatCurrency(n, cur) },
    num(n, cur) {
      const d = ['KWD', 'BHD', 'OMR', 'JOD', 'TND'].includes(cur) ? 3 : 2
      return Number(n || 0).toFixed(d)
    },
    typeLabel(t) { return t === 'invoice' ? 'فاتورة' : 'سداد' },
    esc(s) {
      return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
    },
    print() {
      const e = this.esc
      const head = [COMPANY.address, COMPANY.phone, COMPANY.email, COMPANY.taxNumber].filter(Boolean).map(e).join(' | ')
      const period = (this.from || this.to) ? `الفترة: ${e(this.from || '...')} إلى ${e(this.to || '...')}` : 'كل الفترات'
      const tables = this.sections.map((s) => {
        const rows = s.entries.map((r) =>
          `<tr><td>${e(r.date)}</td><td>${e(this.typeLabel(r.type))}</td><td>${e(r.ref)}</td><td>${r.debit ? this.num(r.debit, s.currency) : ''}</td><td>${r.credit ? this.num(r.credit, s.currency) : ''}</td><td>${this.num(r.balance, s.currency)}</td></tr>`
        ).join('')
        return `<h3>العملة: ${e(s.currency || '-')}</h3>
          <p>رصيد افتتاحي: ${this.num(s.opening, s.currency)} | مدين: ${this.num(s.total_debit, s.currency)} | دائن: ${this.num(s.total_credit, s.currency)} | <b>الرصيد: ${this.num(s.closing, s.currency)}</b></p>
          <table><thead><tr><th>التاريخ</th><th>البيان</th><th>المرجع</th><th>مدين</th><th>دائن</th><th>الرصيد</th></tr></thead><tbody>${rows}</tbody></table>`
      }).join('')
      const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>كشف حساب</title>
        <style>body{font-family:Tahoma,Arial,sans-serif;padding:24px;color:#111}h1,h2,h3{margin:4px 0}table{width:100%;border-collapse:collapse;margin:8px 0 20px}th,td{border:1px solid #ccc;padding:6px 8px;font-size:13px;text-align:right}th{background:#f3f4f6}</style></head><body>
        ${COMPANY.logo ? `<img src="${e(COMPANY.logo)}" alt="" style="height:60px" />` : ''}
        ${COMPANY.name ? `<h2>${e(COMPANY.name)}</h2>` : ''}<p>${head}</p><hr>
        <h1>كشف حساب العميل</h1><p>${e(this.client?.name)} ${this.client?.company_name ? '· ' + e(this.client.company_name) : ''}</p><p>${period}</p>${tables}</body></html>`
      const w = window.open('', '_blank')
      if (!w) { this.error = 'المتصفح حجب نافذة الطباعة، اسمح بالنوافذ المنبثقة'; return }
      w.document.write(html)
      w.document.close()
      w.focus()
      w.print()
    },
    exportCsv() {
      const q = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"'
      const lines = [['العملة', 'التاريخ', 'البيان', 'المرجع', 'مدين', 'دائن', 'الرصيد'].map(q).join(',')]
      this.sections.forEach((s) => {
        lines.push([s.currency, '', 'رصيد افتتاحي', '', '', '', this.num(s.opening, s.currency)].map(q).join(','))
        s.entries.forEach((r) => lines.push([s.currency, r.date, this.typeLabel(r.type), r.ref, r.debit ? this.num(r.debit, s.currency) : '', r.credit ? this.num(r.credit, s.currency) : '', this.num(r.balance, s.currency)].map(q).join(',')))
      })
      const blob = new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `statement_${this.clientId}_${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    },
  },
}
</script>
