import { StackScreenProps } from "@react-navigation/stack";
import React from "react";

import { LoggedOutStackParamList } from "../routers/navs";
import styled from "styled-components/native";

import { ButtonInactivable } from "../components/ButtonInactivable";
import { AuthLayout } from "../components/AuthLayout";
import { TouchableOpacity } from "react-native";

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
      <ButtonInactivable
        fullWidth
        onPress={() => goToAuth(true)}
        text="계정 만들기"
      />
      <TouchableOpacity onPress={() => goToAuth(false)}>
        <LoginText>로그인</LoginText>
      </TouchableOpacity>
    </AuthLayout>
  );
};
