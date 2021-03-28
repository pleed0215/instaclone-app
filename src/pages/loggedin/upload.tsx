import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { LoggedInWrapperScreenParam, UploadTabNav } from "../../routers/navs";
import { useCustomTheme } from "../../theme/theme";
import { SelectPhotoPage } from "./select.photo";
import { TakePhotoPage } from "./take.photo";

const SView = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background.primary};
  align-items: center;
  justify-content: center;
`;

const SText = styled.Text`
  color: ${(props) => props.theme.color.primary};
`;

const Stack = createStackNavigator();

export const UploadPage: React.FC<LoggedInWrapperScreenParam<"Upload">> = ({
  navigation,
  route,
}) => {
  const theme = useCustomTheme();

  return (
    <UploadTabNav.Navigator
      tabBarPosition="bottom"
      tabBarOptions={{
        style: {
          backgroundColor: theme.background.primary,
          height: 70,
          justifyContent: "flex-start",
        },
        activeTintColor: theme.color.link,
        inactiveTintColor: theme.color.primary,
        indicatorStyle: {
          backgroundColor: theme.color.link,
          marginBottom: 25,
          top: 0,
        },
      }}
    >
      <UploadTabNav.Screen name="Select">
        {() => (
          <Stack.Navigator>
            <Stack.Screen
              name="Select"
              component={SelectPhotoPage}
              options={{ headerTitle: "사진 가져오기" }}
            />
          </Stack.Navigator>
        )}
      </UploadTabNav.Screen>
      <UploadTabNav.Screen name="Take">
        {() => (
          <Stack.Navigator
            screenOptions={{
              headerBackTitleVisible: false,
              headerShown: false,
              headerTintColor: theme.color.primary,
              headerStyle: {
                backgroundColor: theme.background.primary,
                shadowOpacity: 0.3,
              },
            }}
          >
            <Stack.Screen
              name="Select"
              component={TakePhotoPage}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        )}
      </UploadTabNav.Screen>
    </UploadTabNav.Navigator>
  );
};
