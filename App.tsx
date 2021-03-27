import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";
import * as Font from "expo-font";

import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { LoggedOutNavigation } from "./src/routers/logged.out";
import { NavigationContainer } from "@react-navigation/native";
import styled, { ThemeProvider } from "styled-components/native";
import { AppearanceProvider } from "react-native-appearance";
import { darkTheme, lightTheme } from "./src/theme/theme";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import { apolloClient, cache } from "./src/apollo/client";
import {
  authTokenVar,
  getTokenFromStorage,
  isLoggedInVar,
} from "./src/apollo/vars";
import { LoggedInWrapperNavigation } from "./src/routers/logged.in";
import {
  persistCache,
  CachePersistor,
  AsyncStorageWrapper,
} from "apollo3-cache-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [loading, setLoading] = useState(true);
  const mode = useColorScheme();

  const preload = async () => {
    /*const persistor = new CachePersistor({
      cache,
      storage: new AsyncStorageWrapper(AsyncStorage),
      serialize: false,
    });*/

    // auth token 설정
    const tokenFromStorage = await getTokenFromStorage();
    isLoggedInVar(Boolean(tokenFromStorage));
    authTokenVar(tokenFromStorage);

    const images = [
      require("./assets/insta.png"),
      require("./assets/insta_dark.png"),
    ];

    const fontsToLoad = [Ionicons.font];

    const cacheImages = images.map((image) =>
      Asset.fromModule(image).downloadAsync()
    );
    const cacheFonts = fontsToLoad.map((font) => Font.loadAsync(font));

    await Promise.all<any>([...cacheImages, ...cacheFonts]);
  };
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  if (loading) {
    return (
      <AppLoading
        onError={console.warn}
        onFinish={() => setLoading(false)}
        startAsync={preload}
      />
    );
  }

  return (
    <ApolloProvider client={apolloClient}>
      <AppearanceProvider>
        <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
          <NavigationContainer>
            {isLoggedIn ? (
              <LoggedInWrapperNavigation />
            ) : (
              <LoggedOutNavigation />
            )}
          </NavigationContainer>
        </ThemeProvider>
      </AppearanceProvider>
    </ApolloProvider>
  );
}
