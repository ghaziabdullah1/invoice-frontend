<template>
  <transition name="modal-fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="$emit('close')"
    >
      <div class="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold mb-4">{{ $t('installments.create_plan') }}</h3>
        <form @submit.prevent="submit">
          <!-- عدد الأقساط -->
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">
              {{ $t('installments.number_of_installments') }}
            </label>
            <input
              type="number"
              v-model.number="form.number_of_installments"
              min="2"
              max="60"
              class="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
              @input="suggestRate"
              required
            />
          </div>
          <!-- نسبة الفائدة -->
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">
              {{ $t('installments.interest_rate') }} (%)
            </label>
            <input
              type="number"
              v-model.number="form.interest_rate"
              min="0"
              max="100"
              step="0.5"
              class="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p class="text-xs text-gray-500 mt-1">{{ $t('installments.interest_rate_hint') }}</p>
          </div>
          <!-- تاريخ البدء -->
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">
              {{ $t('installments.start_date') }}
            </label>
            <input
              type="date"
              v-model="form.start_date"
              :min="today"
              class="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <!-- التكرار -->
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">
              {{ $t('installments.frequency') }}
            </label>
            <select
              v-model="form.frequency"
              class="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="monthly">{{ $t('installments.monthly') }}</option>
              <option value="weekly">{{ $t('installments.weekly') }}</option>
            </select>
          </div>
          <!-- ملاحظات -->
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300">
              {{ $t('common.notes') }}
            </label>
            <textarea
              v-model="form.notes"
              rows="2"
              class="w-full border border-gray-300 dark:border-slate-600 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <!-- معاينة الحساب -->
          <div class="bg-blue-50 p-3 rounded-lg mb-4">
            <div class="flex justify-between text-sm">
              <span>{{ $t('installments.original_amount') }}</span>
              <span>{{ formatCurrency(invoiceTotal) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>{{ $t('installments.interest_amount') }}</span>
              <span class="text-orange-600">{{ formatCurrency(previewInterest) }}</span>
            </div>
            <div class="flex justify-between text-sm font-bold border-t pt-2 mt-2">
              <span>{{ $t('installments.total_amount') }}</span>
              <span>{{ formatCurrency(previewTotal) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>{{ $t('installments.per_installment') }}</span>
              <span>{{ formatCurrency(previewPerInstallment) }}</span>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 bg-gray-200 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-300"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {{ submitting ? $t('common.loading') : $t('common.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex';
import { formatCurrency } from '@/utils/formatters';

export default {
  props: {
    show: { type: Boolean, default: false },
    invoiceId: { type: [Number, String], required: true },
    invoiceTotal: { type: [Number, String], required: true },
    submitting: { type: Boolean, default: false },
  },
  emits: ['close', 'created'],
  data() {
    return {
      form: {
        number_of_installments: 3,
        interest_rate: null,
        start_date: new Date().toISOString().split('T')[0],
        frequency: 'monthly',
        notes: '',
      },
    };
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0];
    },
    previewInterest() {
      return (Number(this.invoiceTotal) * (this.form.interest_rate || 0)) / 100;
    },
    previewTotal() {
      return Number(this.invoiceTotal) + this.previewInterest;
    },
    previewPerInstallment() {
      const count = this.form.number_of_installments || 1;
      return this.previewTotal / count;
    },
  },
  watch: {
    show(val) {
      if (val) {
        this.form.start_date = this.today;
        this.suggestRate();
      }
    },
  },
  methods: {
    ...mapActions('installments', ['suggestRate', 'createPlan']),
    formatCurrency,
    async suggestRate() {
      const num = this.form.number_of_installments;
      if (num < 2) return;
      try {
        const rate = await this.suggestRate(num);
        this.form.interest_rate = rate;
      } catch {
        this.form.interest_rate = null;
      }
    },
    async submit() {
      try {
        await this.createPlan({
          invoiceId: this.invoiceId,
          data: this.form,
        });
        this.$emit('created');
        this.$emit('close');
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || this.$t('installments.create_failed'));
      }
    },
  },
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
