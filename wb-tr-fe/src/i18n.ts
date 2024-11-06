// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

// Initialize i18n
i18n
  .use(HttpApi)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'de'],
    fallbackLng: 'en',
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
});

export default i18n;
