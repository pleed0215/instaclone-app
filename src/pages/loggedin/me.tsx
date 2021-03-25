import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { makeLogout } from "../../apollo/vars";
import { useMe } from "../../hooks/useMe";
import { LoggedInScreenParam } from "../../routers/navs";

const SView = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background.primary};
  align-items: center;
  justify-content: center;
`;

const SText = styled.Text`
  color: ${(props) => props.theme.color.primary};
  border: 1px solid ${(props) => props.theme.color.border};
  background-color: ${(props) => props.theme.background.secondary};
  padding: 10px;
  border-radius: 4px;
`;

export const MePage: React.FC<LoggedInScreenParam<"Me">> = ({
  navigation,
  route,
}) => {
  const { data: me } = useMe();
  useEffect(() => {
    navigation.setOptions({
      title: me?.seeMe.username,
    });
  }, []);
  return (
    <SView>
      <TouchableOpacity onPress={() => makeLogout()}>
        <SText>Log out</SText>
      </TouchableOpacity>
    </SView>
  );
};
