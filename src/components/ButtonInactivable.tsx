import React from "react";
import { ActivityIndicator, GestureResponderEvent } from "react-native";
import styled from "styled-components/native";

type ButtonInactivableProp = {
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  text: string;
  loading?: boolean;
};

type ButtonProp = {
  disabled?: boolean;
};

const Button = styled.TouchableOpacity<ButtonProp>`
  background-color: ${(props) => props.theme.background.button};
  padding: 15px 5px;
  border-radius: 5px;
  margin-bottom: 30px;
  width: 100%;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
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
  text,
}) => {
  return (
    <Button disabled={disabled} onPress={onPress}>
      {loading ? <ActivityIndicator color="white" /> : <Text>{text}</Text>}
    </Button>
  );
};
