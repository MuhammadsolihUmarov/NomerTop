export type Locale = 'en' | 'ru' | 'uz';

export const translations = {
  en: {
    nav: {
      search: 'Search',
      dashboard: 'Dashboard',
      login: 'Log In',
      logout: 'Log Out',
    },
    hero: {
      title: 'Your License Plate is Now a Communication Hub',
      subtitle: 'The global network that turns vehicle license plates into anonymous, secure communication channels.',
      ctaSearch: 'Search Vehicle',
      ctaClaim: 'Claim Your Plate',
    },
    features: {
      towing: {
        title: 'Prevent Towing',
        desc: 'Receive alerts from others before a tow truck is called if you are blocking someone.',
      },
      privacy: {
        title: 'Anonymous & Secure',
        desc: 'We never reveal your phone number. Messages are routed through our encrypted vault.',
      },
      global: {
        title: 'Global Fleet Ready',
        desc: 'Support for license plates from Uzbekistan, Russia, Kazakhstan, and more.',
      }
    },
    footer: {
      copy: '© 2026 NomerTop Global. All rights reserved.',
    }
  },
  ru: {
    nav: {
      search: 'Поиск',
      dashboard: 'Панель',
      login: 'Войти',
      logout: 'Выйти',
    },
    hero: {
      title: 'Ваш номер — это центр общения',
      subtitle: 'Глобальная сеть, превращающая автомобильные номера в анонимные и безопасные каналы связи.',
      ctaSearch: 'Найти авто',
      ctaClaim: 'Зарегистрировать номер',
    },
    features: {
      towing: {
        title: 'Избегайте эвакуации',
        desc: 'Получайте предупреждения от других водителей до того, как вызовут эвакуатор.',
      },
      privacy: {
        title: 'Анонимно и безопасно',
        desc: 'Мы никогда не раскрываем ваш номер телефона. Сообщения передаются через наше хранилище.',
      },
      global: {
        title: 'Глобальная сеть',
        desc: 'Поддержка госномеров Узбекистана, России, Казахстана и других стран.',
      }
    },
    footer: {
      copy: '© 2026 NomerTop Global. Все права защищены.',
    }
  },
  uz: {
    nav: {
      search: 'Qidiruv',
      dashboard: 'Dashboard',
      login: 'Kirish',
      logout: 'Chiqish',
    },
    hero: {
      title: 'Avtomobil raqamingiz — bu muloqot markazi',
      subtitle: 'Avtomobil raqamlarini anonim va xavfsiz aloqa kanallariga aylantiruvchi global tarmoq.',
      ctaSearch: 'Avtoni qidirish',
      ctaClaim: 'Raqamni ro‘yxatdan o‘tkazish',
    },
    features: {
      towing: {
        title: 'Evakuatsiyadan saqlaning',
        desc: 'Boshqalarni to‘sib qo‘ygan bo‘lsangiz, evakuator chaqirilishidan oldin ogohlantirish oling.',
      },
      privacy: {
        title: 'Anonim va xavfsiz',
        desc: 'Biz sizning telefon raqamingizni hech qachon oshkor qilmaymiz. Xabarlar bizning maxfiy omborimiz orqali o‘tadi.',
      },
      global: {
        title: 'Global tarmoq',
        desc: 'O‘zbekiston, Rossiya, Qozog‘iston va boshqa davlatlar davlat raqamlarini qo‘llab-quvvatlash.',
      }
    },
    footer: {
      copy: '© 2026 NomerTop Global. Barcha huquqlar himoyalangan.',
    }
  }
};
