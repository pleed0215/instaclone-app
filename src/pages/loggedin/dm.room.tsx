import {
  gql,
  useApolloClient,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
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
import {
  GQL_FETCH_MESSAGE,
  GQL_SEE_ROOM,
  GQL_SEND_MESSAGE,
  GQL_WAIT_MESSAGE,
} from "../../apollo/gqls";
import {
  MutationSendMessage,
  MutationSendMessageVariables,
} from "../../codegen/MutationSendMessage";
import {
  QueryFetchMessage,
  QueryFetchMessageVariables,
  QueryFetchMessage_fetchAndReadMessages,
  QueryFetchMessage_fetchAndReadMessages_messages,
} from "../../codegen/QueryFetchMessage";
import {
  QuerySeeRoom,
  QuerySeeRoomVariables,
} from "../../codegen/QuerySeeRoom";
import {
  SubWaitMessage,
  SubWaitMessageVariables,
  SubWaitMessage_waitNewMessage,
} from "../../codegen/SubWaitMessage";
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
  const { data, loading } = useQuery<QuerySeeRoom, QuerySeeRoomVariables>(
    GQL_SEE_ROOM,
    {
      variables: { input: { roomId } },
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
    }
  );
  const {
    data: messages,
    loading: messageFetching,
    refetch,
    fetchMore,
  } = useQuery<QueryFetchMessage, QueryFetchMessageVariables>(
    GQL_FETCH_MESSAGE,
    {
      variables: {
        input: {
          roomId,
          cursorId: 0,
        },
      },
    }
  );
  const [sendMessage] = useMutation<
    MutationSendMessage,
    MutationSendMessageVariables
  >(GQL_SEND_MESSAGE, {
    update(cache, result) {
      cache.modify({
        id: `Room:${roomId}`,
        fields: {
          latestMessage(prev) {
            return result.data?.sendMessage.message;
          },
        },
      });
      cache.modify({
        id: "ROOT_QUERY",
        fields: {
          fetchAndReadMessages(prev: QueryFetchMessage_fetchAndReadMessages) {
            const prevMessages = prev.messages ? prev.messages.slice(0) : [];
            if (
              prevMessages.some(
                (m) => m.id === result.data?.sendMessage.message?.id
              )
            ) {
              return prev;
            } else {
              return {
                ...prev,
                messages: [result.data?.sendMessage.message, ...prevMessages],
              };
            }
          },
        },
      });
    },
  });
  const { error } = useSubscription<SubWaitMessage, SubWaitMessageVariables>(
    GQL_WAIT_MESSAGE,
    {
      variables: { roomId },
      onSubscriptionData: ({ client, subscriptionData }) => {
        client.cache.modify({
          id: "ROOT_QUERY",
          fields: {
            fetchAndReadMessages(prev: QueryFetchMessage_fetchAndReadMessages) {
              const prevMessages = prev.messages ? prev.messages.slice(0) : [];

              if (
                prevMessages.some(
                  (m) => m.id === subscriptionData.data?.waitNewMessage?.id
                )
              ) {
                return prev;
              } else {
                return {
                  ...prev,
                  messages: [
                    subscriptionData.data?.waitNewMessage,
                    ...prevMessages,
                  ],
                };
              }
            },
          },
        });
      },
    }
  );

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

  const renderItem: ListRenderItem<QueryFetchMessage_fetchAndReadMessages_messages> = ({
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
    let refetchLength: number;

    if (messages?.fetchAndReadMessages.messages) {
      if (messages?.fetchAndReadMessages.messages.length > 100) {
        // max refetch length
        refetchLength = 100;
      } else {
        refetchLength = messages?.fetchAndReadMessages.messages.length;
      }
    } else {
      refetchLength = 10;
    }

    setRefreshing(true);
    await refetch({ input: { roomId, cursorId: 0, pageSize: refetchLength } });
    setRefreshing(false);
  };

  const onEndReached = async () => {
    setFetching(true);
    const length = messages?.fetchAndReadMessages.messages?.length!;
    const lastMsg = messages?.fetchAndReadMessages.messages![length - 1];

    const result = await fetchMore({
      variables: {
        input: { roomId, cursorId: lastMsg?.id },
      },
    });
    setFetching(false);
  };

  const onSendMessage = () => {
    if (watch("payload").length > 0) {
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
    }
  };
  const client = useApolloClient();
  // 잘 작동을 안해부러요.
  /*useEffect(() => {
    if (messages?.fetchAndReadMessages.messages) {
      subscribeToMore({
        document: GQL_WAIT_MESSAGE,
        variables: {
          roomId,
        },
        updateQuery: (prev, options) => {
          console.log(prev.fetchAndReadMessages);
          console.log("aaakjdsalkfjafklajflkjaslkdfjalkfdj");
          console.log(options.subscriptionData.data);

          return {
            fetchAndReadMessages: {
              ...prev.fetchAndReadMessages,
              // @ts-ignore
              messages: [
                // @ts-ignore
                options.subscriptionData.data.waitNewMessages,
                // @ts-ignore
                ...prev.fetchAndReadMessages.messages,
              ],
            },
          };
        },
      });
    }
  }, [messages]);*/

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
            data={messages?.fetchAndReadMessages.messages}
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
            blurOnSubmit={false}
            value={watch("payload")}
            onSubmitEditing={handleSubmit(onSendMessage)}
          />
          <TouchableOpacity onPress={onSendMessage}>
            <Ionicons
              name="paper-plane-outline"
              size={23}
              color={watch("payload").length > 0 ? theme.color.link : "gray"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};
