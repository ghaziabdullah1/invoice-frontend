// utils/helpers.js

// تنسيق العملة
export const formatCurrency = (amount) => {
  if (!amount) return '0.00 ر.س'
  const num = parseFloat(amount)
  if (isNaN(num)) return '0.00 ر.س'
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' ر.س'
}

// تنسيق التاريخ
export const formatDate = (dateString) => {
  if (!dateString) return 'غير محدد'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (error) {
    return 'تاريخ غير صالح'
  }
}

// الحصول على الأحرف الأولى من الاسم
export const getInitials = (name) => {
  if (!name) return '??'
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// الحصول على نص الحالة
export const getStatusText = (status) => {
  const statusMap = {
    draft: 'مسودة',
    sent: 'مرسلة',
    paid: 'مدفوعة',
    overdue: 'متأخرة',
  }
  return statusMap[status] || status
}

// الحصول على كلاسات الحالة
export const getStatusClasses = (status) => {
  const baseClasses = 'inline-flex px-3 py-1 text-xs font-semibold rounded-full'
  const statusClasses = {
    draft: 'bg-yellow-100 text-yellow-800',
    sent: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
  }
  return `${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`
}

// حساب الأيام المتبقية
export const getDaysRemaining = (dueDate) => {
  if (!dueDate) return 'غير محدد'
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'منتهية'
  if (diffDays === 0) return 'اليوم'
  if (diffDays === 1) return 'غداً'
  return `${diffDays} يوم`
}

export const getDaysRemainingClass = (dueDate) => {
  if (!dueDate) return 'text-gray-600'
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'text-red-600 font-semibold'
  if (diffDays <= 3) return 'text-yellow-600 font-semibold'
  return 'text-green-600 font-semibold'
}

// التحقق من الصلاحيات
export const hasPermission = (permissions, permission, isAdmin = false) => {
  if (isAdmin) return true
  return permissions && permissions.includes(permission)
}

// التحقق من صحة البريد الإلكتروني
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// التحقق من صحة كلمة المرور
export const validatePassword = (password) => {
  return password && password.length >= 8
}

// تقسيم المصفوفة إلى صفحات
export const paginateArray = (array, pageSize, currentPage) => {
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  return array.slice(startIndex, endIndex)
}

// فلترة المصفوفة
export const filterArray = (array, searchQuery, searchFields = []) => {
  if (!searchQuery.trim()) return array

  const search = searchQuery.toLowerCase()
  return array.filter(item => {
    return searchFields.some(field => {
      const value = item[field]
      return value && value.toString().toLowerCase().includes(search)
    })
  })
}
