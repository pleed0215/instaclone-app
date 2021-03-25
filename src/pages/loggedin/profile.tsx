import React, { useEffect } from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";
import { LoggedInScreenParam } from "../../routers/navs";

const SView = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background.primary};
  align-items: center;
  justify-content: center;
`;

const SText = styled.Text`
  color: ${(props) => props.theme.color.primary};
`;

export const ProfilePage: React.FC<LoggedInScreenParam<"Profile">> = ({
  navigation,
  route: {
    params: { username, id },
  },
}) => {
  useEffect(() => {
    navigation.setOptions({ title: `${username}'s Profile` });
  }, []);
  return (
    <SView>
      <SText>Profile</SText>
    </SView>
  );
};
