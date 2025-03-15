import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    common: {
      dashboard: 'Dashboard',
      myGifts: 'My Gifts',
      profile: 'Profile',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      createGift: 'Create Gift Link',
      share: 'Share',
      cancel: 'Cancel',
      continue: 'Continue',
      processing: 'Processing...',
      receipt: 'Receipt',
      contributors: 'Contributors',
      progress: 'Progress',
      total: 'Total',
      collected: 'Collected',
      organizerBy: 'Organized by',
      contributeToGift: 'Contribute to Gift',
      yourName: 'Your Name',
      message: 'Message',
      optional: 'Optional',
      amount: 'Amount',
      processingFee: 'Processing Fee',
      contributionSummary: 'Contribution Summary',
      continueToPayment: 'Continue to Payment',
      splitGiftsWithEase: 'Split Gifts with Ease',
      createAndShare: 'Create a gift link and share it with friends.',
      collectMoney: 'Collect money together, securely and hassle-free.',
      easyToUse: 'Easy to Use',
      createInMinutes: 'Create and share your gift link in minutes',
      secure: 'Secure',
      collectViaStripe: 'Collect funds directly via Stripe',
      trackProgress: 'Track Progress',
      monitorRealTime: 'Monitor contributions in real-time'
    }
  },
  es: {
    common: {
      dashboard: 'Panel',
      myGifts: 'Mis Regalos',
      profile: 'Perfil',
      signIn: 'Iniciar Sesión',
      signOut: 'Cerrar Sesión',
      createGift: 'Crear Enlace de Regalo',
      share: 'Compartir',
      cancel: 'Cancelar',
      continue: 'Continuar',
      processing: 'Procesando...',
      receipt: 'Recibo',
      contributors: 'Contribuyentes',
      progress: 'Progreso',
      total: 'Total',
      collected: 'Recaudado',
      organizerBy: 'Organizado por',
      contributeToGift: 'Contribuir al Regalo',
      yourName: 'Tu Nombre',
      message: 'Mensaje',
      optional: 'Opcional',
      amount: 'Cantidad',
      processingFee: 'Tarifa de Procesamiento',
      contributionSummary: 'Resumen de la Contribución',
      continueToPayment: 'Continuar al Pago',
      splitGiftsWithEase: 'Divide Regalos Fácilmente',
      createAndShare: 'Crea un enlace de regalo y compártelo con amigos.',
      collectMoney: 'Recauda dinero juntos, de forma segura y sin complicaciones.',
      easyToUse: 'Fácil de Usar',
      createInMinutes: 'Crea y comparte tu enlace de regalo en minutos',
      secure: 'Seguro',
      collectViaStripe: 'Recauda fondos directamente a través de Stripe',
      trackProgress: 'Seguimiento del Progreso',
      monitorRealTime: 'Monitorea las contribuciones en tiempo real'
    }
  },
  hi: {
    common: {
      dashboard: 'डैशबोर्ड',
      myGifts: 'मेरे उपहार',
      profile: 'प्रोफ़ाइल',
      signIn: 'साइन इन करें',
      signOut: 'साइन आउट करें',
      createGift: 'उपहार लिंक बनाएं',
      share: 'शेयर करें',
      cancel: 'रद्द करें',
      continue: 'जारी रखें',
      processing: 'प्रोसेसिंग...',
      receipt: 'रसीद',
      contributors: 'योगदानकर्ता',
      progress: 'प्रगति',
      total: 'कुल',
      collected: 'एकत्रित',
      organizerBy: 'आयोजक',
      contributeToGift: 'उपहार में योगदान करें',
      yourName: 'आपका नाम',
      message: 'संदेश',
      optional: 'वैकल्पिक',
      amount: 'राशि',
      processingFee: 'प्रोसेसिंग शुल्क',
      contributionSummary: 'योगदान सारांश',
      continueToPayment: 'भुगतान जारी रखें',
      splitGiftsWithEase: 'आसानी से उपहार बांटें',
      createAndShare: 'उपहार लिंक बनाएं और दोस्तों के साथ शेयर करें।',
      collectMoney: 'सुरक्षित और आसानी से एक साथ पैसे जमा करें।',
      easyToUse: 'उपयोग में आसान',
      createInMinutes: 'मिनटों में अपना उपहार लिंक बनाएं और शेयर करें',
      secure: 'सुरक्षित',
      collectViaStripe: 'स्ट्राइप के माध्यम से सीधे धन एकत्र करें',
      trackProgress: 'प्रगति की निगरानी',
      monitorRealTime: 'रीयल-टाइम में योगदान की निगरानी करें'
    }
  },
  pa: {
    common: {
      dashboard: 'ਡੈਸ਼ਬੋਰਡ',
      myGifts: 'ਮੇਰੇ ਤੋਹਫ਼ੇ',
      profile: 'ਪ੍ਰੋਫਾਈਲ',
      signIn: 'ਸਾਈਨ ਇਨ',
      signOut: 'ਸਾਈਨ ਆਊਟ',
      createGift: 'ਤੋਹਫ਼ਾ ਲਿੰਕ ਬਣਾਓ',
      share: 'ਸ਼ੇਅਰ ਕਰੋ',
      cancel: 'ਰੱਦ ਕਰੋ',
      continue: 'ਜਾਰੀ ਰੱਖੋ',
      processing: 'ਪ੍ਰੋਸੈਸਿੰਗ...',
      receipt: 'ਰਸੀਦ',
      contributors: 'ਯੋਗਦਾਨੀ',
      progress: 'ਤਰੱਕੀ',
      total: 'ਕੁੱਲ',
      collected: 'ਇਕੱਠਾ ਕੀਤਾ',
      organizerBy: 'ਆਯੋਜਕ',
      contributeToGift: 'ਤੋਹਫ਼ੇ ਵਿੱਚ ਯੋਗਦਾਨ ਪਾਓ',
      yourName: 'ਤੁਹਾਡਾ ਨਾਮ',
      message: 'ਸੁਨੇਹਾ',
      optional: 'ਵਿਕਲਪਿਕ',
      amount: 'ਰਕਮ',
      processingFee: 'ਪ੍ਰੋਸੈਸਿੰਗ ਫੀਸ',
      contributionSummary: 'ਯੋਗਦਾਨ ਸੰਖੇਪ',
      continueToPayment: 'ਭੁਗਤਾਨ ਜਾਰੀ ਰੱਖੋ',
      splitGiftsWithEase: 'ਆਸਾਨੀ ਨਾਲ ਤੋਹਫ਼ੇ ਵੰਡੋ',
      createAndShare: 'ਤੋਹਫ਼ਾ ਲਿੰਕ ਬਣਾਓ ਅਤੇ ਦੋਸਤਾਂ ਨਾਲ ਸਾਂਝਾ ਕਰੋ।',
      collectMoney: 'ਸੁਰੱਖਿਅਤ ਅਤੇ ਆਸਾਨੀ ਨਾਲ ਇਕੱਠੇ ਪੈਸੇ ਇਕੱਠੇ ਕਰੋ।',
      easyToUse: 'ਵਰਤਣ ਵਿੱਚ ਆਸਾਨ',
      createInMinutes: 'ਮਿੰਟਾਂ ਵਿੱਚ ਆਪਣਾ ਤੋਹਫ਼ਾ ਲਿੰਕ ਬਣਾਓ ਅਤੇ ਸਾਂਝਾ ਕਰੋ',
      secure: 'ਸੁਰੱਖਿਅਤ',
      collectViaStripe: 'ਸਟ੍ਰਾਈਪ ਰਾਹੀਂ ਸਿੱਧਾ ਫੰਡ ਇਕੱਠਾ ਕਰੋ',
      trackProgress: 'ਤਰੱਕੀ ਦੀ ਨਿਗਰਾਨੀ',
      monitorRealTime: 'ਰੀਅਲ-ਟਾਈਮ ਵਿੱਚ ਯੋਗਦਾਨ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ'
    }
  },
  zh: {
    common: {
      dashboard: '仪表板',
      myGifts: '我的礼物',
      profile: '个人资料',
      signIn: '登录',
      signOut: '登出',
      createGift: '创建礼物链接',
      share: '分享',
      cancel: '取消',
      continue: '继续',
      processing: '处理中...',
      receipt: '收据',
      contributors: '贡献者',
      progress: '进度',
      total: '总计',
      collected: '已收集',
      organizerBy: '组织者',
      contributeToGift: '为礼物贡献',
      yourName: '您的姓名',
      message: '留言',
      optional: '可选',
      amount: '金额',
      processingFee: '处理费',
      contributionSummary: '贡献摘要',
      continueToPayment: '继续支付',
      splitGiftsWithEase: '轻松分摊礼物',
      createAndShare: '创建礼物链接并与朋友分享。',
      collectMoney: '安全无忧地一起收集资金。',
      easyToUse: '易于使用',
      createInMinutes: '几分钟内创建并分享您的礼物链接',
      secure: '安全',
      collectViaStripe: '通过Stripe直接收集资金',
      trackProgress: '跟踪进度',
      monitorRealTime: '实时监控贡献'
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n 