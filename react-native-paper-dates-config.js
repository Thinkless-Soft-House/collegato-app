const isAndroid = require('react-native').Platform.OS === 'android';
const isHermesEnabled = !!global.HermesInternal;

if (isHermesEnabled || isAndroid) {
	require('@formatjs/intl-getcanonicallocales/polyfill');
	require('@formatjs/intl-locale/polyfill');
	require('@formatjs/intl-pluralrules/polyfill');
	require('@formatjs/intl-pluralrules/locale-data/en.js');
	require('@formatjs/intl-displaynames/polyfill');
	require('@formatjs/intl-displaynames/locale-data/en.js');
	require('@formatjs/intl-listformat/polyfill');
	require('@formatjs/intl-listformat/locale-data/en.js');
	require('@formatjs/intl-numberformat/polyfill');
	require('@formatjs/intl-numberformat/locale-data/en.js');
	require('@formatjs/intl-relativetimeformat/polyfill');
	require('@formatjs/intl-relativetimeformat/locale-data/en.js');
	require('@formatjs/intl-datetimeformat/polyfill');
	require('@formatjs/intl-datetimeformat/locale-data/en.js');
	require('@formatjs/intl-datetimeformat/add-golden-tz.js');

	if ('__setDefaultTimeZone' in Intl.DateTimeFormat) {
		const localization = require('expo-localization');
		const timeZone = localization.timezone;
		console.log('Timezone:', timeZone);

		const isValidTimeZone = (timeZone) => {
			try {
				Intl.DateTimeFormat(undefined, { timeZone });
				return true;
			} catch (e) {
				return false;
			}
		};

		const defaultTimeZone = 'UTC'; // Defina seu timezone padrão aqui

		if (isValidTimeZone(timeZone)) {
			Intl.DateTimeFormat.__setDefaultTimeZone(timeZone);
		} else {
			console.warn(
				'Invalid timezone:',
				timeZone,
				'Falling back to default:',
				defaultTimeZone
			);
			Intl.DateTimeFormat.__setDefaultTimeZone(defaultTimeZone);
		}
	}
}
