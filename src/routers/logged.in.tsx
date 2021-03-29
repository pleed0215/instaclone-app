import React from "react";
import { useCustomTheme } from "../theme/theme";
import { LoggedInNav, LoggedInWrapper, StackNavFactory } from "./navs";
import { Ionicons } from "@expo/vector-icons";
import { PhotoPage } from "../pages/loggedin/photo";
import { useMe } from "../hooks/useMe";
import styled from "styled-components/native";
import { UploadPage } from "../pages/loggedin/upload";
import { View } from "react-native";
import { UploadFormPage } from "../pages/loggedin/upload.form";
import { DirectMessages } from "../pages/loggedin/direct.message";

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
        name="Camera"
        component={View}
        listeners={({ navigation }) => {
          return {
            tabPress: (e) => {
              e.preventDefault();
              navigation.navigate("Upload");
            },
          };
        }}
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

export const LoggedInWrapperNavigation = () => {
  const theme = useCustomTheme();
  return (
    <LoggedInWrapper.Navigator mode="modal">
      <LoggedInWrapper.Screen
        name="LoggedIn"
        options={{ headerShown: false }}
        component={LoggedInNavigation}
      />
      <LoggedInWrapper.Screen
        name="Upload"
        options={{ headerShown: false }}
        component={UploadPage}
      />
      <LoggedInWrapper.Screen
        name="UploadForm"
        options={{
          headerTintColor: theme.color.primary,
          title: "업로드",
          headerBackTitleVisible: false,
          headerBackImage: ({ tintColor }) => (
            <Ionicons name="close" color={tintColor} size={20} />
          ),
          headerStyle: {
            backgroundColor: theme.background.primary,
          },
        }}
        component={UploadFormPage}
      />
      <LoggedInWrapper.Screen
        name="DirectMessages"
        component={DirectMessages}
        options={{ headerShown: false }}
      />
    </LoggedInWrapper.Navigator>
  );
};
