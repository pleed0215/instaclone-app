import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import React, { useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { LoggedOutStackParamList } from "../../routers/stacks";
import styled from "styled-components/native";
import { AuthLayout } from "../../components/AuthLayout";
import { ButtonInactivable } from "../../components/ButtonInactivable";
import { Controller, useForm } from "react-hook-form";
import { ControlledInput } from "../../components/ControlledInput";

type AuthPageProp = StackScreenProps<LoggedOutStackParamList, "Auth">;
type FormProp = {
  email: string;
  username: string;
  password: string;
  password2: string;
  firstName: string;
};

const Input = styled.TextInput`
  border: 1px solid ${(props) => props.theme.color.border};
  background-color: ${(props) => props.theme.background.secondary};
  color: ${(props) => props.theme.color.primary};
  padding: 15px 8px;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 10px;
`;

export const AuthPage: React.FC<AuthPageProp> = ({ navigation, route }) => {
  const {
    params: { isCreating },
  } = route;
  const usernameRef = useRef<TextInput>(null),
    emailRef = useRef<TextInput>(null);
  const {
    control,
    getValues,
    formState,
    errors,
    handleSubmit,
  } = useForm<FormProp>();

  const onNext = (nextRef: React.RefObject<TextInput>) => {
    nextRef?.current?.focus();
  };

  return (
    <AuthLayout>
      <ControlledInput
        name="email"
        inputRef={emailRef}
        autoCapitalize="none"
        control={control}
        placeholder="이메일 주소"
        rules={{
          required: {
            value: true,
            message: "이메일 주소를 입력해주세요",
          },
        }}
        returnKeyType="next"
        onSubmitEditing={() => onNext(usernameRef)}
      />
      <ControlledInput
        inputRef={usernameRef}
        name="username"
        autoCapitalize="none"
        control={control}
        placeholder="사용자 이름"
      />

      <ButtonInactivable
        disabled={false}
        onPress={() => {
          console.log(getValues());
        }}
        text="TeXT"
      />
    </AuthLayout>
  );
};
