import React from "react";
import { ActivityIndicator, GestureResponderEvent } from "react-native";
import styled, { css } from "styled-components/native";

type ButtonInactivableProp = {
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  text: string;
  loading?: boolean;
};

type ButtonProp = {
  disabled?: boolean;
  fullWidth?: boolean;
};

const Button = styled.TouchableOpacity<ButtonProp>`
  background-color: ${(props) => props.theme.background.button};
  padding: 15px 5px;
  border-radius: 5px;
  margin-bottom: 30px;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  align-self: center;

  ${(props) =>
    props.fullWidth &&
    css`
      width: 100%;
    `}
`;

const Text = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;

export const ButtonInactivable: React.FC<ButtonInactivableProp> = ({
  onPress,
  disabled,
  loading,
  fullWidth,
  text,
}) => {
  return (
    <Button disabled={disabled} onPress={onPress} fullWidth={fullWidth}>
      {loading ? <ActivityIndicator color="white" /> : <Text>{text}</Text>}
    </Button>
  );
};
