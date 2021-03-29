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
import { useMutation } from "@apollo/client";
import {
  MutationUploadPhoto,
  MutationUploadPhotoVariables,
} from "../../codegen/MutationUploadPhoto";
import { GQL_UPLOAD_PHOTO } from "../../apollo/gqls";
import { ReactNativeFile } from "extract-files";
import { useMe } from "../../hooks/useMe";

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
  const { data: me } = useMe();
  const [uploadPhoto] = useMutation<
    MutationUploadPhoto,
    MutationUploadPhotoVariables
  >(GQL_UPLOAD_PHOTO, {
    onCompleted: (data) => {
      setLoading(false);
      console.log(data);
      if (data.uploadPhoto.ok) {
        // @ts-ignore
        navigation.navigate("Feed");
      }
    },
    update: (cache, result) => {
      if (result.data?.uploadPhoto.ok) {
        cache.modify({
          id: "ROOT_QUERY",
          fields: {
            seeFeeds(prev) {
              return {
                ...prev,
                feeds: [result.data?.uploadPhoto.photo, ...prev.feeds],
              };
            },
          },
        });
      }
    },
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        loading ? (
          <ActivityIndicator color="gray" style={{ marginRight: 20 }} />
        ) : (
          <TouchableOpacity
            onPress={() => {
              if (formState.isValid) {
                onValid();
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
  }, [formState, loading]);

  const onValid = () => {
    const { caption } = getValues();
    const file = new ReactNativeFile({
      uri: localUri,
      name: `${me?.seeMe.username}.jpg`,
      type: "image/jpeg",
    });
    setLoading(true);
    uploadPhoto({
      variables: {
        input: {
          file,
          caption,
        },
      },
    });
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
