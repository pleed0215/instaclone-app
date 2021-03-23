import React from "react";
import { WelcomePage } from "../pages/welcome";
import { AuthPage } from "../pages/auth/auth";
import { LoggedOutNav } from "./navs";
import { useColorScheme } from "react-native-appearance";
import { darkTheme, lightTheme } from "../theme/theme";

export const LoggedOutNavigation = () => {
  const isDark = useColorScheme() === "dark";
  return (
    <LoggedOutNav.Navigator
      headerMode="screen"
      screenOptions={{ headerBackTitleVisible: false }}
      initialRouteName="Welcome"
    >
      <LoggedOutNav.Screen
        name="Welcome"
        component={WelcomePage}
        options={{ headerShown: false }}
      />
      <LoggedOutNav.Screen
        name="Auth"
        component={AuthPage}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: isDark
            ? darkTheme.color.primary
            : lightTheme.color.primary,
        }}
      />
    </LoggedOutNav.Navigator>
  );
};
