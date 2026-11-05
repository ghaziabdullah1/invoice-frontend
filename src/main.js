import './style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import i18n from './plugins/i18n'
import { startDynamicTheme } from './utils/dynamicTheme'

// Toastify
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// Font Awesome (Vue 3)
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons'
import {
  faUser,
  faFileInvoice,
  faUsers,
  faChartBar,
  faCog,
  faSignOutAlt,
  faHome,
  faPlus,
  faEdit,
  faTrash,
  faCheckCircle,
  faMoneyBillWave,
  faCircle,
  faChevronDown,
  faUserPlus,
  faFolder,
  faEye,
  faDownload,
  faPrint,
  faSearch,
  faFilter,
  faCalendar,
  faClock,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faBuilding,
  faIdCard,
  faSave,
  faTimes,
  faSpinner,
  faArrowLeft,
  faPaperPlane,
  faShareAlt,
  faInbox,
  faSort,
  faSortUp,
  faSortDown,
  faTimesCircle,
  faExclamationCircle,
  faExclamationTriangle,
  faInfoCircle,
  faCheckCircle as faCheckCircleSolid,
  faSort as faSortSolid
} from '@fortawesome/free-solid-svg-icons'

// إضافة جميع الأيقونات
library.add(
  faUser,
  faRightToBracket,
  faFileInvoice,
  faUsers,
  faChartBar,
  faCog,
  faSignOutAlt,
  faHome,
  faPlus,
  faEdit,
  faTrash,
  faCheckCircle,
  faMoneyBillWave,
  faCircle,
  faChevronDown,
  faUserPlus,
  faFolder,
  faEye,
  faDownload,
  faPrint,
  faSearch,
  faFilter,
  faCalendar,
  faClock,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faBuilding,
  faIdCard,
  faSave,
  faTimes,
  faSpinner,
  faArrowLeft,
  faPaperPlane,
  faShareAlt,
  faInbox,
  faSort,
  faSortUp,
  faSortDown,
  faTimesCircle,
  faExclamationCircle,
  faExclamationTriangle,
  faInfoCircle,
  faCheckCircleSolid,
  faSortSolid,
)

// استيراد المكونات المشتركة
import BaseButton from './components/shared/BaseButton.vue'
import BaseCard from './components/shared/BaseCard.vue'
import BaseBadge from './components/shared/BaseBadge.vue'
import BaseInput from './components/shared/BaseInput.vue'
import BaseTable from './components/shared/BaseTable.vue'
import BaseModal from './components/shared/BaseModal.vue'
import BaseAlert from './components/shared/BaseAlert.vue'
import LoadingSpinner from './components/shared/LoadingSpinner.vue'
import PageHeader from './components/shared/PageHeader.vue'
import StatusBadge from './components/shared/StatusBadge.vue'


// إنشاء التطبيق
const app = createApp(App)

// تسجيل FontAwesome كمكوّن عام
app.component('font-awesome-icon', FontAwesomeIcon)

// تسجيل المكونات المشتركة كعالمية
app.component('BaseButton', BaseButton)
app.component('BaseCard', BaseCard)
app.component('BaseBadge', BaseBadge)
app.component('BaseInput', BaseInput)
app.component('BaseTable', BaseTable)
app.component('BaseModal', BaseModal)
app.component('BaseAlert', BaseAlert)
app.component('LoadingSpinner', LoadingSpinner)
app.component('PageHeader', PageHeader)
app.component('StatusBadge', StatusBadge)

import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

app.use(VueSweetalert2);

// Vuex + Router + i18n
app.use(store)
app.use(router)
app.use(i18n)

// Toastify
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'colored',
  rtl: true,
  transition: 'slide',
})

// دالة مساعدة للتحقق من الصلاحيات
app.config.globalProperties.$hasPermission = function (permission) {
  const user = this.$store.state.auth.user
  if (!user) return false

  // Admin لديه كل الصلاحيات
  if (user.roles?.some(role => role.name === 'admin')) {
    return true
  }

  return user.permissions?.includes(permission) || false
}

// هل المستخدم Admin؟
app.config.globalProperties.$isAdmin = function () {
  const user = this.$store.state.auth.user
  return user?.roles?.some(role => role.name === 'admin') || false
}

// دوال مساعدة للتنسيق
app.config.globalProperties.$formatCurrency = function (amount) {
  if (!amount && amount !== 0) return this.$t('common.notAvailable')
  try {
    const formatter = new Intl.NumberFormat(this.$i18n.locale === 'ar' ? 'en-US' : 'en-US', {
      style: 'currency',
      currency: this.$i18n.locale === 'ar' ? 'SAR' : 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return formatter.format(amount)
  } catch (error) {
    console.error('Error formatting currency:', error)
    return amount
  }
}

app.config.globalProperties.$formatDate = function (dateString) {
  if (!dateString) return this.$t('common.notAvailable')
  try {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }
    return new Date(dateString).toLocaleDateString(
      this.$i18n.locale === 'ar' ? 'en-US' : 'en-US',
      options,
    )
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

// ربط toast عالميًا
app.config.globalProperties.$toast = toast

// تهيئة السمة (الوضع الداكن)
store.dispatch('initTheme')

// تشغيل التطبيق
app.mount('#app')

// تشغيل تدوير ألوان العلامة التجارية التلقائي (كل 15 ثانية)
startDynamicTheme()

console.log('✅ تم تهيئة التطبيق بنجاح')
