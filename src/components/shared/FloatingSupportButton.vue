<template>
  <router-link
    v-if="visible"
    to="/support/my-tickets"
    class="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center hover:scale-105 transition-transform"
    :title="$t('support.admin')"
  >
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
    <span v-if="unread > 0" class="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
      {{ unread > 9 ? '9+' : unread }}
    </span>
  </router-link>
</template>

<script>
import axios from '@/api/axios'
import { listenUser } from '@/utils/supportRealtime'

export default {
  name: 'FloatingSupportButton',
  data() {
    return { unread: 0, unlisten: null }
  },
  computed: {
    onChatPage() {
      return this.$route.path.startsWith('/support/my-tickets')
    },
    visible() {
      return !this.onChatPage
    },
  },
  watch: {
    onChatPage(v) {
      if (v) this.unread = 0
      else this.loadUnread()
    },
  },
  mounted() {
    let id = null
    try { id = JSON.parse(localStorage.getItem('user') || 'null')?.id || null } catch (e) { id = null }
    if (!id) return
    this.unlisten = listenUser(id, { onMessage: this.onMessage })
    this.loadUnread()
  },
  beforeUnmount() {
    if (this.unlisten) this.unlisten()
  },
  methods: {
    async loadUnread() {
      try {
        const { data } = await axios.get('/support/my-tickets/unread-count')
        this.unread = data.data.count || 0
      } catch (e) {
        // العدّاد اللحظي يبقى يعمل حتى لو فشل هذا الطلب
      }
    },
    onMessage(msg) {
      if (msg.is_internal || !msg.is_admin_reply || this.onChatPage) return
      this.unread++
    },
  },
}
</script>
