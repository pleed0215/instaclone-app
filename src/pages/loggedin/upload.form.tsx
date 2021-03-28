import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { Text, View } from "react-native";
import { LoggedInWrapperParamList } from "../../routers/navs";

export const UploadFormPage: React.FC<
  StackScreenProps<LoggedInWrapperParamList, "UploadForm">
> = ({ navigation, route }) => {
  console.log(route);
  return (
    <View>
      <Text>Hello</Text>
    </View>
  );
};
