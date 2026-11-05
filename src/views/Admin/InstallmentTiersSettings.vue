<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 transition-colors duration-300">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {{ $t('installments.tiers_title') }}
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mb-6">{{ $t('installments.tiers_subtitle') }}</p>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-300"
      >
        <form @submit.prevent="submit" class="flex flex-wrap gap-4 items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('installments.number_of_installments') }}
            </label>
            <input
              type="number"
              v-model.number="form.number_of_installments"
              min="2"
              max="60"
              class="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-32 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ $t('installments.interest_rate') }} (%)
            </label>
            <input
              type="number"
              v-model.number="form.interest_rate"
              min="0"
              max="100"
              step="0.5"
              class="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-32 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>
          <button
            type="submit"
            :disabled="submitting"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition-colors duration-200"
          >
            {{ submitting ? $t('common.loading') : $t('common.save') }}
          </button>
        </form>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto transition-colors duration-300"
      >
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-900/50 transition-colors duration-300">
            <tr>
              <th class="px-4 py-2 text-start text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('installments.number_of_installments') }}
              </th>
              <th class="px-4 py-2 text-start text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ $t('installments.interest_rate') }}
              </th>
              <th
                class="px-4 py-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {{ $t('common.actions') }}
              </th>
            </tr>
          </thead>
          <tbody
            class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300"
          >
            <tr
              v-for="tier in tiers"
              :key="tier.id"
              class="hover:bg-gray-50 dark:bg-slate-900 dark:hover:bg-gray-700/50 transition-colors duration-150"
            >
              <td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                {{ tier.number_of_installments }}
              </td>
              <td class="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                {{ tier.interest_rate }}%
              </td>
              <td class="px-4 py-2 text-center">
                <button
                  @click="remove(tier.id)"
                  class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm transition-colors duration-200"
                >
                  {{ $t('common.delete') }}
                </button>
              </td>
            </tr>
            <tr v-if="!tiers.length">
              <td colspan="3" class="text-center py-4 text-gray-400 dark:text-gray-500">
                {{ $t('installments.no_tiers') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      form: {
        number_of_installments: null,
        interest_rate: null,
      },
    }
  },
  computed: {
    ...mapGetters('installments', ['interestTiers', 'submitting']),
    tiers() {
      return this.interestTiers
    },
  },
  created() {
    this.fetchTiers()
  },
  methods: {
    ...mapActions('installments', ['fetchTiers', 'saveTier', 'deleteTier']),
    async submit() {
      try {
        await this.saveTier(this.form)
        this.$toast?.success(this.$t('installments.tier_saved'))
        this.form = { number_of_installments: null, interest_rate: null }
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || this.$t('installments.tier_save_failed'))
      }
    },
    async remove(id) {
      if (!confirm(this.$t('installments.confirm_delete_tier_message'))) return
      try {
        await this.deleteTier(id)
        this.$toast?.success(this.$t('installments.tier_deleted'))
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || this.$t('installments.tier_delete_failed'))
      }
    },
  },
}
</script>
