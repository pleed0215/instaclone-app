import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import styled from "styled-components/native";
import { LoggedInNavParamList } from "../../routers/navs";

const SView = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background.primary};
  align-items: center;
  justify-content: center;
`;

const SText = styled.Text`
  color: ${(props) => props.theme.color.primary};
`;
type PhotoPageProp = StackScreenProps<LoggedInNavParamList, "Photo">;

export const PhotoPage: React.FC<PhotoPageProp> = ({ navigation, route }) => {
  return (
    <SView>
      <TouchableOpacity onPress={() => navigation.navigate("Profile", {})}>
        <SText>Profile</SText>
      </TouchableOpacity>
    </SView>
  );
};
