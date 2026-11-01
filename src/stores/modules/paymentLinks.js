import axios from "@/api/axios";
import NProgress from "nprogress";
import i18n from "@/plugins/i18n";

export default {
  namespaced: true,
  state: () => ({ links: [], currentLink: null, loading: false, error: null }),
  getters: { links: s => s.links, currentLink: s => s.currentLink, loading: s => s.loading, error: s => s.error },
  mutations: {
    SET_LINKS(s, links) { s.links = links; },
    SET_CURRENT_LINK(s, link) { s.currentLink = link; },
    SET_LOADING(s, v) { s.loading = v; },
    SET_ERROR(s, e) { s.error = e; },
    CLEAR_ERROR(s) { s.error = null; },
    ADD_LINK(s, link) { s.links.unshift(link); },
  },
  actions: {
    async createForInvoice({ commit }, { invoiceId, data }) {
      commit("SET_LOADING", true); commit("CLEAR_ERROR"); NProgress.start();
      try {
        const res = await axios.post(`/admin/invoices/${invoiceId}/payment-links`, data);
        commit("ADD_LINK", res.data.data); return res.data.data;
      } catch (e) {
        const msg = e.response?.data?.message || i18n.global.t("payment_links.create_failed");
        commit("SET_ERROR", msg); throw new Error(msg);
      } finally { NProgress.done(); commit("SET_LOADING", false); }
    },
    async createForInstallment({ commit }, { invoiceId, installmentNumber }) {
      commit("SET_LOADING", true); commit("CLEAR_ERROR"); NProgress.start();
      try {
        const res = await axios.post(`/admin/invoices/${invoiceId}/installments/${installmentNumber}/payment-links`);
        commit("ADD_LINK", res.data.data); return res.data.data;
      } catch (e) {
        const msg = e.response?.data?.message || i18n.global.t("payment_links.create_failed");
        commit("SET_ERROR", msg); throw new Error(msg);
      } finally { NProgress.done(); commit("SET_LOADING", false); }
    },
    async fetchInvoiceLinks({ commit }, invoiceId) {
      commit("SET_LOADING", true); commit("CLEAR_ERROR");
      try {
        const res = await axios.get(`/admin/invoices/${invoiceId}/payment-links`);
        commit("SET_LINKS", res.data.data || []);
      } catch (e) {
        commit("SET_ERROR", e.response?.data?.message || i18n.global.t("payment_links.create_failed"));
      } finally { commit("SET_LOADING", false); }
    },
    async sendLink({ commit }, { linkId, method = "email" }) {
      commit("CLEAR_ERROR");
      try {
        const res = await axios.post(`/admin/payment-links/${linkId}/send`, { method });
        if (!res.data.status) throw new Error(res.data.message || "send failed");
        const d = res.data.data;
        if (d && d.whatsapp_url) window.open(d.whatsapp_url, "_blank");
        return res.data;
      } catch (e) {
        const msg = e.response?.data?.message || e.message || i18n.global.t("payment_links.create_failed");
        commit("SET_ERROR", msg); throw new Error(msg);
      }
    },
    clearError({ commit }) { commit("CLEAR_ERROR"); },
  },
};
