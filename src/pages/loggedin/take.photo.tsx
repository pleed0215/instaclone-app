import React, { useEffect } from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";
import {
  LoggedInScreenParam,
  LoggedInWrapperScreenParam,
} from "../../routers/navs";

const SView = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background.primary};
  align-items: center;
  justify-content: center;
`;

const SText = styled.Text`
  color: ${(props) => props.theme.color.primary};
`;

export const TakePhotoPage: React.FC = () => {
  return (
    <SView>
      <SText>Take Photo</SText>
    </SView>
  );
};
