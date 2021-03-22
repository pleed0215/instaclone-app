import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LoggedOutNavigation } from "./routers/logged.out";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  const [loading, setLoading] = useState(true);

  const preload = async () => {
    const images = [
      require("./assets/instalogo.png"),
      require("./assets/instalogo_dark.png"),
    ];

    const fontsToLoad = [Ionicons.font];

    const cacheImages = images.map((image) =>
      Asset.fromModule(image).downloadAsync()
    );
    const cacheFonts = fontsToLoad.map((font) => Font.loadAsync(font));
    await Promise.all<any>([...cacheImages, ...cacheFonts]);
  };

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
    <NavigationContainer>
      <LoggedOutNavigation />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
