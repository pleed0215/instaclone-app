import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LoggedInWrapperParamList } from "../../routers/navs";
import styled from "styled-components/native";
import { useForm } from "react-hook-form";
import { ControlledInput } from "../../components/ControlledInput";
import { DismissKeyboard } from "../../components/DismissKeyboard";
import { useCustomTheme } from "../../theme/theme";
import { Ionicons } from "@expo/vector-icons";

const Container = styled.KeyboardAvoidingView`
  background-color: ${(props) => props.theme.background.primary};
  flex: 1;
`;

const Image = styled.Image`
  flex: 0.7;
  margin-bottom: 10px;
`;

interface CaptionForm {
  caption: string;
}

export const UploadFormPage: React.FC<
  StackScreenProps<LoggedInWrapperParamList, "UploadForm">
> = ({
  navigation,
  route: {
    params: { localUri },
  },
}) => {
  const { control, getValues, formState, handleSubmit } = useForm<CaptionForm>({
    mode: "onChange",
    defaultValues: { caption: "" },
  });
  const theme = useCustomTheme();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        loading ? (
          <ActivityIndicator color="gray" style={{ marginRight: 20 }} />
        ) : (
          <TouchableOpacity
            onPress={() => {
              if (formState.isValid) {
                alert("짜쟌");
              }
            }}
          >
            <Text
              style={{
                color:
                  formState.isValid && formState.isDirty
                    ? theme.color.link
                    : "gray",
                marginRight: 15,
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              올리기
            </Text>
          </TouchableOpacity>
        ),
      headerBackTitleVisible: false,
      headerBackImage: ({ tintColor }: { tintColor: string }) =>
        loading ? null : <Ionicons name="close" color={tintColor} size={28} />,
      headerTintColor: theme.color.primary,
      headerStyle: { backgroundColor: theme.background.primary },
    });
  }, [formState]);

  const onValid = () => {
    const { caption } = getValues();
    console.log(caption);
  };

  return (
    <DismissKeyboard>
      <Container behavior={Platform.OS === "android" ? "height" : "padding"}>
        <Image source={{ uri: localUri }} />
        <ControlledInput
          control={control}
          name="caption"
          placeholder="글 작성..."
          returnKeyType="send"
          onSubmitEditing={handleSubmit(onValid)}
          rules={{ required: true, minLength: 1 }}
        />
      </Container>
    </DismissKeyboard>
  );
};
