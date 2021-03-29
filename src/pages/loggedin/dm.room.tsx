import { useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dimensions,
  ListRenderItem,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";

import styled, { css } from "styled-components/native";
import { GQL_SEE_ROOM } from "../../apollo/gqls";
import {
  QuerySeeRoom,
  QuerySeeRoomVariables,
  QuerySeeRoom_seeRoom_room_messages,
} from "../../codegen/QuerySeeRoom";
import { Avatar } from "../../components/Avatar";
import { ControlledInput } from "../../components/ControlledInput";
import { DismissKeyboard } from "../../components/DismissKeyboard";
import { ScreenLayout } from "../../components/ScreenLayout";
import { useMe } from "../../hooks/useMe";
import { useCustomTheme } from "../../theme/theme";
import { DMParamList } from "./direct.message";

const { width } = Dimensions.get("window");

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background.primary};
`;
const ChatWrapper = styled.View<{ isMe: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  margin-bottom: 5px;
  ${(props) =>
    props.isMe
      ? css`
          align-self: flex-end;
        `
      : css`
          align-self: flex-start;
        `};
`;

const UserWrapper = styled.View`
  align-items: center;
  justify-content: center;
  margin-right: 5px;
`;
const Username = styled.Text<{ isMe: boolean }>`
  width: ${width / 3}px;
  color: gray;
  text-align: ${(props) => (props.isMe ? "left" : "right")};
`;

const ChatTextWrapper = styled.View<{ isMe: boolean }>`
  width: ${width / 3}px;
  padding: 10px;
  background-color: ${(props) => (props.isMe ? "yellow" : "white")};
  border-radius: 5px;

  text-align: ${(props) => (props.isMe ? "right" : "left")};
`;
const ChatText = styled.Text`
  color: black;
`;

interface ChatProp {
  payload: string;
}

export const DMRoomPage: React.FC<StackScreenProps<DMParamList, "DMRoom">> = ({
  navigation,
  route,
}) => {
  const limit = 10;
  const { data: me } = useMe();
  const {
    params: { roomId },
  } = route;
  const [offset, setOffset] = useState(limit);
  const [fetching, setFetching] = useState(false);
  const { data, loading, refetch, fetchMore } = useQuery<
    QuerySeeRoom,
    QuerySeeRoomVariables
  >(GQL_SEE_ROOM, { variables: { input: { roomId }, offset, limit } });
  const [refreshing, setRefreshing] = useState(false);
  const { control, formState, getValues } = useForm<ChatProp>({
    mode: "onChange",
    defaultValues: { payload: "" },
  });
  const theme = useCustomTheme();

  const renderItem: ListRenderItem<QuerySeeRoom_seeRoom_room_messages> = ({
    item,
    index,
  }) => {
    const isMe = item.user.id === me?.seeMe.id;

    return (
      <ChatWrapper isMe={isMe}>
        <Avatar size={30} uri={item.user.avatar} color="gray" />
        <UserWrapper>
          <Username isMe={isMe}>
            {item.user.username} / {item.createdAt}
          </Username>
          <ChatTextWrapper isMe={isMe}>
            <ChatText>{item.payload}</ChatText>
          </ChatTextWrapper>
        </UserWrapper>
      </ChatWrapper>
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch({ input: { roomId }, offset: 0, limit });
    setRefreshing(false);
  };

  const onEndReached = async () => {
    setFetching(true);
    await fetchMore({
      variables: {
        input: { roomId },
        offset: data?.seeRoom.room?.messages.length,
        limit,
      },
    });
    setFetching(false);
  };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior="height"
        style={{ flex: 1 }}
        keyboardVerticalOffset={120}
      >
        {fetching && <ActivityIndicator color="gray" />}
        <DismissKeyboard>
          <FlatList
            style={{
              flex: 0.8,
              position: "relative",
              paddingHorizontal: 10,
              overflow: "hidden",
            }}
            inverted
            scrollsToTop
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEndReachedThreshold={-0.1}
            onEndReached={onEndReached}
            data={data?.seeRoom.room?.messages}
            keyExtractor={(item) => `Message: ${item.id}`}
            renderItem={renderItem}
          />
        </DismissKeyboard>
      </KeyboardAvoidingView>
      <View
        style={{
          flex: 0.1,
          backgroundColor: "rgba(50,50,50,0.2)",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        <ControlledInput
          name="payload"
          placeholder="메세지 보내기..."
          placeholderTextColor="gray"
          control={control}
          rules={{ required: true, minLength: 1 }}
          style={{ marginRight: 5, height: 20, width: width - 55 }}
        />
        <TouchableOpacity>
          <Ionicons
            name="paper-plane-outline"
            size={23}
            color={theme.color.primary}
          />
        </TouchableOpacity>
      </View>
    </Container>
  );
};
