import { useQuery } from "@apollo/client";
import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import styled from "styled-components/native";
import { GQL_PHOTO_DETAIL } from "../../apollo/gqls";
import {
  QueryPhotoDetail,
  QueryPhotoDetailVariables,
} from "../../codegen/QueryPhotoDetail";
import { FeedPhoto } from "../../components/FeedPhoto";
import { ScreenLayout } from "../../components/ScreenLayout";
import { LoggedInNavParamList, LoggedInScreenParam } from "../../routers/navs";

const SView = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background.primary};
  align-items: center;
  justify-content: center;
`;

const SText = styled.Text`
  color: ${(props) => props.theme.color.primary};
`;

export const PhotoPage: React.FC<LoggedInScreenParam<"Photo">> = ({
  navigation,
  route,
}) => {
  const {
    params: { photoId },
  } = route;

  const { data: photo, loading } = useQuery<
    QueryPhotoDetail,
    QueryPhotoDetailVariables
  >(GQL_PHOTO_DETAIL, {
    variables: {
      input: {
        id: photoId,
      },
    },
  });

  return (
    <ScreenLayout loading={loading}>
      <View style={{ flex: 1 }}>
        {photo && photo.seePhotoDetail.photo && (
          <FeedPhoto photo={photo.seePhotoDetail.photo} />
        )}
      </View>
    </ScreenLayout>
  );
};
