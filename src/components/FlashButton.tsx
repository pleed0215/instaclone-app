import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import React from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import styled from "styled-components/native";

interface FlashButtonProp {
  value: number;
  setValue: React.Dispatch<number>;
}

const Container = styled.View`
  height: 26px;
  flex-direction: row;
  border-radius: 3px;
  overflow: hidden;
`;

export const FlashButton: React.FC<FlashButtonProp> = ({ value, setValue }) => {
  return (
    <Container>
      <TouchableWithoutFeedback
        onPress={() => setValue(Camera.Constants.FlashMode.off)}
      >
        <Ionicons
          name="flash-off"
          size={22}
          color="black"
          style={{
            backgroundColor:
              value === Camera.Constants.FlashMode.off ? "gold" : "white",
            marginRight: 1,
            padding: 2,
          }}
        />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => setValue(Camera.Constants.FlashMode.on)}
      >
        <Ionicons
          name="flash"
          size={22}
          color="black"
          style={{
            backgroundColor:
              value === Camera.Constants.FlashMode.on ? "gold" : "white",
            marginRight: 1,
            padding: 2,
          }}
        />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => setValue(Camera.Constants.FlashMode.auto)}
      >
        <Ionicons
          name="flashlight"
          size={22}
          color="black"
          style={{
            backgroundColor:
              value === Camera.Constants.FlashMode.auto ? "gold" : "white",
            padding: 2,
          }}
        />
      </TouchableWithoutFeedback>
    </Container>
  );
};
