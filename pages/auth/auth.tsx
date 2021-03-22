import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { Text, View } from "react-native";
import { LoggedOutStackParamList } from "../../routers/stacks";

type AuthPageProp = StackScreenProps<LoggedOutStackParamList, "Auth">;

export const AuthPage: React.FC<AuthPageProp> = ({ navigation, route }) => {
  return (
    <View>
      <Text>Hello, Auth Page</Text>
    </View>
  );
};
