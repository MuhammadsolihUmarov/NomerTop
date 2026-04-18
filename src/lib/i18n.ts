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
      dashboard: 'Dashboard',
      login: 'Kirish',
      logout: 'Chiqish'
    },
    hero: {
      title: 'Avtomobil raqami endi aloqa markazi',
      subtitle: 'Avtomobil raqamlarini anonim va xavfsiz aloqa kanallariga aylantiruvchi global tarmoq.',
      ctaSearch: 'Avtomobilni qidirish',
      ctaClaim: 'Raqamni biriktirish'
    },
    features: {
      towing: { title: 'Evakuatsiyaga stop', desc: 'Agar mashinangizni olib ketishmoqchi bo‘lsa, boshqa haydovchilardan darhol xabar oling.' },
      privacy: { title: 'Anonim va Xavfsiz', desc: 'Shaxsiy telefon raqamingizni oshkor qilmasdan avtomobil egalari bilan muloqot qiling.' },
      global: { title: 'Global Tayyorlik', desc: 'Istalgan davlat raqamini ro‘yxatdan o‘tkazing va xabarlarni qabul qiling.' }
    },
    footer: {
      copy: '© 2026 NomerTop. Raqamli identifikatsiya yetakchisi.'
    }
  }
};

export type Locale = keyof typeof translations;
