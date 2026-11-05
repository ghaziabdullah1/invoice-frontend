<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 py-6 md:py-8">
    <div class="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100">
            {{ $t('procurement.workflows.title') }}
          </h1>
          <p class="text-gray-600 text-sm mt-1 dark:text-slate-400">
            {{ $t('procurement.workflows.subtitle') }}
          </p>
        </div>
        <button v-if="canManage" @click="openCreate" class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          {{ $t('procurement.workflows.add') }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
      </div>

      <!-- Empty -->
      <div v-else-if="workflows.length === 0" class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-12 text-center">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
        </svg>
        <p class="text-gray-500 dark:text-slate-400">{{ $t('procurement.workflows.empty') }}</p>
      </div>

      <!-- List -->
      <div v-else class="space-y-3">
        <div v-for="wf in workflows" :key="wf.key" class="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div class="px-5 py-4 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold">
                {{ wf.currency }}
              </span>
              <span class="text-sm font-semibold text-gray-900 dark:text-slate-100">
                {{ formatRange(wf.min_amount, wf.max_amount) }}
              </span>
              <span v-if="wf.requester_department_name" class="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                {{ wf.requester_department_name }}
              </span>
              <span v-else class="text-xs px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 rounded-full">
                {{ $t('procurement.workflows.all_departments') }}
              </span>
              <span class="text-xs text-gray-500 dark:text-slate-400">
                {{ wf.steps.length }} {{ $t('procurement.workflows.steps_count') }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <button v-if="canManage" @click="openEdit(wf)" class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition" :title="$t('buttons.edit')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button v-if="canManage" @click="confirmDelete(wf)" class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-slate-300 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition" :title="$t('buttons.delete')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>

          <div class="p-5">
            <div class="flex flex-wrap items-center gap-2">
              <div v-for="(s, i) in wf.steps" :key="s.id" class="flex items-center gap-2">
                <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-700">
                  <span class="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{{ i + 1 }}</span>
                  <div>
                    <p class="text-sm font-medium text-gray-900 dark:text-slate-100">{{ s.display }}</p>
                    <p class="text-xs text-gray-500 dark:text-slate-400">SLA {{ s.sla_hours }}h</p>
                  </div>
                </div>
                <svg v-if="i < wf.steps.length - 1" class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════ -->
      <!-- BUILDER MODAL -->
      <!-- ═══════════════════════════════════════════════ -->
      <div v-if="showBuilder" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" @click.self="!saving && closeBuilder()">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-3xl my-8">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-slate-100">
                {{ editing ? $t('procurement.workflows.edit') : $t('procurement.workflows.add') }}
              </h3>
              <p class="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                {{ $t('procurement.workflows.builder_hint') }}
              </p>
            </div>
            <button @click="closeBuilder" :disabled="saving" class="p-2 text-gray-500 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            <!-- Context -->
            <div>
              <h4 class="text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-3">
                {{ $t('procurement.workflows.context') }}
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">{{ $t('procurement.workflows.currency') }}</label>
                  <select v-model="form.currency" :class="inputClass">
                    <option value="SAR">SAR — ريال سعودي</option>
                    <option value="KWD">KWD — دينار كويتي</option>
                    <option value="AED">AED — درهم إماراتي</option>
                    <option value="USD">USD — دولار</option>
                    <option value="EUR">EUR — يورو</option>
                    <option value="GBP">GBP — جنيه إسترليني</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">{{ $t('procurement.workflows.requester_department') }}</label>
                  <select v-model="form.requester_department_id" :class="inputClass">
                    <option value="">{{ $t('procurement.workflows.all_departments') }}</option>
                    <option v-for="d in departments" :key="d.id" :value="d.id">
                            {{ d.name }}{{ d.manager ? " — " + d.manager.name : " (⚠️ " + $t("procurement.workflows.hint.no_manager") + ")" }}
                          </option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">{{ $t('procurement.workflows.min_amount') }}</label>
                  <input v-model.number="form.min_amount" type="number" min="0" step="0.01" :class="inputClass" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">{{ $t('procurement.workflows.max_amount') }}</label>
                  <input v-model="form.max_amount" type="number" min="0" step="0.01" :class="inputClass" :placeholder="$t('procurement.workflows.no_limit')" />
                </div>
              </div>
            </div>

            <!-- Steps -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-sm font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                  {{ $t('procurement.workflows.steps') }}
                  <span class="text-xs text-gray-500 font-normal">({{ form.steps.length }})</span>
                </h4>
                <button @click="addStep" class="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-300 rounded-lg flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                  {{ $t('procurement.workflows.add_step') }}
                </button>
              </div>

              <div v-if="form.steps.length === 0" class="text-center py-8 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl text-gray-500 dark:text-slate-400 text-sm">
                {{ $t('procurement.workflows.no_steps') }}
              </div>

              <div v-else class="space-y-2">
                <div
                  v-for="(step, i) in form.steps"
                  :key="step._uid"
                  class="bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-700 p-3 cursor-move"
                  draggable="true"
                  :class="{ 'opacity-50 ring-2 ring-blue-500': dragIndex === i }"
                  @dragstart="onDragStart(i, $event)"
                  @dragover.prevent="onDragOver(i)"
                  @dragend="onDragEnd"
                >
                  <div class="flex items-start gap-3">
                    <div class="flex flex-col items-center gap-1">
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                      <span class="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">{{ i + 1 }}</span>
                    </div>

                    <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div class="sm:col-span-2">
                        <select v-model="step.approver_type" :class="inputClassSm" @change="onTypeChange(step)">
                          <option value="requester_dept_manager">{{ $t('procurement.workflows.types.requester_dept_manager') }}</option>
                          <option value="beneficiary_dept_manager">{{ $t('procurement.workflows.types.beneficiary_dept_manager') }}</option>
                          <option value="specific_dept_manager">{{ $t('procurement.workflows.types.specific_dept_manager') }}</option>
                          <option value="by_email">{{ $t('procurement.workflows.types.by_email') }}</option>
                          <option value="ceo">{{ $t('procurement.workflows.types.ceo') }}</option>
                        </select>
                      </div>

                      <div v-if="step.approver_type === 'specific_dept_manager'">
                        <select v-model="step.approver_department_id" :class="inputClassSm">
                          <option value="">{{ $t('procurement.workflows.pick_department') }}</option>
                          <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
                        </select>
                      </div>
                      <template v-if="step.approver_type === 'by_email'">
                        <input v-model="step.approver_email" type="email" dir="ltr" :placeholder="$t('procurement.workflows.fields.email')" :class="inputClassSm" />
                        <input v-model="step.approver_name" type="text" :placeholder="$t('procurement.workflows.fields.name')" :class="inputClassSm" />
                        <input v-model="step.approver_title" type="text" :placeholder="$t('procurement.workflows.fields.title')" :class="inputClassSm" />
                      </template>
                      <div>
                        <label class="block text-[11px] text-gray-500 dark:text-slate-400 mb-0.5">{{ $t('procurement.workflows.fields.sla_hours') }}</label>
                        <input v-model.number="step.sla_hours" type="number" min="1" max="720" :class="inputClassSm" />
                      </div>
                      </div>

                    <div v-if="getStepHint(step).text"
                      class="mt-2 text-xs flex items-center gap-1.5 px-2.5 py-1.5 rounded-md"
                      :class="getStepHint(step).warning
                        ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                        : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'">
                      {{ getStepHint(step).text }}
                    </div>

                    <button @click="removeStep(i)" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Preview -->
            <div v-if="form.steps.length > 0" class="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
              <h4 class="text-sm font-bold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                {{ $t('procurement.workflows.preview_title') }}
              </h4>
              <div class="flex flex-wrap items-center gap-2 text-xs">
                <span class="px-2.5 py-1.5 bg-white dark:bg-slate-800 rounded-lg font-medium text-gray-700 dark:text-slate-200 shadow-sm">
                  📝 {{ $t('procurement.workflows.preview_requester') }}
                </span>
                <template v-for="(step, i) in form.steps" :key="'p' + i">
                  <svg class="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                  <span class="px-2.5 py-1.5 bg-white dark:bg-slate-800 rounded-lg font-medium text-gray-700 dark:text-slate-200 shadow-sm flex items-center gap-1">
                    <span class="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">{{ i + 1 }}</span>
                    {{ getStepHint(step).text.replace(/^[^ ]+ /, '').split(' (')[0] }}
                  </span>
                </template>
                <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                <span class="px-2.5 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg font-semibold text-green-800 dark:text-green-300 shadow-sm">
                  ✅ {{ $t('procurement.workflows.preview_approved') }}
                </span>
              </div>
            </div>

            <p v-if="error" class="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{{ error }}</p>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
            <button @click="closeBuilder" :disabled="saving" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 disabled:opacity-50">
              {{ $t('realty.common.cancel') }}
            </button>
            <button @click="save" :disabled="saving || form.steps.length === 0" class="px-5 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2">
              <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
              {{ saving ? $t('realty.common.saving') : $t('realty.common.save') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify'
import workflowApi from '@/api/approvalWorkflow'
import departmentApi from '@/api/department'
import { unwrapList } from '@/api/crud'

let UID = 1
const newStep = () => ({
  _uid: UID++,
  approver_type: 'requester_dept_manager',
  approver_department_id: '',
  approver_user_id: '',
  approver_email: '',
  approver_name: '',
  approver_title: '',
  sla_hours: 48,
})

export default {
  name: 'ApprovalWorkflows',
  data() {
    return {
      workflows: [],
      departments: [],
      loading: false,
      saving: false,
      showBuilder: false,
      editing: null,
      error: '',
      dragIndex: null,
      form: {
        currency: 'SAR',
        requester_department_id: '',
        min_amount: 0,
        max_amount: '',
        steps: [],
      },
    }
  },
  computed: {
    canManage() {
      if (this.$store.state.auth?.is_admin) return true
      const getter = this.$store.getters['auth/hasPermission']
      return typeof getter === 'function' ? !!getter('manage_approval_rules') : false
    },
    inputClass() {
      return 'w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm'
    },
    inputClassSm() {
      return 'w-full px-2.5 py-1.5 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs'
    },
  },
  async mounted() {
    await Promise.all([this.fetch(), this.loadDepartments()])
  },
  methods: {
    async fetch() {
      this.loading = true
      try {
        const res = await workflowApi.getAll()
        this.workflows = res.data?.data || []
      } catch (e) {
        toast.error(e?.response?.data?.message || 'Error')
      } finally {
        this.loading = false
      }
    },
    async loadDepartments() {
      try {
        const res = await departmentApi.getAll({ per_page: 100 });
        const data = res.data?.data;
        this.departments = data?.items || (Array.isArray(data) ? data : []) || res.data?.items || [];
      } catch (e) {
        console.error('loadDepartments failed:', e?.response?.status, e?.response?.data?.message);
        this.departments = [];
      }
    },
    formatRange(min, max) {
      const fmt = (v) => Number(v || 0).toLocaleString()
      return max === null || max === undefined || max === ''
        ? `≥ ${fmt(min)}`
        : `${fmt(min)} – ${fmt(max)}`
    },
    openCreate() {
      this.editing = null
      this.error = ''
      this.form = {
        currency: 'SAR',
        requester_department_id: '',
        min_amount: 0,
        max_amount: '',
        steps: [newStep()],
      }
      this.showBuilder = true
    },
    openEdit(wf) {
      this.editing = wf
      this.error = ''
      this.form = {
        currency: wf.currency,
        requester_department_id: wf.requester_department_id || '',
        min_amount: wf.min_amount,
        max_amount: wf.max_amount ?? '',
        steps: wf.steps.map((s) => ({
          _uid: UID++,
          approver_type: s.approver_type,
          approver_department_id: s.approver_department_id || '',
          approver_user_id: s.approver_user_id || '',
          approver_email: s.approver_email || '',
          approver_name: s.approver_name || '',
          approver_title: s.approver_title || '',
          sla_hours: s.sla_hours || 48,
        })),
      }
      this.showBuilder = true
    },
    closeBuilder() {
      this.showBuilder = false
      this.editing = null
      this.error = ''
    },
    addStep() {
      this.form.steps.push(newStep())
    },
    removeStep(i) {
      this.form.steps.splice(i, 1)
    },
    onTypeChange(step) {
      if (step.approver_type !== 'specific_dept_manager') step.approver_department_id = ''
      if (step.approver_type !== 'specific_user') step.approver_user_id = ''
      if (step.approver_type !== 'by_email') {
        step.approver_email = ''
        step.approver_name = ''
        step.approver_title = ''
      }
    },
    onDragStart(i, e) {
      this.dragIndex = i
      e.dataTransfer.effectAllowed = 'move'
    },
    onDragOver(i) {
      if (this.dragIndex === null || this.dragIndex === i) return
      const moved = this.form.steps.splice(this.dragIndex, 1)[0]
      this.form.steps.splice(i, 0, moved)
      this.dragIndex = i
    },
    onDragEnd() {
      this.dragIndex = null
    },
    getStepHint(step) {
      const t = (k) => this.$t(k);
      let text = "";
      let warning = false;
      switch (step.approver_type) {
        case "requester_dept_manager":
          text = "👤 " + t("procurement.workflows.hint.requester_manager");
          break;
        case "beneficiary_dept_manager":
          text = "👤 " + t("procurement.workflows.hint.beneficiary_manager");
          break;
        case "ceo":
          text = "👑 " + t("procurement.workflows.hint.ceo_account");
          break;
        case "specific_dept_manager":
          if (!step.approver_department_id) {
            text = "⚠️ " + t("procurement.workflows.hint.pick_dept");
            warning = true;
          } else {
            const d = this.departments.find((x) => x.id == step.approver_department_id);
            if (d) {
              if (!d.manager) {
                text = "⚠️ " + t("procurement.workflows.hint.no_manager") + ": " + d.name;
                warning = true;
              } else {
                text = "👤 " + d.manager.name + " (" + d.name + ")";
              }
            }
          }
          break;
        case "by_email":
          if (!step.approver_email) {
            text = "⚠️ " + t("procurement.workflows.hint.enter_email");
            warning = true;
          } else {
            text = "✉️ " + step.approver_email + (step.approver_name ? " — " + step.approver_name : "");
          }
          break;
      }
      return { text, warning };
    },
    async save() {
      this.error = ''
      this.saving = true
      try {
        const payload = {
          context: {
            currency: this.form.currency,
            requester_department_id: this.form.requester_department_id || null,
            min_amount: this.form.min_amount || 0,
            max_amount: this.form.max_amount === '' ? null : this.form.max_amount,
          },
          steps: this.form.steps.map((s) => ({
            approver_type: s.approver_type,
            approver_department_id: s.approver_department_id || null,
            approver_user_id: s.approver_user_id || null,
            approver_email: s.approver_email || null,
            approver_name: s.approver_name || null,
            approver_title: s.approver_title || null,
            sla_hours: s.sla_hours || 48,
          })),
        }
        if (this.editing) payload.original_key = this.editing.key
        await workflowApi.save(payload)
        toast.success(this.$t('procurement.workflows.saved'))
        this.closeBuilder()
        await this.fetch()
      } catch (e) {
        this.error = e?.response?.data?.message || 'Error'
      } finally {
        this.saving = false
      }
    },
    async confirmDelete(wf) {
      const ok = await this.$swal({
        title: this.$t('procurement.workflows.delete_confirm'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        confirmButtonText: this.$t('common.delete'),
        cancelButtonText: this.$t('realty.common.cancel'),
      })
      if (!ok.isConfirmed) return
      try {
        await workflowApi.remove(wf.key)
        toast.success(this.$t('procurement.workflows.deleted'))
        this.fetch()
      } catch (e) {
        toast.error(e?.response?.data?.message || 'Error')
      }
    },
  },
}
</script>
