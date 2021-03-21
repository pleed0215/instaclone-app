import AppLoading from "expo-app-loading";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  const [loading, setLoading] = useState(true);

  const preload = async () => {
    const images = [
      require('./assets/')
    ]
  }

  if (loading) {
    // @ts-ignore
    return <AppLoading onError={console.warn} onFinish={()=>setLoading(false)}/>;
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
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
