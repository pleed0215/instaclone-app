import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { WelcomePage } from "../pages/welcome";
import { AuthPage } from "../pages/auth/auth";
import { LoggedOutStack } from "./stacks";
import { useColorScheme } from "react-native-appearance";
import { darkTheme, lightTheme } from "../theme/theme";

export const LoggedOutNavigation = () => {
  const isDark = useColorScheme() === "dark";
  return (
    <LoggedOutStack.Navigator
      headerMode="screen"
      screenOptions={{ headerBackTitleVisible: false }}
      initialRouteName="Welcome"
    >
      <LoggedOutStack.Screen
        name="Welcome"
        component={WelcomePage}
        options={{ headerShown: false }}
      />
      <LoggedOutStack.Screen
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
    </LoggedOutStack.Navigator>
  );
};
