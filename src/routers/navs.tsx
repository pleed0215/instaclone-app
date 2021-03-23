import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

export type LoggedOutStackParamList = {
  Auth: { isCreating: boolean };
  Welcome: {};
};

export type LoggedInStackParamList = {
  Feed: {};
  Search: {};
  Profile: {};
  Notification: {};
};
export const LoggedOutNav = createStackNavigator<LoggedOutStackParamList>();
export const LoggedInNav = createBottomTabNavigator<LoggedInStackParamList>();
