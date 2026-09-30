import axios from 'axios'

const state = {
  privacyData: {
    ar: {},
    en: {},
  },

  termsData: {
    ar: {},
    en: {},
  },

  loading: false,

  error: null,
}

const getters = {
  privacyData: (state) => state.privacyData,

  termsData: (state) => state.termsData,

  loading: (state) => state.loading,

  error: (state) => state.error,
}

// ---------- Fallback data (Arabic) ----------

const privacyFallbackAr = {
  last_updated: '2024-01-15',

  introduction:
    'نحن نلتزم بحماية خصوصيتك وضمان أمان بياناتك الشخصية. توضح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك.',

  sections: [
    {
      title: 'المعلومات التي نجمعها',

      content: [
        'نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند استخدامك لخدماتنا، مثل اسمك وبريدك الإلكتروني ومعلومات الشركة.',

        'كما نقوم بجمع معلومات تلقائية مثل عنوان IP ونوع المتصفح ونظام التشغيل لتحسين تجربتك.',
      ],

      items: [
        'معلومات الحساب (الاسم، البريد الإلكتروني، رقم الهاتف)',
        'معلومات الشركة (اسم الشركة، السجل التجاري)',
        'بيانات الفواتير والمدفوعات',
        'سجل النشاط والاستخدام',
      ],
    },

    {
      title: 'كيفية استخدام المعلومات',

      content: [
        'نستخدم معلوماتك لتقديم خدماتنا وتحسينها، ومعالجة الفواتير والمدفوعات، والتواصل معك بشأن حسابك.',

        'لن نقوم ببيع أو مشاركة بياناتك الشخصية مع أطراف ثالثة لأغراض تسويقية.',
      ],
    },

    {
      title: 'حماية البيانات',

      content: [
        'نستخدم تقنيات تشفير متقدمة (SSL/TLS) لحماية بياناتك أثناء النقل والتخزين.',

        'نطبق إجراءات أمنية صارمة لمنع الوصول غير المصرح به إلى بياناتك.',
      ],

      items: [
        'تشفير البيانات أثناء النقل والتخزين',
        'مصادقة ثنائية (2FA) للوصول الآمن',
        'نسخ احتياطي منتظم للبيانات',
        'مراقبة أمنية مستمرة للنظام',
      ],
    },

    {
      title: 'حقوقك',

      content: [
        'لديك الحق في الوصول إلى بياناتك الشخصية وتصحيحها أو حذفها.',

        'يمكنك طلب نسخة من بياناتك في أي وقت.',

        'لديك الحق في الاعتراض على معالجة بياناتك لأغراض تسويقية.',
      ],
    },
  ],
}

// ---------- Fallback data (English) ----------

const privacyFallbackEn = {
  last_updated: '2024-01-15',

  introduction:
    'We are committed to protecting your privacy and ensuring the security of your personal data. This policy explains how we collect, use, and protect your information.',

  sections: [
    {
      title: 'Information We Collect',

      content: [
        'We collect information you provide directly when using our services, such as your name, email, and company information.',

        'We also collect automatic information such as your IP address, browser type, and operating system to improve your experience.',
      ],

      items: [
        'Account information (name, email, phone number)',
        'Company information (company name, commercial registration)',
        'Billing and payment data',
        'Activity and usage logs',
      ],
    },

    {
      title: 'How We Use Information',

      content: [
        'We use your information to provide and improve our services, process invoices and payments, and communicate with you about your account.',

        'We do not sell or share your personal data with third parties for marketing purposes.',
      ],
    },

    {
      title: 'Data Protection',

      content: [
        'We use advanced encryption technologies (SSL/TLS) to protect your data during transfer and storage.',

        'We apply strict security measures to prevent unauthorized access to your data.',
      ],

      items: [
        'Data encryption in transit and at rest',
        'Two-factor authentication (2FA) for secure access',
        'Regular data backups',
        'Continuous security monitoring of the system',
      ],
    },

    {
      title: 'Your Rights',

      content: [
        'You have the right to access, correct, or delete your personal data.',

        'You may request a copy of your data at any time.',

        'You have the right to object to the processing of your data for marketing purposes.',
      ],
    },
  ],
}

// ---------- Fallback data (Arabic) - Terms ----------

