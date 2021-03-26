import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { Keyboard, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { DismissKeyboard } from "../../components/DismissKeyboard";
import { LoggedInNavParamList } from "../../routers/navs";

const SView = styled.View`
  background-color: ${(props) => props.theme.background.primary};
  align-items: center;
  justify-content: center;
`;

const SText = styled.Text`
  color: ${(props) => props.theme.color.primary};
`;

type SearchPageProp = StackScreenProps<LoggedInNavParamList, "Search">;

export const SearchPage: React.FC<SearchPageProp> = ({ navigation, route }) => {
  const SearchBox = () => (
    <TextInput
      style={{ width: 100 }}
      placeholder="Search"
      placeholderTextColor="white"
      returnKeyType="search"
    />
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: SearchBox,
    });
  }, []);
  return (
    <DismissKeyboard>
      <SView>
        <TouchableOpacity onPress={() => navigation.navigate("Photo", {})}>
          <SText>Photo</SText>
        </TouchableOpacity>
      </SView>
    </DismissKeyboard>
  );
};
