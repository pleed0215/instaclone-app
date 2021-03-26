import React from "react";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";

export const DismissKeyboard: React.FC = ({ children }) => {
  const onPress = () => {
    if (Platform.OS !== "web") {
      Keyboard.dismiss();
    }
  };
  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      style={{
        flex: 1,
      }}
    >
      {children}
    </TouchableWithoutFeedback>
  );
};
