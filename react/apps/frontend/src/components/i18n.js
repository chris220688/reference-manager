import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
// import translationEN from 'locales/en/translation.json'
// import translationZH from 'locales/zh/translation.json'

i18n.use(initReactI18next).init({
	fallbackLng: 'gr',
	debug: true,
	interpolation: {
		escapeValue: false,
	},
	resources: {
		en: {
			translation: {
				"page": "Page",
				"search.language.greek": "Greek",
				"search.language.english": "English",
				"search.logout": "Log out",
				"search.myaccount": "My Account",
				"search.references": "References",
				"search.search": "Search",
				"search.joiuns": "Join us",
				"search.categories": "Categories",
				"search.categories.history": "History",
				"search.categories.literature": "Literature",
				"search.categories.science": "Science",
				"search.categories.computer_science": "Computer Science",
				"references.categories.history": "History",
				"references.categories.literature": "Literature",
				"references.categories.science": "Science",
				"references.categories.computer_science": "Computer Science",
			}
		},
		gr: {
			translation: {
				"page": "Σελίδα",
				"search.language.greek": "Ελληνικά",
				"search.language.english": "Αγγλικά",
				"search.logout": "Αποσύνδεση",
				"search.myaccount": "Ο λογαριασμός μου",
				"search.references": "Αναφορές",
				"search.search": "Αναζήτηση",
				"search.joiuns": "Ενωθείτε μαζί μας",
				"search.categories": "Κατηγορίες",
				"search.categories.history": "Ιστορία",
				"search.categories.literature": "Λογοτεχνία",
				"search.categories.science": "Επιστήμη",
				"search.categories.computer_science": "Επιστήμη Υπολογιστών",
				"references.categories.history": "Ιστορία",
				"references.categories.literature": "Λογοτεχνία",
				"references.categories.science": "Επιστήμη",
				"references.categories.computer_science": "Επιστήμη Υπολογιστών",
			}
		},
	},
	react: {
		wait: true,
	},
	keySeparator: '-',
})

export default i18n