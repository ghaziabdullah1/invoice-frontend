// ============================================================
// نظام تبديل الوضع الداكن/الفاتح (Dark Mode Toggle)
// ============================================================
// يعتمد على استراتيجية `darkMode: 'class'` المفعّلة أصلاً في
// tailwind.config.js: مجرد إضافة class="dark" على <html> تُفعّل
// كل كلاسات dark: بالمشروع دفعة واحدة، بالإضافة لكل تنسيقات
// ".dark ..." الموجودة أصلاً بملف src/style.css.
//
// initDarkMode() يجب استدعاؤها بأقرب نقطة ممكنة عند إقلاع
// التطبيق (أول سطر باستيراد main.js) لتفادي "وميض" لحظي بالثيم
// الخاطئ عند فتح الصفحة (Flash of Wrong Theme).
// ============================================================

const STORAGE_KEY = 'theme'

function systemPrefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getStoredPreference() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'true') return true
  if (stored === 'false') return false
  return null // لا يوجد اختيار محفوظ بعد من هذا المستخدم
}

export function isDarkMode() {
  return document.documentElement.classList.contains('dark')
}

export function applyDarkMode(enabled) {
  document.documentElement.classList.toggle('dark', enabled)
}

export function setDarkMode(enabled) {
  applyDarkMode(enabled)
  localStorage.setItem(STORAGE_KEY, String(enabled))
}

export function toggleDarkMode() {
  const next = !isDarkMode()
  setDarkMode(next)
  return next
}

export function initDarkMode() {
  const stored = getStoredPreference()
  // إذا المستخدم اختار سابقاً (فعّل/عطّل الزر يدوياً) نحترم اختياره؛
  // غير ذلك نتبع تفضيل نظام التشغيل كقيمة افتراضية معقولة
  // const enabled = stored === null ? systemPrefersDark() : stored

  const enabled = stored === null ? false : stored
  applyDarkMode(enabled)
}

// ✅ تطبيق فوري عند استيراد هذا الملف — قبل أي رسم للواجهة
initDarkMode()
