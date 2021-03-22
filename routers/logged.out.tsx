import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { WelcomePage } from "../pages/welcome";
import { AuthPage } from "../pages/auth/auth";
import { LoggedOutStack } from "./stacks";

export const LoggedOutNavigation = () => {
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
      <LoggedOutStack.Screen name="Auth" component={AuthPage} />
    </LoggedOutStack.Navigator>
  );
};
