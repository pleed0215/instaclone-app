import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { Text, View } from "react-native";
import { DMParamList } from "./direct.message";

export const DMRoomPage: React.FC<StackScreenProps<DMParamList, "DMRoom">> = ({
  navigation,
  route,
}) => {
  return (
    <View>
      <Text>helll</Text>
    </View>
  );
};
