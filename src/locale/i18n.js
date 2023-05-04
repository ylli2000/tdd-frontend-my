import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from './en';
import cn from './cn';

/*
NOTE: locale i18n
internationalised locale: npm install react-i18next i18next --save
call init in index.js

SignUp.js
import { useTranslation } from "react-i18next";
const {t} = useTranslation();
t('some_key');

api.js
import i18n from '../../locale/i18n';
'Accept-Language': i18n.language
*/


export const initI18n = (def = 'en') => {
    i18n.use(initReactI18next).init({ // passes i18n down to react-i18next
        // the translations
        // (tip move them in a JSON file and import them,
        // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
        resources: {
            en: { translation: en },
            cn: { translation: cn }
        },
        lng: def, // if you're using a language detector, do not define the lng option
        fallbackLng: def,
        // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        interpolation: { escapeValue: false }
    });
};

export default i18n;