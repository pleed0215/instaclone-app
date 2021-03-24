import React from "react";
import { ActivityIndicator, View } from "react-native";
import styled from "styled-components/native";
import { useCustomTheme } from "../theme/theme";

interface ScreenLayoutProp {
  loading: boolean;
}

const SView = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background.primary};
  align-items: center;
  justify-content: center;
`;

export const ScreenLayout: React.FC<ScreenLayoutProp> = ({
  loading,
  children,
}) => {
  const theme = useCustomTheme();
  return (
    <SView>
      {loading ? (
        <ActivityIndicator color={theme.color.primary} size="small" />
      ) : (
        <>{children}</>
      )}
    </SView>
  );
};
