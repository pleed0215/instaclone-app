import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
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

type SearchPageProp = StackScreenProps<LoggedInNavParamList, "Search">;

export const SearchPage: React.FC<SearchPageProp> = ({ navigation, route }) => {
  return (
    <SView>
      <TouchableOpacity onPress={() => navigation.navigate("Photo", {})}>
        <SText>Photo</SText>
      </TouchableOpacity>
    </SView>
  );
};
