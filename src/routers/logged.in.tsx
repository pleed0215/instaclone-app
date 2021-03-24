import React from "react";
import { FeedPage } from "../pages/loggedin/feed";
import { NotificationPage } from "../pages/loggedin/notification";
import { ProfilePage } from "../pages/loggedin/profile";
import { SearchPage } from "../pages/loggedin/search";
import { useCustomTheme } from "../theme/theme";
import { LoggedInNav, StackNavFactory } from "./navs";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { PhotoPage } from "../pages/loggedin/photo";

export const LoggedInNavigation = () => {
  const theme = useCustomTheme();
  return (
    <LoggedInNav.Navigator
      tabBarOptions={{
        style: {
          backgroundColor: theme.background.secondary,
          borderTopColor: theme.color.border,
        },
        showLabel: false,

        activeTintColor: theme.color.link,
        inactiveTintColor: theme.color.primary,
      }}
    >
      <LoggedInNav.Screen
        name="Feed"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={focused ? size + 4 : size}
            />
          ),
          tabBarLabel: "Home",
        }}
      >
        {() => <StackNavFactory screenName="Feed" />}
      </LoggedInNav.Screen>
      <LoggedInNav.Screen
        name="Search"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              color={color}
              size={focused ? size + 4 : size}
            />
          ),
        }}
      >
        {() => <StackNavFactory screenName="Search" />}
      </LoggedInNav.Screen>
      <LoggedInNav.Screen
        name="Photo"
        component={PhotoPage}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "camera" : "camera-outline"}
              color={color}
              size={focused ? size + 4 : size}
            />
          ),
        }}
      />
      <LoggedInNav.Screen
        name="Notification"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              color={color}
              size={focused ? size + 4 : size}
            />
          ),
        }}
      >
        {() => <StackNavFactory screenName="Notification" />}
      </LoggedInNav.Screen>
      <LoggedInNav.Screen
        name="Me"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={focused ? size + 4 : size}
            />
          ),
        }}
      >
        {() => <StackNavFactory screenName="Me" />}
      </LoggedInNav.Screen>
    </LoggedInNav.Navigator>
  );
};
