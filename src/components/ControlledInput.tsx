import React from "react";
import {
  Control,
  Controller,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { TextInputProps, TextInput } from "react-native";
import styled from "styled-components/native";

interface ControlledInputProp extends TextInputProps {
  control: Control;
  name: string;
  defaultValue?: string;
  rules?: Exclude<
    RegisterOptions,
    "valueAsNumber" | "valueAsDate" | "setValueAs"
  >;
  inputRef?: React.Ref<TextInput>;
  isError?: boolean;
}
const Input = styled.TextInput<{ isError?: boolean }>`
  border: 1px solid
    ${(props) => (props.isError === true ? "red" : props.theme.color.border)};
  background-color: ${(props) => props.theme.background.secondary};
  color: ${(props) => props.theme.color.primary};
  padding: 15px 8px;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 10px;
`;

export const ControlledInput: React.FC<ControlledInputProp> = ({
  control,
  name,
  defaultValue,
  inputRef,
  rules,
  ...rest
}) => (
  <Controller
    control={control}
    render={({ onChange, onBlur, value }) => (
      <Input
        onBlur={onBlur}
        onChangeText={(value) => onChange(value)}
        value={value}
        ref={inputRef}
        {...rest}
      />
    )}
    rules={rules}
    name={name}
    defaultValue={defaultValue}
  />
);
