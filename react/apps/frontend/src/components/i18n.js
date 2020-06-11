import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationEN from '../locales/en/translationEN.json'
import translationGR from '../locales/gr/translationGR.json'


i18n.use(initReactI18next).init({
	fallbackLng: 'en',
	interpolation: {
		escapeValue: false,
	},
	react: {
		wait: true,
	},
	keySeparator: '-',
	resources: {
		en: {
			translation: translationEN
		},
		gr: {
			translation: translationGR
		},
	},
})

export default i18n