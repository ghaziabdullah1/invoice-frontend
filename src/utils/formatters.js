// src/utils/formatters.js
/**
 * تنسيق الأرقام إلى عملة
 * @param {number|string} amount - المبلغ
 * @param {string} [currency='ر.س'] - رمز العملة
 * @param {string} [locale='en-US'] - اللغة المطلوبة
 * @returns {string} المبلغ المنسق مع العملة
 */
export const formatCurrency = (amount, currency = 'ر.س', locale = 'en-US') => {
  if (amount === null || amount === undefined || amount === '') return `0.00 ${currency}`
  const num = parseFloat(amount)
  if (isNaN(num)) return `0.00 ${currency}`
  return num.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' ' + currency
}

/**
 * تنسيق التاريخ الكامل
 * @param {string} dateString - التاريخ بصيغة ISO أو قابلة للتحويل
 * @param {string} [locale='en-US'] - اللغة
 * @returns {string} التاريخ المنسق
 */
export const formatDate = (dateString, locale = 'en-US') => {
  if (!dateString) return 'غير محدد'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'تاريخ غير صالح'
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'تاريخ غير صالح'
  }
}

/**
 * تنسيق التاريخ بصيغة مختصرة (يوم وشهر فقط)
 * @param {string} dateString - التاريخ
 * @param {string} [locale='en-US'] - اللغة
 * @returns {string} التاريخ المختصر
 */
export const formatShortDate = (dateString, locale = 'en-US') => {
  if (!dateString) return 'غير محدد'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'تاريخ غير صالح'
    return date.toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'تاريخ غير صالح'
  }
}

/**
 * تنسيق التاريخ مع الوقت
 * @param {string} dateString - التاريخ
 * @param {string} [locale='en-US'] - اللغة
 * @returns {string} التاريخ مع الوقت
 */
export const formatDateTime = (dateString, locale = 'en-US') => {
  if (!dateString) return 'غير محدد'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'تاريخ غير صالح'
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'تاريخ غير صالح'
  }
}

/**
 * الوقت النسبي (منذ كم)
 * @param {string} dateString - التاريخ
 * @param {string} [locale='ar'] - لغة الرسائل
 * @returns {string} نص زمني نسبي
 */
export const formatTimeAgo = (dateString, locale = 'ar') => {
  if (!dateString) return 'غير محدد'

  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'تاريخ غير صالح'

  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (days > 0) {
    return locale === 'ar' ? `قبل ${days} يوم` : `${days} day${days > 1 ? 's' : ''} ago`
  }
  if (hours > 0) {
    return locale === 'ar' ? `قبل ${hours} ساعة` : `${hours} hour${hours > 1 ? 's' : ''} ago`
  }
  if (minutes > 0) {
    return locale === 'ar' ? `قبل ${minutes} دقيقة` : `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  }
  return locale === 'ar' ? 'الآن' : 'Just now'
}

/**
 * تنسيق الأرقام (بدون عملة)
 * @param {number|string} number - الرقم
 * @param {string} [locale='en-US'] - اللغة
 * @returns {string} الرقم المنسق
 */
export const formatNumber = (number, locale = 'en-US') => {
  if (number === null || number === undefined || number === '') return '0'
  const num = parseFloat(number)
  if (isNaN(num)) return '0'
  return num.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })
}

/**
 * اختصار النصوص الطويلة
 * @param {string} text - النص الأصلي
 * @param {number} [maxLength=50] - الحد الأقصى لعدد الأحرف
 * @param {string} [suffix='...'] - اللاحقة المضافة عند الاختصار
 * @returns {string} النص المختصر
 */
export const truncateText = (text, maxLength = 50, suffix = '...') => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + suffix
}

/**
 * استخراج الأحرف الأولى من اسم (للأفاتار)
 * @param {string} name - الاسم الكامل
 * @param {number} [limit=2] - عدد الأحرف المطلوبة
 * @returns {string} الأحرف الأولى
 */
export const getInitials = (name, limit = 2) => {
  if (!name) return '؟'
  const parts = name.trim().split(/\s+/)
  return parts
    .slice(0, limit)
    .map(part => part[0])
    .join('')
    .toUpperCase()
}

/**
 * الحصول على كلاس الحالة (للألوان)
 * @param {string} status - قيمة الحالة (paid, sent, draft, overdue, active, inactive)
 * @returns {string} كلاسات CSS
 */
export const getStatusClass = (status) => {
  const classes = {
    paid: 'bg-green-100 text-green-800',
    sent: 'bg-blue-100 text-blue-800',
    draft: 'bg-gray-100 text-gray-800',
    overdue: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

/**
 * الحصول على النص المترجم للحالة
 * @param {string} status - قيمة الحالة
 * @param {string} [locale='ar'] - اللغة المطلوبة
 * @returns {string} النص المترجم
 */
export const getStatusText = (status, locale = 'ar') => {
  const texts = {
    ar: {
      paid: 'مدفوعة',
      sent: 'مرسلة',
      draft: 'مسودة',
      overdue: 'متأخرة',
      active: 'نشط',
      inactive: 'غير نشط'
    },
    en: {
      paid: 'Paid',
      sent: 'Sent',
      draft: 'Draft',
      overdue: 'Overdue',
      active: 'Active',
      inactive: 'Inactive'
    }
  }
  return texts[locale]?.[status] || status
}

/**
 * تنسيق رقم الهاتف
 * @param {string} phone - رقم الهاتف
 * @returns {string} الرقم المنسق
 */
export const formatPhone = (phone) => {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 8) {
    return cleaned.replace(/(\d{4})(\d{4})/, '$1 $2')
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
  }
  return phone
}

/**
 * تحويل النص إلى عنوان URL صديق
 * @param {string} text - النص
 * @returns {string} الرابط الصديق
 */
export const slugify = (text) => {
  if (!text) return ''
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '-')
}
