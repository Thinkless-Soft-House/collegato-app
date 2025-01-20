import React, { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  View,
  Platform,
  StyleSheet,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { registerTranslation, pt } from "react-native-paper-dates";

import "intl";
import "intl/locale-data/jsonp/en-US";
import "date-time-format-timezone";
import "react-native-gesture-handler";

import { globalColors } from "./src/global/styleGlobal";
import AuthProvider from "./src/services/auth";
import NotificacaoProvider from "./src/contexts/NotificacaoProvider";
import AppRoutes from "./src/routes";

SplashScreen.preventAutoHideAsync();
registerTranslation("pt", pt);

const fontMontserrat = require("./assets/Montserrat-Regular.ttf");

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

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Carrega as fontes e outras configurações necessárias
        await Font.loadAsync({ Montserrat: fontMontserrat });
        // Simula uma pequena demora, se necessário
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <AuthProvider>
          <NotificacaoProvider>
            <PaperProvider theme={theme}>
              {Platform.OS === "ios" ? (
                <MyStatusBar backgroundColor="#4F7C8A" />
              ) : (
                <StatusBar backgroundColor="#4F7C8A" />
              )}
              <AppRoutes />
            </PaperProvider>
          </NotificacaoProvider>
        </AuthProvider>
      </NavigationContainer>
    </View>
  );
}

const MyStatusBarStyles = StyleSheet.create({
  statusBar: {
    height: StatusBar.currentHeight,
  },
});

const MyStatusBar = ({ backgroundColor, ...props }) => (
  <View style={[MyStatusBarStyles.statusBar, { backgroundColor }]}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);
