import React from "react";
import { useCustomTheme } from "../theme/theme";
import { LoggedInNav, StackNavFactory } from "./navs";
import { Ionicons } from "@expo/vector-icons";
import { PhotoPage } from "../pages/loggedin/photo";
import { useMe } from "../hooks/useMe";
import styled from "styled-components/native";

const Avatar = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 15px;
`;

export const LoggedInNavigation = () => {
  const theme = useCustomTheme();
  const { data: me } = useMe();
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
          tabBarIcon: ({ focused, color, size }) =>
            me?.seeMe.avatar ? (
              <Avatar
                source={{ uri: me.seeMe.avatar }}
                style={{
                  ...(focused && {
                    borderWidth: 2,
                    borderColor: theme.color.border,
                  }),
                }}
              />
            ) : (
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
