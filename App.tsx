import React from 'react';

import 'intl';
import 'intl/locale-data/jsonp/en-US';
import 'date-time-format-timezone';

require('./react-native-paper-dates-config');
import {
	SafeAreaView,
	StatusBar,
	View,
	StyleSheet,
	Platform,
} from 'react-native';
import { useFonts } from 'expo-font';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import 'react-native-gesture-handler';

import { registerTranslation, pt } from 'react-native-paper-dates';

registerTranslation('pt', pt);

// registerTranslation("br", {
//     save: 'Salvar',
//     selectSingle: 'Selecione a data',
//     selectMultiple: 'Selecione as datas',
//     selectRange: 'Selecione um período',
//     notAccordingToDateFormat: (inputFormat) =>
//         `O formato de data deve ser ${inputFormat}`,
//     mustBeHigherThan: (date) => `Deve ser maior que ${date}`,
//     mustBeLowerThan: (date) => `Deve ser menor que ${date}`,
//     mustBeBetween: (startDate, endDate) =>
//         `Deve estar entre ${startDate} - ${endDate}`,
//     dateIsDisabled: 'Dia não permitido',
//     previous: 'Anterior',
//     next: 'Próximo',
//     typeInDate: 'Digite a data',
//     pickDateFromCalendar: 'Escolha a data do calendário',
//     close: 'Fechar',
// })

import { NavigationContainer } from '@react-navigation/native';
import { globalColors } from './src/global/styleGlobal';

import AuthProvider from './src/services/auth';
import NotificacaoProvider from './src/contexts/NotificacaoProvider';
import AppRoutes from './src/routes';

const fontMontserrat = require('./assets/Montserrat-Regular.ttf');

const theme = {
	...DefaultTheme,
	dark: false,
	colors: {
		...DefaultTheme.colors,
		primary: globalColors.primaryColor,
		secondary: globalColors.secondaryColor,
		tertiary: globalColors.tertiaryColor,
		placeholder: globalColors.primaryColor,
	},
};

const App: React.FC = () => {
	const [loaded] = useFonts({
		Montserrat: fontMontserrat,
	});

	if (!loaded) {
		return null;
	}

	return (
		<NavigationContainer>
			<AuthProvider>
				<NotificacaoProvider>
					<PaperProvider theme={theme}>
						{Platform.OS === 'ios' ? (
							<MyStatusBar backgroundColor='#4F7C8A' />
						) : (
							<StatusBar backgroundColor='#4F7C8A' />
						)}
						<AppRoutes />
					</PaperProvider>
				</NotificacaoProvider>
			</AuthProvider>
		</NavigationContainer>
	);
};

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = 44;

const MyStatusBarStyles = StyleSheet.create({
	container: {
		flex: 1,
	},
	statusBar: {
		height: STATUSBAR_HEIGHT,
	},
	appBar: {
		backgroundColor: '#79B45D',
		height: APPBAR_HEIGHT,
	},
	content: {
		flex: 1,
		backgroundColor: '#33373B',
	},
});

const MyStatusBar = ({ backgroundColor, ...props }) => (
	<View style={[MyStatusBarStyles.statusBar, { backgroundColor }]}>
		<SafeAreaView>
			<StatusBar translucent backgroundColor={backgroundColor} {...props} />
		</SafeAreaView>
	</View>
);

export default App;
