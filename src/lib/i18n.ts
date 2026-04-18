export const translations = {
  en: {
    nav: {
      search: 'Search',
      dashboard: 'Dashboard',
      login: 'Log In',
      logout: 'Log Out'
    },
    hero: {
      title: 'Your License Plate is Now a Communication Hub',
      subtitle: 'The global network that turns vehicle license plates into anonymous, secure communication channels.',
      ctaSearch: 'Search Vehicle',
      ctaClaim: 'Claim Your Plate'
    },
    features: {
      towing: { title: 'Prevent Towing', desc: 'Get notified instantly by other drivers if your car is about to be towed.' },
      privacy: { title: 'Anonymous & Secure', desc: 'Communicate with vehicle owners without sharing your private phone number.' },
      global: { title: 'Global Fleet Ready', desc: 'Register any license plate from any country and start receiving messages.' }
    },
    auth: {
      title: 'Secure Portal',
      subtitle: 'Authentication required for access.',
      email: 'Email Address',
      password: 'Security Key',
      loginBtn: 'LOG IN',
      invalid: 'Invalid email or password',
      newUser: 'New user?',
      createAccount: 'Create account'
    },
    registration: {
      title: 'Register Vehicle',
      subtitle: 'Connect your license plate to your digital identity.',
      plateNumber: 'Plate Number',
      brand: 'Manufacturer',
      model: 'Model',
      photos: 'Vehicle Photos',
      tos: 'I verify that I own this vehicle and will follow community guidelines.',
      submit: 'Complete Registration',
      success: 'Vehicle registered and secured!',
      photoSuccess: 'Photo added to registration'
    },
    search: {
      title: 'Smart Vehicle Search',
      subtitle: "Enter any license plate. We'll handle the rest.",
      placeholder: 'e.g. 01 A 777 AA',
      button: 'Locate Owner',
      hint: 'Detection engine: Universal Mode',
      badgeAnon: 'Anonymous Identity',
      badgeGlobal: 'Global Coverage'
    },
    plate: {
      tagUnknown: 'Unclaimed',
      tagVerified: 'Verified Owner',
      contactBtn: 'Contact Owner',
      messagePlaceholder: 'Write a message...',
      sendBtn: 'Send Message'
    },
    dashboard: {
      myFleet: 'My Fleet',
      signals: 'Signals',
      security: 'Security',
      enlist: 'Enlist Vehicle',
      fleetCommand: 'Fleet Command',
      manageIdentities: 'Manage your registered vehicle identities.',
      logs: 'Logs',
      configure: 'Configure',
      emptyFleet: 'No Assets Enlisted',
      emptyFleetDesc: 'Your vehicle identity is currently offline. Register your plate to start receiving smart notifications.',
      registerFirst: 'Register First Plate',
      signalLogs: 'Signal Logs',
      signalLogsDesc: 'Encrypted messages directed to your fleet.',
      quickResponse: 'Quick Response',
      archive: 'Archive',
      noSignals: 'No incoming signals detected across your fleet.'
    },
    plateDetail: {
      return: 'Return to Fleet',
      unclaimed: 'UNCLAIMED',
      verified: 'AUTHENTICATED',
      color: 'COLOR',
      network: 'NETWORK',
      visualVer: 'VISUAL VERIFICATION',
      privacyOwner: "Secure end-to-end encrypted channel. Signals are routed directly to the owner.",
      privacyGuest: "This handle is not yet registered. Signal will be stored in escrow.",
      dispatch: 'Dispatch Signal',
      compose: 'Compose secure transmission...',
      send: 'INITIALIZE DISPATCH',
      sent: 'SIGNAL DELIVERED',
      newSignal: 'New Signal',
      returnRadar: 'Return to Radar',
      quickMsgs: [
        "Your lights are on!",
        "Your car is blocking mine.",
        "You left a window open.",
        "Please move your car.",
        "Did you forget your keys?",
      ]
    },
    footer: {
      copy: '© 2026 NomerTop. Driving Digital Identity.'
    }
  },
  ru: {
    nav: {
      search: 'Поиск',
      dashboard: 'Дашборд',
      login: 'Войти',
      logout: 'Выйти'
    },
    hero: {
      title: 'Номерной знак — ваш профиль',
      subtitle: 'Глобальная сеть для анонимного и безопасного общения между водителями.',
      ctaSearch: 'Найти авто',
      ctaClaim: 'Добавить номер'
    },
    features: {
      towing: { title: 'Против эвакуации', desc: 'Узнайте мгновенно, если вашу машину хотят эвакуировать.' },
      privacy: { title: 'Анонимно и безопасно', desc: 'Общайтесь, не раскрывая свой личный номер телефона.' },
      global: { title: 'Любые страны', desc: 'Регистрируйте номер любой страны и получайте сообщения.' }
    },
    auth: {
      title: 'Вход в систему',
      subtitle: 'Пожалуйста, авторизуйтесь для продолжения.',
      email: 'Электронная почта',
      password: 'Пароль',
      loginBtn: 'ВОЙТИ',
      invalid: 'Неверный email или пароль',
      newUser: 'Нет аккаунта?',
      createAccount: 'Создать профиль'
    },
    registration: {
      title: 'Регистрация транспорта',
      subtitle: 'Привяжите номерной знак к вашему профилю.',
      plateNumber: 'Номер автомобиля',
      brand: 'Марка',
      model: 'Модель',
      photos: 'Фотографии авто',
      tos: 'Я подтверждаю, что владею этим автомобилем.',
      submit: 'Завершить регистрацию',
      success: 'Транспорт успешно добавлен!',
      photoSuccess: 'Фотография сохранена'
    },
    search: {
      title: 'Умный поиск авто',
      subtitle: 'Введите номер автомобиля. Остальное — наша забота.',
      placeholder: 'Например: 01 A 777 AA',
      button: 'Найти владельца',
      hint: 'Режим поиска: Универсальный',
      badgeAnon: 'Анонимно',
      badgeGlobal: 'Весь мир'
    },
    plate: {
      tagUnknown: 'Не подтвержден',
      tagVerified: 'Владелец подтвержден',
      contactBtn: 'Связаться с владельцем',
      messagePlaceholder: 'Напишите сообщение...',
      sendBtn: 'Отправить'
    },
    dashboard: {
      myFleet: 'Мой автопарк',
      signals: 'Сигналы',
      security: 'Безопасность',
      enlist: 'Добавить авто',
      fleetCommand: 'Управление парком',
      manageIdentities: 'Управляйте вашими зарегистрированными автомобилями.',
      logs: 'История',
      configure: 'Настроить',
      emptyFleet: 'Автомобили не добавлены',
      emptyFleetDesc: 'Ваш профиль пока не привязан к авто. Добавьте номер, чтобы начать получать уведомления.',
      registerFirst: 'Добавить первый номер',
      signalLogs: 'Журнал сигналов',
      signalLogsDesc: 'Зашифрованные сообщения для вашего автопарка.',
      quickResponse: 'Ответить',
      archive: 'Архив',
      noSignals: 'Входящих сигналов пока нет.'
    },
    plateDetail: {
      return: 'Назад',
      unclaimed: 'НЕ ПОДТВЕРЖДЕН',
      verified: 'ПОДТВЕРЖДЕН',
      color: 'ЦВЕТ',
      network: 'СЕТЬ',
      visualVer: 'ФОТО ТРАНСПОРТА',
      privacyOwner: "Безопасный канал. Сообщения доставляются напрямую владельцу.",
      privacyGuest: "Этот номер еще не зарегистрирован. Сообщение будет сохранено до востребования.",
      dispatch: 'Отправить сообщение',
      compose: 'Напишите текст сообщения...',
      send: 'ОТПРАВИТЬ',
      sent: 'ОТПРАВЛЕНО',
      newSignal: 'Новое сообщение',
      returnRadar: 'В поиск',
      quickMsgs: [
        "Фары не выключены!",
        "Машина мешает проезду.",
        "Окно открыто.",
        "Пожалуйста, переставьте машину.",
        "Вы не забыли ключи?",
      ]
    },
    footer: {
      copy: '© 2026 NomerTop. Ведущая цифровая идентичность.'
    }
  },
  uz: {
    nav: {
      search: 'Qidiruv',
      dashboard: 'Kabinet',
      login: 'Kirish',
      logout: 'Chiqish'
    },
    hero: {
      title: 'Mashina raqami — muloqot markazi',
      subtitle: 'Mashina raqami orqali egasiga xabar yuborishning eng oddiy va xavfsiz yo‘li.',
      ctaSearch: 'Mashina qidirish',
      ctaClaim: 'Raqamni ulash'
    },
    features: {
      towing: { title: 'Evakuatsiyaga yo‘l bermang', desc: 'Mashinangizni olib ketishayotgan bo‘lsa, darhol xabar olasiz.' },
      privacy: { title: 'Shaxsiy muloqot', desc: 'Telefon raqamingizni bermasdan mashina egasi bilan gaplashing.' },
      global: { title: 'Hamma davlatlar uchun', desc: 'Istalgan davlat raqamini ro‘yxatdan o‘tkazing va xabar oling.' }
    },
    auth: {
      title: 'Kirish',
      subtitle: 'Davom etish uchun tizimga kiring.',
      email: 'Email manzili',
      password: 'Parol',
      loginBtn: 'KIRISH',
      invalid: 'Email yoki parol xato',
      newUser: 'Hali ro‘yxatdan o‘tmaganmisiz?',
      createAccount: 'Ro‘yxatdan o‘tish'
    },
    registration: {
      title: 'Mashinani qo‘shish',
      subtitle: 'Mashina raqamingizni profilingizga ulang.',
      plateNumber: 'Davlat raqami',
      brand: 'Markasi',
      model: 'Modeli',
      photos: 'Mashina rasmlari',
      tos: 'Bu mashina menga tegishli ekanligini tasdiqlayman.',
      submit: 'Saqlash',
      success: 'Mashina muvaffaqiyatli qo‘shildi!',
      photoSuccess: 'Rasm qo‘shildi'
    },
    search: {
      title: 'Aqlli qidiruv',
      subtitle: 'Mashina raqamini kiriting, biz egasini topamiz.',
      placeholder: 'Masalan: 01 A 777 AA',
      button: 'Egasini topish',
      hint: 'Qidiruv rejimi: Universal',
      badgeAnon: 'Anonim muloqot',
      badgeGlobal: 'Dunyo bo‘ylab'
    },
    plate: {
      tagUnknown: 'Egasiz',
      tagVerified: 'Tasdiqlangan haydovchi',
      contactBtn: 'Egasiga xabar yuborish',
      messagePlaceholder: 'Xabar yozing...',
      sendBtn: 'Yuborish'
    },
    dashboard: {
      myFleet: 'Mashinalarim',
      signals: 'Xabarlar',
      security: 'Xavfsizlik',
      enlist: 'Mashina qo‘shish',
      fleetCommand: 'Boshqaruv paneli',
      manageIdentities: 'Ro‘yxatdan o‘tgan mashinalaringizni boshqaring.',
      logs: 'Tarix',
      configure: 'Sozlash',
      emptyFleet: 'Mashinalar yo‘q',
      emptyFleetDesc: 'Xabarlarni qabul qilish uchun mashinangizni ro‘yxatdan o‘tkazing.',
      registerFirst: 'Birinchi raqamni qo‘shish',
      signalLogs: 'Xabarlar tarixi',
      signalLogsDesc: 'Sizga kelgan maxfiy xabarlar.',
      quickResponse: 'Javob berish',
      archive: 'Arxiv',
      noSignals: 'Hozircha xabarlar yo‘q.'
    },
    plateDetail: {
      return: 'Kabinetga qaytish',
      unclaimed: 'EGASIZ RAQAM',
      verified: 'TASDIQLANGAN',
      color: 'RANGI',
      network: 'TARMOQ',
      visualVer: 'MASHINA RASMLARI',
      privacyOwner: "Xabarlar to‘g‘ridan-to‘g‘ri mashina egasiga yuboriladi.",
      privacyGuest: "Bu raqam hali ro‘yxatdan o‘tmagan. Xabar saqlab qo‘yiladi.",
      dispatch: 'Xabar yozish',
      compose: 'Xabar matnini kiriting...',
      send: 'YUBORISH',
      sent: 'XABAR YUBORILDI',
      newSignal: 'Yangi xabar',
      returnRadar: 'Qidiruvga qaytish',
      quickMsgs: [
        "Chiroqlaringiz yoniq qolibdi!",
        "Mashinangiz yo‘lni to‘sib qo‘ydi.",
        "Oynangiz ochiq qolibdi.",
        "Mashinani surib qo‘ya olasizmi?",
        "Kalitingiz esdan chiqmadimi?",
      ]
    },
    footer: {
      copy: '© 2026 NomerTop. Avtomobil egalari tarmog‘i.'
    }
  }
};

export type Locale = keyof typeof translations;
