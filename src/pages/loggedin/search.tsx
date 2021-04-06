import { useLazyQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dimensions,
  ListRenderItem,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";

import styled from "styled-components/native";
import { GQL_SEARCH_PHOTO, GQL_SEARCH_USER } from "../../apollo/gqls";
import {
  QuerySearchPhotos,
  QuerySearchPhotosVariables,
  QuerySearchPhotos_searchPhotos,
} from "../../codegen/QuerySearchPhotos";
import {
  QuerySearchUser,
  QuerySearchUserVariables,
  QuerySearchUser_searchUser,
} from "../../codegen/QuerySearchUser";
import { ControlledInput } from "../../components/ControlledInput";
import { DismissKeyboard } from "../../components/DismissKeyboard";
import { ScreenLayout } from "../../components/ScreenLayout";
import { LoggedInNavParamList, LoggedInScreenParam } from "../../routers/navs";
import { getPluralText } from "../../util";
import { ProfileFollow } from "../../components/ProfileFollow";
import { FeedPhoto } from "../../components/FeedPhoto";
import { useCustomTheme } from "../../theme/theme";

const { width, height } = Dimensions.get("window");

const SView = styled.View`
  background-color: ${(props) => props.theme.background.primary};
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const TextResult = styled.Text`
  color: ${(props) => props.theme.color.primary};
  width: 100%;
  margin-left: 20px;
  padding: 10px 0px;
`;

const TextInputWrapper = styled.View`
  position: relative;
  width: ${(width * 2) / 3}px;
  flex-direction: row;
  align-items: center;
`;

const TextInput = styled(ControlledInput)`
  width: ${(width * 2) / 3}px;
  padding: 5px 10px 5px 30px;
  border: 1px solid ${(props) => props.theme.color.border};
  border-radius: 5px;
`;

const Image = styled.Image``;

interface FormProp {
  term: string;
}

export const SearchPage: React.FC<LoggedInScreenParam<"Search">> = ({
  navigation,
  route,
}) => {
  const { watch, getValues, control, formState } = useForm<FormProp>({
    defaultValues: { term: "" },
  });
  const imageWidth = Math.floor((width - 3) / 4);
  const imageHeight = imageWidth;
  const [page, setPage] = useState(1);
  const [
    searchPhoto,
    { loading: loadingSearchPhoto, data: photos },
  ] = useLazyQuery<QuerySearchPhotos, QuerySearchPhotosVariables>(
    GQL_SEARCH_PHOTO,
    {
      variables: { input: { keyword: watch("term"), offset: 0, limit: 10 } },
    }
  );
  const [
    searchUser,
    { loading: loadingSearchUser, data: users },
  ] = useLazyQuery<QuerySearchUser, QuerySearchUserVariables>(GQL_SEARCH_USER, {
    variables: { input: { keyword: watch("term"), offset: 0, limit: 10 } },
  });

  const onSearchSubmit = () => {
    searchPhoto();
    searchUser();
  };

  const SearchBox = () => (
    <TextInputWrapper>
      <Ionicons
        name="search"
        size={14}
        style={{
          position: "absolute",
          left: 10,
          top: 8,
          color: "gray",
          zIndex: 20,
        }}
      />
      <TextInput
        name="term"
        control={control}
        placeholder="Search"
        autoCapitalize="none"
        returnKeyType="search"
        autoCorrect={false}
        onSubmitEditing={onSearchSubmit}
      />
    </TextInputWrapper>
  );

  useEffect(() => {
    navigation.setOptions({
      headerTitle: SearchBox,
    });
  }, []);

  const renderUser: ListRenderItem<QuerySearchUser_searchUser> = ({ item }) => (
    <ProfileFollow user={item} />
  );

  const renderPhoto: ListRenderItem<QuerySearchPhotos_searchPhotos> = ({
    item,
    index,
  }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Photo", { photoId: item.id })}
    >
      <Image
        source={{ uri: item.file }}
        style={{
          width: imageWidth,
          height: imageHeight,
          ...(index % 4 !== 3 && { marginRight: 1 }),
        }}
      />
    </TouchableOpacity>
  );
  const theme = useCustomTheme();

  return (
    <DismissKeyboard>
      <ScreenLayout loading={loadingSearchPhoto || loadingSearchUser}>
        {photos && users && (
          <View
            style={{
              alignItems: "flex-start",
              flex: 1,
              justifyContent: "flex-start",
              width,
            }}
          >
            <TextResult>유저 검색 결과: '{getValues("term")}': </TextResult>
            {photos.searchPhotos.length > 0 && (
              <FlatList
                data={users.searchUser}
                renderItem={renderUser}
                keyExtractor={(item) => `User: ${item.username}`}
                style={{
                  borderWidth: 1,
                  borderColor: theme.color.border,
                  marginBottom: 20,
                  height: 0,
                }}
              />
            )}
            <TextResult>사진 검색 결과: '{getValues("term")}' : </TextResult>
            {users.searchUser && users.searchUser.length > 0 && (
              <FlatList
                data={photos.searchPhotos}
                numColumns={4}
                renderItem={renderPhoto}
                keyExtractor={(item) => `Photo: ${item.id}`}
                style={{ width }}
              />
            )}
          </View>
        )}
      </ScreenLayout>
    </DismissKeyboard>
  );
};
