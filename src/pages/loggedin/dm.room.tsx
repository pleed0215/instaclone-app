import { gql, useMutation, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
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
import { GQL_SEE_ROOM, GQL_SEND_MESSAGE } from "../../apollo/gqls";
import {
  MutationSendMessage,
  MutationSendMessageVariables,
} from "../../codegen/MutationSendMessage";
import {
  QuerySeeRoom,
  QuerySeeRoomVariables,
  QuerySeeRoom_seeRoom,
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
  flex-direction: ${(props) => (props.isMe ? "row-reverse" : "row")};
  width: ${width - 20}px;
  align-items: center;
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
  width: ${width - 200}px;
  margin: 0px 5px;
  padding: 10px;
  background-color: ${(props) => (props.isMe ? "yellow" : "white")};
  border-radius: 5px;
`;
const ChatText = styled.Text<{ isMe: boolean }>`
  color: black;
  text-align: ${(props) => (props.isMe ? "right" : "left")};
`;

const ChatInput = styled.TextInput`
  width: ${width - 55}px;
  padding: 3px 5px;
  color: ${(props) => props.theme.color.primary};
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
  let targetId: number;
  const {
    params: { roomId },
  } = route;

  const [fetching, setFetching] = useState(false);
  const { data, loading, refetch, fetchMore } = useQuery<
    QuerySeeRoom,
    QuerySeeRoomVariables
  >(GQL_SEE_ROOM, {
    variables: { input: { roomId }, offset: 0, limit },
    onCompleted: (data) => {
      if (!targetId) {
        const targetUser = data.seeRoom.room?.participants.find(
          (user) => user.id !== me?.seeMe.id
        );
        if (targetUser) {
          targetId = targetUser.id;
        }
      }
    },
  });
  const [sendMessage] = useMutation<
    MutationSendMessage,
    MutationSendMessageVariables
  >(GQL_SEND_MESSAGE, {
    update(cache, result) {
      cache.modify({
        id: `Room:${roomId}`,
        fields: {
          messages(prev, details) {
            return [
              { ...result.data?.sendMessage.message, isRead: true },
              ...prev,
            ];
          },
          latestMessage(prev) {
            return result.data?.sendMessage.message;
          },
        },
      });
    },
  });

  const [refreshing, setRefreshing] = useState(false);
  const {
    register,
    formState,
    getValues,
    handleSubmit,
    setValue,
    watch,
  } = useForm<ChatProp>({
    mode: "onChange",
    defaultValues: { payload: "" },
  });
  const theme = useCustomTheme();

  useEffect(() => {
    register("payload", { required: true, minLength: 1 });
  }, []);

  const renderItem: ListRenderItem<QuerySeeRoom_seeRoom_room_messages> = ({
    item,
    index,
  }) => {
    const isMe = item.user.id === me?.seeMe.id;

    return (
      <ChatWrapper isMe={isMe}>
        <View style={{}}>
          <UserWrapper>
            <Username isMe={isMe}>
              {item.user.username} / {item.createdAt}
            </Username>
          </UserWrapper>
          <View style={{ flexDirection: isMe ? "row-reverse" : "row" }}>
            <Avatar size={30} uri={item.user.avatar} color="gray" />
            <ChatTextWrapper isMe={isMe}>
              <ChatText isMe={isMe}>{item.payload}</ChatText>
            </ChatTextWrapper>
          </View>
        </View>
      </ChatWrapper>
    );
  };

  const onRefresh = async () => {
    const maxLength = data?.seeRoom.room
      ? data?.seeRoom.room?.messages.length > 50
        ? 50
        : data?.seeRoom.room?.messages.length
      : 10;
    setRefreshing(true);
    await refetch({ input: { roomId }, offset: 0, limit: maxLength });
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

  const onSendMessage = () => {
    sendMessage({
      variables: {
        input: {
          userId: targetId,
          roomId,
          payload: getValues("payload"),
        },
      },
    });
    setValue("payload", "");
  };

  return (
    <Container>
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={120}
      >
        {fetching && <ActivityIndicator color="gray" />}
        <DismissKeyboard>
          <FlatList
            style={{
              flex: 0.8,
              position: "relative",
              padding: 10,
              overflow: "hidden",
            }}
            inverted
            scrollsToTop
            refreshing={refreshing}
            ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
            onRefresh={onRefresh}
            onEndReachedThreshold={-0.1}
            onEndReached={onEndReached}
            data={data?.seeRoom.room?.messages}
            keyExtractor={(item) => `Message: ${item.id}`}
            renderItem={renderItem}
          />
        </DismissKeyboard>

        <View
          style={{
            flex: 0.1,
            backgroundColor: "rgba(50,50,50,0.2)",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <ChatInput
            placeholder="메세지 보내기..."
            returnKeyType="send"
            onChangeText={(text) => setValue("payload", text)}
            value={watch("payload")}
            onSubmitEditing={handleSubmit(onSendMessage)}
          />
          <TouchableOpacity onPress={onEndReached}>
            <Ionicons
              name="paper-plane-outline"
              size={23}
              color={theme.color.primary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};
