export const translations = {
  en: {
    nav: {
      search: 'Search',
      dashboard: 'Dashboard',
      login: 'Log In',
      logout: 'Disconnect'
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
      title: 'Ваш номерной знак теперь — узел связи',
      subtitle: 'Глобальная сеть, превращающая номерные знаки автомобилей в анонимные и безопасные каналы связи.',
      ctaSearch: 'Найти авто',
      ctaClaim: 'Заявить права'
    },
    features: {
      towing: { title: 'Против эвакуации', desc: 'Получайте мгновенные уведомления от других водителей, если вашу машину хотят эвакуировать.' },
      privacy: { title: 'Анонимно и безопасно', desc: 'Общайтесь с владельцами авто, не раскрывая свой номер телефона.' },
      global: { title: 'Для любого флота', desc: 'Регистрируйте любой номер из любой страны и начните получать сообщения.' }
    },
    footer: {
      copy: '© 2026 NomerTop. Ведущая цифровая идентичность.'
    }
  },
  uz: {
    nav: {
      search: 'Qidiruv',
      dashboard: 'Profil',
      login: 'Kirish',
      logout: 'Chiqish'
    },
    hero: {
      title: 'Mashina raqami orqali bog‘laning',
      subtitle: 'Mashina raqami orqali egasiga xabar yuborishning eng oddiy va xavfsiz yo‘li.',
      ctaSearch: 'Egasi bilan bog‘lanish',
      ctaClaim: 'Nomerimni ulash'
    },
    features: {
      towing: { title: 'Evakuatsiyaga yo‘l bermang', desc: 'Mashinangizni olib ketishayotgan bo‘lsa, darhol xabar olasiz.' },
      privacy: { title: 'Shaxsiy muloqot', desc: 'Telefon raqamingizni bermasdan mashina egasi bilan gaplashing.' },
      global: { title: 'Hamma davlatlar uchun', desc: 'Istalgan davlat raqamini ro‘yxatdan o‘tkazing va xabar oling.' }
    },
    footer: {
      copy: '© 2026 NomerTop. Avtomobil egalari tarmog‘i.'
    }
  }
};

export type Locale = keyof typeof translations;
