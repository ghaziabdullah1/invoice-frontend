import axios from "./axios";
export default {
  createForInvoice(invoiceId, data = {}) { return axios.post(`/admin/invoices/${invoiceId}/payment-links`, data); },
  createForInstallment(invoiceId, installmentNumber) { return axios.post(`/admin/invoices/${invoiceId}/installments/${installmentNumber}/payment-links`); },
  sendLink(linkId, method = "email") { return axios.post(`/admin/payment-links/${linkId}/send`, { method }); },
  getInvoiceLinks(invoiceId) { return axios.get(`/admin/invoices/${invoiceId}/payment-links`); },
  validateLink(token) { return axios.get(`/payment-links/${token}/validate`); },
};
