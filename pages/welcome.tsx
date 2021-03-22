import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LoggedOutStackParamList } from "../routers/stacks";

type WelcomeNavigationProp = StackNavigationProp<
  LoggedOutStackParamList,
  "Welcome"
>;

export const WelcomePage: React.FC<
  StackScreenProps<LoggedOutStackParamList, "Welcome">
> = ({ navigation, route }) => {
  return (
    <View>
      <Text>Welcome Page</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Auth", { isCreating: false })}
      >
        <View>
          <Text>Create Account</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
