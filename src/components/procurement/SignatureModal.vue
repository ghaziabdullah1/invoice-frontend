<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="!loading && $emit('close')"
    >
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <h3 class="text-lg font-bold text-gray-900 dark:text-slate-100">
            {{ action === 'reject'
              ? $t('procurement.signature.reject_title')
              : $t('procurement.signature.approve_title') }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-slate-400 mt-1">
            {{ action === 'reject'
              ? $t('procurement.signature.reject_hint')
              : $t('procurement.signature.approve_hint') }}
          </p>
        </div>

        <div class="p-6">
          <div
            class="rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 overflow-hidden"
            style="height: 200px;"
          >
            <canvas
              ref="canvas"
              class="w-full h-full touch-none cursor-crosshair block"
              @mousedown="startDrawing"
              @mousemove="draw"
              @mouseup="stopDrawing"
              @mouseleave="stopDrawing"
              @touchstart.prevent="startDrawing"
              @touchmove.prevent="draw"
              @touchend.prevent="stopDrawing"
            ></canvas>
          </div>

          <div class="flex items-center justify-between mt-2">
            <p class="text-xs text-gray-500 dark:text-slate-400">
              {{ $t('procurement.signature.draw_hint') }}
            </p>
            <button
              type="button"
              class="text-xs text-red-600 hover:underline"
              @click="clearCanvas"
            >
              {{ $t('procurement.signature.clear') }}
            </button>
          </div>

          <div v-if="action === 'reject'" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
              {{ $t('procurement.reason.label') }} <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="reason"
              rows="3"
              :placeholder="$t('procurement.reason.placeholder')"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/30 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100"
            ></textarea>
          </div>

          <p v-if="error" class="text-xs text-red-600 mt-3">{{ error }}</p>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
          <button
            type="button"
            :disabled="loading"
            class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
            @click="$emit('close')"
          >
            {{ $t('realty.common.cancel') }}
          </button>
          <button
            type="button"
            :disabled="loading"
            class="px-4 py-2 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
            :class="action === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
            @click="submit"
          >
            <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ loading ? '...' : (action === 'reject'
              ? $t('procurement.signature.reject_btn')
              : $t('procurement.signature.approve_btn')) }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  name: 'SignatureModal',
  props: {
    show: { type: Boolean, default: false },
    action: { type: String, default: 'approve' },
    loading: { type: Boolean, default: false },
  },
  emits: ['close', 'submit'],
  data() {
    return {
      drawing: false,
      hasDrawn: false,
      lastPoint: null,
      reason: '',
      error: '',
    }
  },
  watch: {
    show(value) {
      if (value) {
        this.reason = ''
        this.error = ''
        this.hasDrawn = false
        this.$nextTick(() => this.initCanvas())
      }
    },
  },
  methods: {
    initCanvas() {
      const canvas = this.$refs.canvas
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.max(300, Math.floor(rect.width))
      canvas.height = Math.max(150, Math.floor(rect.height))
      const ctx = canvas.getContext('2d')
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = '#1f2937'
    },
    getPoint(e) {
      const canvas = this.$refs.canvas
      const rect = canvas.getBoundingClientRect()
      const ev = e.touches ? e.touches[0] : e
      return {
        x: ev.clientX - rect.left,
        y: ev.clientY - rect.top,
      }
    },
    startDrawing(e) {
      this.drawing = true
      this.lastPoint = this.getPoint(e)
    },
    draw(e) {
      if (!this.drawing) return
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')
      const point = this.getPoint(e)
      ctx.beginPath()
      ctx.moveTo(this.lastPoint.x, this.lastPoint.y)
      ctx.lineTo(point.x, point.y)
      ctx.stroke()
      this.lastPoint = point
      this.hasDrawn = true
    },
    stopDrawing() {
      this.drawing = false
    },
    clearCanvas() {
      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.hasDrawn = false
    },
    submit() {
      this.error = ''
      if (!this.hasDrawn) {
        this.error = this.$t('procurement.signature.signature_required')
        return
      }
      if (this.action === 'reject' && !this.reason.trim()) {
        this.error = this.$t('procurement.reason.required')
        return
      }
      const canvas = this.$refs.canvas
      const dataUrl = canvas.toDataURL('image/png')
      this.$emit('submit', {
        signature: dataUrl,
        reason: this.action === 'reject' ? this.reason.trim() : null,
      })
    },
  },
}
</script>
