import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { Text, View } from "react-native";
import { LoggedOutStackParamList } from "../../routers/stacks";
import styled from "styled-components/native";
import { AuthLayout } from "../../components/AuthLayout";
import { ButtonInactivable } from "../../components/ButtonInactivable";

type AuthPageProp = StackScreenProps<LoggedOutStackParamList, "Auth">;

const Input = styled.TextInput`
  border: 1px solid ${(props) => props.theme.color.border};
  background-color: ${(props) => props.theme.background.secondary};
  color: ${(props) => props.theme.color.primary};
  padding: 10px 8px;
  &::placeholder {
    color: ${(props) => props.theme.color.secondary};
  }
  width: 100%;

  margin-bottom: 10px;
`;

export const AuthPage: React.FC<AuthPageProp> = ({ navigation, route }) => {
  return (
    <AuthLayout>
      <Input placeholder="What the fuck" />
      <Input placeholder="What the fuck" />
      <Input placeholder="What the fuck" />
      <Input placeholder="What the fuck" />
      <ButtonInactivable disabled={false} onPress={() => {}} text="TeXT" />
    </AuthLayout>
  );
};