const termsFallbackAr = {
  version: '1.0',

  effective_date: '2024-01-01',

  acceptance_text:
    'باستخدامك لنظام الفواتير، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء منها، يجب عليك عدم استخدام الخدمة.',

  sections: [
    {
      title: 'تعريفات',

      content: [
        '"النظام" يشير إلى منصة إدارة الفواتير الإلكترونية.',
        '"المستخدم" يشير إلى أي شخص أو كيان يستخدم النظام.',
        '"العميل" يشير إلى الطرف الذي يتم إصدار الفاتورة له.',
      ],
    },

    {
      title: 'استخدام الخدمة',

      content: [
        'يجب أن يكون عمرك 18 عاماً على الأقل لاستخدام النظام.',
        'أنت مسؤول عن الحفاظ على سرية بيانات اعتماد حسابك.',
        'لا يجوز استخدام النظام لأي أغراض غير قانونية أو احتيالية.',
      ],

      sub_sections: [
        {
          title: 'قيود الاستخدام',

          content:
            'ممنوع محاولة الوصول غير المصرح به أو تعطيل النظام أو إدخال برمجيات ضارة.',
        },

        {
          title: 'المحتوى',

          content:
            'أنت المسؤول الوحيد عن دقة البيانات التي تدخلها في النظام.',
        },
      ],
    },

    {
      title: 'الاشتراكات والمدفوعات',

      content: [
        'الرسوم المحددة للاشتراكات غير قابلة للاسترداد.',
        'نحتفظ بالحق في تعديل أسعار الاشتراكات مع إشعار مسبق.',
        'في حالة عدم السداد، قد يتم تعليق حسابك مؤقتاً.',
      ],
    },

    {
      title: 'إخلاء المسؤولية',

      content: [
        'نقدم الخدمة "كما هي" دون أي ضمانات صريحة أو ضمنية.',
        'لا نتحمل المسؤولية عن أي خسائر غير مباشرة ناتجة عن استخدام النظام.',
      ],
    },

    {
      title: 'إنهاء الخدمة',

      content: [
        'يمكنك إلغاء حسابك في أي وقت.',
        'نحتفظ بالحق في تعليق أو إنهاء حسابك في حالة انتهاك الشروط.',
      ],
    },
  ],
}

// ---------- Fallback data (English) - Terms ----------

const termsFallbackEn = {
  version: '1.0',

  effective_date: '2024-01-01',

  acceptance_text:
    'By using the invoicing system, you agree to be bound by these terms and conditions. If you do not agree to any part of them, you must not use the service.',

  sections: [
    {
      title: 'Definitions',

      content: [
        '"System" refers to the electronic invoice management platform.',
        '"User" refers to any person or entity using the System.',
        '"Client" refers to the party to whom an invoice is issued.',
      ],
    },

    {
      title: 'Use of Service',

      content: [
        'You must be at least 18 years old to use the System.',
        'You are responsible for keeping your account credentials confidential.',
        'The System may not be used for any illegal or fraudulent purposes.',
      ],

      sub_sections: [
        {
          title: 'Usage Restrictions',

          content:
            'Unauthorized access attempts, disrupting the System, or introducing malicious software are prohibited.',
        },

        {
          title: 'Content',

          content:
            'You are solely responsible for the accuracy of the data you enter into the System.',
        },
      ],
    },

    {
      title: 'Subscriptions and Payments',

      content: [
        'Subscription fees are non-refundable.',
        'We reserve the right to modify subscription prices with prior notice.',
        'In case of non-payment, your account may be temporarily suspended.',
      ],
    },

    {
      title: 'Disclaimer',

      content: [
        'We provide the service "as is" without any express or implied warranties.',
        'We are not liable for any indirect losses resulting from use of the System.',
      ],
    },

    {
      title: 'Termination',

      content: [
        'You may cancel your account at any time.',
        'We reserve the right to suspend or terminate your account in case of violation of the terms.',
      ],
    },
  ],
}

// ---------- Fallback helpers ----------

const getPrivacyFallback = (locale) => {
  return locale === 'en' ? privacyFallbackEn : privacyFallbackAr
}

const getTermsFallback = (locale) => {
  return locale === 'en' ? termsFallbackEn : termsFallbackAr
}

// ---------- Actions ----------

const actions = {
  async fetchPrivacyData({ commit }, locale = 'ar') {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await axios.get('/api/content/privacy', {
        params: {
          lang: locale,
        },
      })

      commit('SET_PRIVACY_DATA', {
        locale,
        data: response.data,
      })
    } catch (error) {
      console.error('Error fetching privacy data:', error)

      commit('SET_PRIVACY_DATA', {
        locale,
        data: getPrivacyFallback(locale),
      })
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchTermsData({ commit }, locale = 'ar') {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)

    try {
      const response = await axios.get('/api/content/terms', {
        params: {
          lang: locale,
        },
      })

      commit('SET_TERMS_DATA', {
        locale,
        data: response.data,
      })
    } catch (error) {
      console.error('Error fetching terms data:', error)

      commit('SET_TERMS_DATA', {
        locale,
        data: getTermsFallback(locale),
      })
    } finally {
      commit('SET_LOADING', false)
    }
  },
}

// ---------- Mutations ----------

const mutations = {
  SET_PRIVACY_DATA(state, { locale, data }) {
    state.privacyData[locale] = data
  },

  SET_TERMS_DATA(state, { locale, data }) {
    state.termsData[locale] = data
  },

  SET_LOADING(state, status) {
    state.loading = status
  },

  SET_ERROR(state, error) {
    state.error = error
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
