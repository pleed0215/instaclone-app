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

type AuthPageProp = StackScreenProps<LoggedOutStackParamList, "Auth">;

const Input = styled.TextInput`
  border: 1px solid ${(props) => props.theme.color.border};
  background-color: ${(props) => props.theme.background.secondary};
  color: ${(props) => props.theme.color.primary};
  padding: 10px 8px;

  width: 100%;

  margin-bottom: 10px;
`;

export const AuthPage: React.FC<AuthPageProp> = ({ navigation, route }) => {
  const fuckRef = useRef<TextInput>(null);
  const onNext = () => {};
  return (
    <AuthLayout>
      <KeyboardAvoidingView behavior="padding" style={{ width: "100%" }}>
        <Input
          ref={fuckRef}
          caretHidden
          placeholder="What the fuck"
          returnKeyType="next"
          keyboardType="email-address"
          onSubmitEditing={onNext}
        />
        <Input placeholder="What the fuck" />
        <Input placeholder="What the fuck" />
        <Input placeholder="What the fuck" />
      </KeyboardAvoidingView>
      <ButtonInactivable disabled={false} onPress={() => {}} text="TeXT" />
    </AuthLayout>
  );
};
