import { StackScreenProps } from "@react-navigation/stack";
import React from "react";

import { TouchableOpacity } from "react-native-gesture-handler";
import { LoggedOutStackParamList } from "../routers/stacks";
import styled from "styled-components/native";

import { ButtonInactivable } from "../components/ButtonInactivable";
import { AuthLayout } from "../components/AuthLayout";

const CreateAccountText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;

const LoginText = styled.Text`
  color: ${(props) => props.theme.color.link};
  font-weight: 600;
`;

export const WelcomePage: React.FC<
  StackScreenProps<LoggedOutStackParamList, "Welcome">
> = ({ navigation, route }) => {
  const goToAuth = (isCreating: boolean) =>
    navigation.navigate("Auth", { isCreating });
  return (
    <AuthLayout>
      <ButtonInactivable onPress={() => goToAuth(true)} text="계정 만들기" />
      <TouchableOpacity onPress={() => goToAuth(false)}>
        <LoginText>로그인</LoginText>
      </TouchableOpacity>
    </AuthLayout>
  );
};
