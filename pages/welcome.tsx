import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { Text, View, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LoggedOutStackParamList } from "../routers/stacks";
import styled from "styled-components/native";
import { useColorScheme } from "react-native-appearance";

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background.primary};
  color: ${(props) => props.theme.color.primary};
  justify-content: center;
  align-items: center;
  padding: 0px 30px;
`;

const Logo = styled.Image`
  max-width: 300px;
  max-height: 120px;
`;

const CreateAccountView = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.background.button};
  padding: 10px 5px;
  border-radius: 5px;
  margin-bottom: 30px;
  width: 100%;
`;

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
  const mode = useColorScheme();
  const goToAuth = (isCreating: boolean) =>
    navigation.navigate("Auth", { isCreating });
  return (
    <Container>
      <Logo
        resizeMode="contain"
        source={
          mode === "light"
            ? require("../assets/insta.png")
            : require("../assets/insta_dark.png")
        }
      />

      <CreateAccountView onPress={() => goToAuth(true)}>
        <CreateAccountText>계정 만들기</CreateAccountText>
      </CreateAccountView>

      <TouchableOpacity onPress={() => goToAuth(false)}>
        <LoginText>로그인</LoginText>
      </TouchableOpacity>
    </Container>
  );
};
