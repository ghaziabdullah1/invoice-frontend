import { defineAsyncComponent } from 'vue'

// سجل أقسام اللوحة الرئيسية: كل موديول يضيف قسمه هنا فيظهر للمستخدم حسب صلاحيته.
// لإضافة موديول جديد: أنشئ مكوّن القسم ثم أضف عنصراً هنا بصلاحيته.
export const DASHBOARD_MODULES = [
  {
    key: 'properties',
    permission: 'view_properties',
    labelKey: 'nav.properties',
    component: defineAsyncComponent(() => import('@/components/dashboard/PropertiesSummary.vue')),
  },
]
