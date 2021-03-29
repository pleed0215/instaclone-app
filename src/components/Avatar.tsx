import { Ionicons } from "@expo/vector-icons";
import React from "react";
import styled from "styled-components/native";

interface AvatarProp {
  size: number;
  color: string;
  uri?: string | null;
}

const UserAvatar = styled.Image<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => Math.ceil(props.size / 2)}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.color.border};
  margin-right: 10px;
`;
const AvatarEmpty = styled.View<{ size: number }>`
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: ${(props) => Math.ceil(props.size / 2)}px;
  border-width: 1px;
  border-color: ${(props) => props.theme.color.border};
  margin-right: 10px;
  background-color: rgb(190, 190, 190);
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const Avatar: React.FC<AvatarProp> = ({ size, color, uri }) => {
  return uri ? (
    <UserAvatar source={{ uri }} size={size} />
  ) : (
    <AvatarEmpty size={size}>
      <Ionicons name={"person"} color={color} size={size - 8} />
    </AvatarEmpty>
  );
};
