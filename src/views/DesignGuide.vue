<template>
  <div class="space-y-6">
    <div>
      <h1 class="ui-page-title">دليل التصميم</h1>
      <p class="ui-page-subtitle">المرجع الوحيد لشكل كل عنصر في المشروع. أي صفحة تستخدم هذه الأصناف فقط، وتتبدل ألوانها مع الثيم والوضع الداكن تلقائياً.</p>
    </div>

    <section class="ui-card">
      <div class="ui-card-header"><h2 class="ui-card-title">الأزرار</h2></div>
      <div class="ui-card-body flex flex-wrap items-center gap-3">
        <button class="ui-btn ui-btn-primary">حفظ</button>
        <button class="ui-btn ui-btn-secondary">إلغاء</button>
        <button class="ui-btn ui-btn-danger">حذف</button>
        <button class="ui-btn ui-btn-ghost">رجوع</button>
        <button class="ui-btn ui-btn-primary" disabled>معطّل</button>
        <button class="ui-btn ui-btn-primary ui-btn-sm">صغير</button>
        <button class="ui-icon-btn" title="تعديل">✎</button>
        <button class="ui-icon-btn" title="حذف">✕</button>
      </div>
    </section>

    <section class="ui-card">
      <div class="ui-card-header"><h2 class="ui-card-title">النماذج</h2></div>
      <div class="ui-card-body grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="ui-label">الاسم</label>
          <input class="ui-input" placeholder="اكتب الاسم" />
          <p class="ui-hint">نص مساعد تحت الحقل</p>
        </div>
        <div>
          <label class="ui-label">البريد الإلكتروني</label>
          <input class="ui-input ui-input-error" value="غير صحيح" />
          <p class="ui-error-text">البريد الإلكتروني غير صالح</p>
        </div>
        <div>
          <label class="ui-label">حقل معطّل</label>
          <input class="ui-input" value="لا يمكن تعديله" disabled />
        </div>
        <div>
          <label class="ui-label">قائمة منسدلة</label>
          <select class="ui-input"><option>الكل</option><option>مدفوعة</option><option>غير مدفوعة</option></select>
        </div>
        <div>
          <label class="ui-label">التاريخ</label>
          <input class="ui-input" type="date" />
        </div>
        <div>
          <label class="ui-label">المبلغ</label>
          <input class="ui-input ui-num" type="number" step="0.001" placeholder="0.000" />
        </div>
        <div class="md:col-span-2">
          <label class="ui-label">ملاحظات</label>
          <textarea class="ui-input" rows="3" placeholder="اكتب ملاحظاتك"></textarea>
        </div>
      </div>
    </section>

    <section>
      <div class="ui-filter-bar mb-4">
        <div class="min-w-[14rem] flex-1">
          <label class="ui-label">بحث</label>
          <input class="ui-input" placeholder="رقم الفاتورة أو اسم العميل" />
        </div>
        <div>
          <label class="ui-label">الحالة</label>
          <select class="ui-input"><option>الكل</option><option>مدفوعة</option></select>
        </div>
        <div>
          <label class="ui-label">من</label>
          <input class="ui-input" type="date" />
        </div>
        <div>
          <label class="ui-label">إلى</label>
          <input class="ui-input" type="date" />
        </div>
        <button class="ui-btn ui-btn-primary">تطبيق</button>
        <button class="ui-btn ui-btn-secondary">مسح</button>
      </div>

      <div class="ui-table-wrap">
        <table class="ui-table">
          <thead>
            <tr><th>رقم الفاتورة</th><th>العميل</th><th>المبلغ</th><th>الحالة</th><th>إجراءات</th></tr>
          </thead>
          <tbody>
            <tr v-for="r in rows" :key="r.n">
              <td class="font-mono">{{ r.n }}</td>
              <td>{{ r.c }}</td>
              <td class="ui-num">{{ r.a }}</td>
              <td><span class="ui-badge" :class="badge(r.s)">{{ label(r.s) }}</span></td>
              <td><button class="ui-icon-btn" title="عرض">👁</button><button class="ui-icon-btn" title="حذف">✕</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="ui-card">
      <div class="ui-card-header"><h2 class="ui-card-title">حالة فارغة</h2></div>
      <div class="ui-empty">
        <p class="font-semibold text-gray-700 dark:text-slate-200">لا توجد بيانات</p>
        <p>لم يتم العثور على نتائج مطابقة للفلاتر المحددة</p>
        <button class="ui-btn ui-btn-primary ui-btn-sm mt-2">إضافة جديد</button>
      </div>
    </section>

    <section class="ui-card">
      <div class="ui-card-header"><h2 class="ui-card-title">النافذة</h2></div>
      <div class="ui-card-body"><button class="ui-btn ui-btn-primary" @click="showModal = true">فتح نافذة</button></div>
    </section>

    <div v-if="showModal" class="ui-modal-overlay" @click.self="showModal = false">
      <div class="ui-modal">
        <div class="ui-modal-header">
          <h3 class="ui-modal-title">إضافة عميل</h3>
          <button class="ui-icon-btn" @click="showModal = false">✕</button>
        </div>
        <div class="ui-modal-body space-y-4">
          <div><label class="ui-label">الاسم</label><input class="ui-input" /></div>
          <div><label class="ui-label">الهاتف</label><input class="ui-input" /></div>
        </div>
        <div class="ui-modal-footer">
          <button class="ui-btn ui-btn-secondary" @click="showModal = false">إلغاء</button>
          <button class="ui-btn ui-btn-primary" @click="showModal = false">حفظ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DesignGuide',
  data() {
    return {
      showModal: false,
      rows: [
        { n: 'INV-2611-1001', c: 'شركة النور', a: '1,250.500', s: 'paid' },
        { n: 'INV-2611-1002', c: 'مؤسسة الأفق', a: '830.000', s: 'sent' },
        { n: 'INV-2611-1003', c: 'عميل تجريبي', a: '2,400.250', s: 'overdue' },
        { n: 'INV-2611-1004', c: 'شركة الرمال', a: '99.000', s: 'draft' },
      ],
    }
  },
  methods: {
    badge(s) {
      return { paid: 'ui-badge-success', sent: 'ui-badge-info', overdue: 'ui-badge-danger', draft: 'ui-badge-neutral', partially_paid: 'ui-badge-warning' }[s] || 'ui-badge-neutral'
    },
    label(s) {
      return { paid: 'مدفوعة', sent: 'مرسلة', overdue: 'متأخرة', draft: 'مسودة', partially_paid: 'مدفوعة جزئياً' }[s] || s
    },
  },
}
</script>
