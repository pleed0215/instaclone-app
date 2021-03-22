import { createStackNavigator } from "@react-navigation/stack";

export type LoggedOutStackParamList = {
  Auth: { isCreating: boolean };
  Welcome: {};
};

export type LoggedInStackParamList = {
  Auth: { isCreating: boolean };
  Welcome: {};
};
export const LoggedOutStack = createStackNavigator<LoggedOutStackParamList>();
export const LoggedInStack = createStackNavigator<LoggedInStackParamList>();
