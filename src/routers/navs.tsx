import React from "react";

import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps,
} from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { FeedPage } from "../pages/loggedin/feed";
import { MePage } from "../pages/loggedin/me";
import { ProfilePage } from "../pages/loggedin/profile";
import { PhotoPage } from "../pages/loggedin/photo";
import { SearchPage } from "../pages/loggedin/search";
import { NotificationPage } from "../pages/loggedin/notification";
import { useCustomTheme, useLogo } from "../theme/theme";
import { Image, TouchableOpacity } from "react-native";
import { LikesPage } from "../pages/loggedin/likes";
import { CommentsPage } from "../pages/loggedin/comments";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";

export type LoggedOutStackParamList = {
  Auth: { isCreating: boolean };
  Welcome: {};
};

export type LoggedInNavParamList = {
  Feed: {};
  Search: {};
  Profile: { username: string; id: number };
  Notification: {};
  Me: any;
  Photo: { photoId: number };
  Likes: { photoId: number };
  Comments: any;
  Camera: any;
};

export type LoggedInWrapperParamList = {
  LoggedIn: any;
  Upload: any;
  UploadForm: { localUri: string };
  DirectMessages: any;
};

export type UploadNavParamList = {
  Select: any;
  Take: any;
};

export type LoggedInScreenParam<
  RouteName extends keyof LoggedInNavParamList
> = StackScreenProps<LoggedInNavParamList, RouteName>;
export type LoggedInWrapperScreenParam<
  RouteName extends keyof LoggedInWrapperParamList
> = StackScreenProps<LoggedInWrapperParamList, RouteName>;

export const LoggedOutNav = createStackNavigator<LoggedOutStackParamList>();
export const LoggedInNav = createBottomTabNavigator<LoggedInNavParamList>();
export const LoggedInWrapper = createStackNavigator<LoggedInWrapperParamList>();
export const UploadTabNav = createMaterialTopTabNavigator<UploadNavParamList>();

const Stack = createStackNavigator<LoggedInNavParamList>();
interface StackNavFactoryProp {
  screenName: keyof LoggedInNavParamList;
}
export const StackNavFactory: React.FC<StackNavFactoryProp> = ({
  screenName,
}) => {
  const theme = useCustomTheme();
  const logo = useLogo();
  const navigation = useNavigation();
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
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("DirectMessages")}
                style={{ marginRight: 25 }}
              >
                <Ionicons
                  name="paper-plane-outline"
                  color={theme.color.primary}
                  size={25}
                />
              </TouchableOpacity>
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
      <Stack.Screen name="Likes" component={LikesPage} />
      <Stack.Screen name="Comments" component={CommentsPage} />
      <Stack.Screen name="Photo" component={PhotoPage} />
    </Stack.Navigator>
  );
};
