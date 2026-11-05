<template>
  <transition name="modal-fade">
    <div v-if="show" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="close">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-white">{{ $t("installments.plan_options") }}</h3>
            <button @click="close" class="text-white/80 hover:text-white"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 gap-4 mb-6">
            <button @click="selectOption(false)" :class="['p-4 rounded-xl border-2 transition-all', !enabled ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400']">
              <span class="font-semibold">{{ $t("installments.one_time_payment") }}</span>
            </button>
            <button @click="selectOption(true)" :class="['p-4 rounded-xl border-2 transition-all', enabled ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400']">
              <span class="font-semibold">{{ $t("installments.installment_plan") }}</span>
            </button>
          </div>
          <div v-if="enabled" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">{{ $t("installments.number_of_installments") }}</label>
              <input v-model.number="form.number_of_installments" type="range" min="2" max="24" class="w-full"/>
              <span class="text-blue-600 font-bold">{{ form.number_of_installments }}</span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">{{ $t("installments.interest_rate") }} (%)</label>
              <input v-model.number="form.interest_rate" type="number" min="0" max="100" step="0.5" class="w-full px-3 py-2 border rounded-lg"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">{{ $t("installments.start_date") }}</label>
              <input v-model="form.start_date" type="date" :min="today" class="w-full px-3 py-2 border rounded-lg"/>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">{{ $t("installments.frequency") }}</label>
              <select v-model="form.frequency" class="w-full px-3 py-2 border rounded-lg">
                <option value="monthly">{{ $t("installments.monthly") }}</option>
                <option value="weekly">{{ $t("installments.weekly") }}</option>
              </select>
            </div>
            <div class="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div class="flex justify-between text-sm"><span>{{ $t("installments.original_amount") }}</span><span>{{ formatCurrency(invoiceTotal) }}</span></div>
              <div class="flex justify-between text-sm"><span>{{ $t("installments.interest_amount") }}</span><span class="text-orange-600">{{ formatCurrency(previewInterest) }}</span></div>
              <div class="flex justify-between font-bold border-t pt-2 mt-2"><span>{{ $t("installments.total_amount") }}</span><span>{{ formatCurrency(previewTotal) }}</span></div>
              <div class="flex justify-between text-sm mt-1"><span>{{ $t("installments.per_installment") }}</span><span class="font-bold">{{ formatCurrency(previewPerInstallment) }}</span></div>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 dark:bg-slate-900 flex justify-end gap-3">
          <button @click="close" class="px-4 py-2 text-gray-700 dark:text-slate-300 hover:bg-gray-200 rounded-lg">{{ $t("common.cancel") }}</button>
          <button @click="confirm" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{{ enabled ? $t("installments.create_plan") : $t("common.continue") }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { formatCurrency } from "@/utils/formatters";
export default {
  name: "InstallmentPlanModal",
  props: { show: Boolean, invoiceTotal: Number },
  emits: ["close", "confirm"],
  data() {
    return {
      enabled: false,
      form: { number_of_installments: 3, interest_rate: 0, start_date: new Date().toISOString().split("T")[0], frequency: "monthly", notes: "" },
    };
  },
  computed: {
    today() { return new Date().toISOString().split("T")[0]; },
    previewInterest() { return (this.invoiceTotal * (this.form.interest_rate || 0)) / 100; },
    previewTotal() { return this.invoiceTotal + this.previewInterest; },
    previewPerInstallment() { return this.previewTotal / (this.form.number_of_installments || 1); },
  },
  methods: {
    formatCurrency,
    selectOption(enabled) { this.enabled = enabled; },
    close() { this.$emit("close"); },
    confirm() { this.$emit("confirm", this.enabled ? { enabled: true, ...this.form } : { enabled: false }); },
  },
};
</script>
