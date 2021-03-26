import { Ionicons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dimensions, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { ControlledInput } from "../../components/ControlledInput";
import { DismissKeyboard } from "../../components/DismissKeyboard";
import { LoggedInNavParamList } from "../../routers/navs";

const { width } = Dimensions.get("window");

const SView = styled.View`
  background-color: ${(props) => props.theme.background.primary};
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const SText = styled.Text`
  color: ${(props) => props.theme.color.primary};
`;

const TextInputWrapper = styled.View`
  position: relative;
  width: ${(width * 2) / 3}px;
  flex-direction: row;
  align-items: center;
`;

const TextInput = styled(ControlledInput)`
  width: ${(width * 2) / 3}px;
  padding: 5px 10px 5px 30px;
  border: 1px solid ${(props) => props.theme.color.border};
  border-radius: 5px;
`;

type SearchPageProp = StackScreenProps<LoggedInNavParamList, "Search">;
interface FormProp {
  term: string;
}

export const SearchPage: React.FC<SearchPageProp> = ({ navigation, route }) => {
  const { register, setValue, getValues, control } = useForm<FormProp>({
    defaultValues: { term: "" },
  });
  const SearchBox = () => (
    <TextInputWrapper>
      <Ionicons
        name="search"
        size={14}
        style={{
          position: "absolute",
          left: 10,
          top: 8,
          color: "gray",
          zIndex: 20,
        }}
      />
      <TextInput
        name="term"
        control={control}
        placeholder="Search"
        autoCapitalize="none"
        returnKeyType="search"
        autoCorrect={false}
        onSubmitEditing={() => console.log(getValues())}
      />
    </TextInputWrapper>
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
