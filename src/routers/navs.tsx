import React from "react";

import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FeedPage } from "../pages/loggedin/feed";
import { MePage } from "../pages/loggedin/me";
import { ProfilePage } from "../pages/loggedin/profile";
import { PhotoPage } from "../pages/loggedin/photo";
import { SearchPage } from "../pages/loggedin/search";
import { NotificationPage } from "../pages/loggedin/notification";
import { useCustomTheme, useLogo } from "../theme/theme";
import { Image } from "react-native";
import { isRequiredArgument } from "graphql";

export type LoggedOutStackParamList = {
  Auth: { isCreating: boolean };
  Welcome: {};
};

export type LoggedInNavParamList = {
  Feed: {};
  Search: {};
  Profile: {};
  Notification: {};
  Me: {};
  Photo: {};
};

export const LoggedOutNav = createStackNavigator<LoggedOutStackParamList>();
export const LoggedInNav = createBottomTabNavigator<LoggedInNavParamList>();

const Stack = createStackNavigator<LoggedInNavParamList>();
interface StackNavFactoryProp {
  screenName: keyof LoggedInNavParamList;
}
export const StackNavFactory: React.FC<StackNavFactoryProp> = ({
  screenName,
}) => {
  const theme = useCustomTheme();
  const logo = useLogo();
  return (
    <Stack.Navigator
      headerMode="screen"
      screenOptions={{
        headerTintColor: theme.color.primary,
        headerStyle: {
          backgroundColor: theme.background.primary,
        },
      }}
    >
      {screenName === "Feed" && (
        <Stack.Screen
          name={screenName}
          component={FeedPage}
          options={{
            headerTitle: () => (
              <Image
                source={logo}
                style={{ maxHeight: 50 }}
                resizeMode="contain"
              />
            ),
          }}
        />
      )}
      {screenName === "Search" && (
        <Stack.Screen name={screenName} component={SearchPage} />
      )}
      {screenName === "Notification" && (
        <Stack.Screen name={screenName} component={NotificationPage} />
      )}
      {screenName === "Me" && (
        <Stack.Screen name={screenName} component={MePage} />
      )}
      <Stack.Screen name="Profile" component={ProfilePage} />
      <Stack.Screen name="Photo" component={PhotoPage} />
    </Stack.Navigator>
  );
};
