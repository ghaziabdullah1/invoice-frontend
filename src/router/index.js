import { createRouter, createWebHistory } from 'vue-router'
import store from '@/stores'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const routes = [
  // ── Redirect ──────────────────────────────────────────────
  { path: '/', redirect: '/dashboard' },
  { path: '/pay/:token', name: 'PublicPay', component: () => import('@/views/PublicPay.vue') },

  // ── Guest Pages ───────────────────────────────────────────
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Auth/Login.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/login-otp',
    name: 'LoginOtp',
    component: () => import('@/views/Auth/LoginOtp.vue'),
    meta: { requiresGuest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Auth/Register.vue'),
    meta: { requiresGuest: true },
  },

  // ── Protected Pages (داخل DefaultLayout) ──────────────────
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashboardPage.vue'),
      },
      // AI Drafts
      {
        path: 'ai-drafts',
        name: 'AiDrafts',
        component: () => import('@/views/AiDrafts/AiDraftsIndex.vue'),
        meta: { permission: 'view_ai_drafts' },
      },
      // Invoices
      {
        path: 'invoices',
        name: 'Invoices',
        component: () => import('@/views/invoices/InvoicesIndex.vue'),
        meta: { permission: 'view_invoices' },
      },
      {
        path: 'invoices/create',
        name: 'CreateInvoice',
        component: () => import('@/views/invoices/CreateInvoice.vue'),
        meta: { permission: 'create_invoice' },
      },
      {
        path: 'invoices/:id',
        name: 'InvoiceDetails',
        component: () => import('@/views/invoices/InvoiceDetails.vue'),
        meta: { permission: 'view_invoices' },
      },
      {
        path: 'privacy',
        name: 'PrivacyPolicy',
        component: () => import('@/views/legal/PrivacyPolicy.vue'),
        meta: { title: 'privacy.title' },
      },
      {
        path: 'terms',
        name: 'TermsOfService',
        component: () => import('@/views/legal/TermsOfService.vue'),
        meta: { title: 'terms.title' },
      },
      {
        path: '/support/my-tickets',
        name: 'MySupportTickets',
        component: () => import('@/views/support/MyTickets.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'support',
        name: 'ContactSupport',
        component: () => import('@/views/support/ContactSupport.vue'),
        meta: { title: 'support.title' },
      },
      {
        path: '/support/tickets',
        name: 'SupportTicketList',
        component: () => import('@/views/support/SupportTicketList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/support/tickets/:id',
        name: 'SupportTicketDetails',
        component: () => import('@/views/support/SupportTicketDetails.vue'),
        // meta: { requiresAuth: true } // إذا كنت في لوحة الأدمن
      },
      {
        path: 'invoices/:id/edit',
        name: 'EditInvoice',
        component: () => import('@/views/invoices/EditInvoice.vue'),
        meta: { permission: 'edit_invoice' },
      },
      // Recurring Invoices
      {
        path: 'recurring-invoices',
        name: 'RecurringInvoices',
        component: () => import('@/views/invoices/RecurringInvoicesIndex.vue'),
        meta: { permission: 'view_invoices' },
      },
      {
        path: 'recurring-invoices/create',
        name: 'CreateRecurringInvoice',
        component: () => import('@/views/invoices/CreateRecurringInvoice.vue'),
        meta: { permission: 'create_invoice' },
      },
      // Clients
      {
        path: 'clients',
        name: 'Clients',
        component: () => import('@/views/Clients/ClientsIndex.vue'),
        meta: { permission: 'view_clients' },
      },
      {
        path: 'clients/create',
        name: 'CreateClient',
        component: () => import('@/views/Clients/CreateClient.vue'),
        meta: { permission: 'create_client' },
      },
      {
        path: 'clients/:id',
        name: 'ClientDetails',
        component: () => import('@/views/Clients/ClientDetails.vue'),
        meta: { permission: 'view_clients' },
      },
      {
        path: 'clients/:id/statement',
        name: 'ClientStatement',
        component: () => import('@/views/Clients/ClientStatement.vue'),
      },
      {
        path: 'design-guide',
        name: 'DesignGuide',
        component: () => import('@/views/DesignGuide.vue'),
      },
      {
        path: 'clients/:id/edit',
        name: 'EditClient',
        component: () => import('@/views/Clients/EditClient.vue'),
        meta: { permission: 'edit_client' },
      },
      // Property Management
      {
        path: 'properties',
        name: 'Properties',
        component: () => import('@/views/Properties/PropertiesIndex.vue'),
        meta: { permission: 'view_properties' },
      },
      {
        path: 'floors',
        name: 'Floors',
        component: () => import('@/views/Floors/FloorsIndex.vue'),
        meta: { permission: 'view_floors' },
      },
      {
        path: 'units',
        name: 'Units',
        component: () => import('@/views/Units/UnitsIndex.vue'),
        meta: { permission: 'view_units' },
      },
      {
        path: 'tenants',
        name: 'Tenants',
        component: () => import('@/views/Tenants/TenantsIndex.vue'),
        meta: { permission: 'view_tenants' },
      },
      {
        path: 'contracts',
        name: 'Contracts',
        component: () => import('@/views/Contracts/ContractsIndex.vue'),
        meta: { permission: 'view_contracts' },
      },
      // Reports
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/Reports/ReportsIndex.vue'),
        meta: { permission: 'view_reports' },
      },
      {
        path: 'reports/realty',
        name: 'RealtyReports',
        component: () => import('@/views/Reports/RealtyReportsIndex.vue'),
        meta: { permission: 'view_reports' },
      },
      // Profile
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
      },
      // Activity
      {
        path: 'activitylog',
        name: 'ActivityLog',
        component: () => import('@/views/ActivityLog.vue'),
        meta: { requiresAdmin: true },
      },
      // Admin
      { path: 'admin', redirect: '/admin/users' },
      {
        path: 'admin/users',
        name: 'AdminUsers',
        component: () => import('@/views/Admin/Users.vue'),
        meta: { requiresAdmin: true, permission: 'administration' },
      },
      {
        path: 'admin/groups',
        name: 'AdminGroups',
        component: () => import('@/views/Admin/Groups.vue'),
        meta: { requiresAdmin: true, permission: 'administration' },
      },
      {
        path: 'admin/permissions',
        name: 'AdminPermissions',
        component: () => import('@/views/Admin/Permissions.vue'),
        meta: { requiresAdmin: true, permission: 'administration' },
      },
      {
        path: 'admin/assign-permissions',
        name: 'AssignPermissions',
        component: () => import('@/views/Admin/AssignPermissions.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: 'admin/otp',
        name: 'OTP',
        component: () => import('@/views/Admin/OTP.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: 'admin/otp-logs',
        name: 'OtpLogs',
        component: () => import('@/views/Admin/OtpLogs.vue'),
        meta: { permission: 'view_otp_logs' },
      },
      {
        path: 'admin/installment-tiers',
        name: 'InstallmentTiersSettings',
        component: () => import('@/views/Admin/InstallmentTiersSettings.vue'),
        meta: {
          requiresAuth: true,
          permission: 'manage_settings'
        }
      },
      {
        path: 'admin/branches',
        name: 'AdminBranches',
        component: () => import('@/views/Admin/BranchesManagement.vue'),
        meta: { requiresAdmin: true, permission: 'administration' },
      },
    ],
  },

  // ── 404 ───────────────────────────────────────────────────
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/Auth/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition ?? { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)
  const requiresGuest = to.matched.some((r) => r.meta.requiresGuest)
  const requiresAdmin = to.meta.requiresAdmin
  const permission = to.meta.permission

  if (requiresAuth) {
    if (!token) {
      return next({ name: 'Login', query: { redirect: to.fullPath } })
    }

    try {
      const ok = await store.dispatch('auth/checkAuth')

      if (!ok) {
        store.commit('auth/CLEAR_AUTH')
        localStorage.removeItem('token')
        return next({ name: 'Login' })
      }

      if (permission && !store.getters['auth/hasPermission'](permission)) {
        return next({ name: 'Dashboard' })
      }

      if (requiresAdmin && !store.getters['auth/isAdmin']) {
        return next({ name: 'Dashboard' })
      }

      return next()
    } catch {
      store.commit('auth/CLEAR_AUTH')
      localStorage.removeItem('token')
      return next({ name: 'Login' })
    }
  }

  if (requiresGuest && token) {
    return next({ name: 'Dashboard' })
  }

  next()
})

export default router
