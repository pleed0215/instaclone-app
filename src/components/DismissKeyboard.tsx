import React from "react";
import { Keyboard, Platform } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

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
        flex: 0.5,
        backgroundColor: "red",
      }}
    >
      {children}
    </TouchableWithoutFeedback>
  );
};
