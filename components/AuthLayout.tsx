import React from "react";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { useColorScheme } from "react-native-appearance";
import styled from "styled-components/native";

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
  width: 100%;
  height: 100%;
`;

export const AuthLayout: React.FC = ({ children }) => {
  const mode = useColorScheme();
  const onPress = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Container>
        <Logo
          resizeMode="contain"
          source={
            mode === "light"
              ? require("../assets/insta.png")
              : require("../assets/insta_dark.png")
          }
        />

        {children}
      </Container>
    </TouchableWithoutFeedback>
  );
};
