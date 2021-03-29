import React from "react";
import styled from "styled-components/native";

interface BadgeProp {
  num: number;
  color: string;
  textColor: string;
}

const Container = styled.View<{ color: string }>`
  background-color: ${(props) => props.color};
  width: 25px;
  height: 25px;
  justify-content: center;
  align-items: center;
  right: 10px;
  border-radius: 13px;
  z-index: 99;
  position: absolute;
`;

const Text = styled.Text<{ textColor: string }>`
  color: ${(props) => props.textColor};
`;

export const Badge: React.FC<BadgeProp> = ({ num, color, textColor }) => (
  <Container color={color}>
    <Text textColor={textColor}>{num}</Text>
  </Container>
);
