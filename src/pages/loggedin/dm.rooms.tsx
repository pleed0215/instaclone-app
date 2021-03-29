import { useQuery } from "@apollo/client";
import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import {
  View,
  Text,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import { GQL_SEE_ROOMS } from "../../apollo/gqls";
import {
  QuerySeeRooms,
  QuerySeeRooms_seeRooms_rooms,
} from "../../codegen/QuerySeeRooms";
import { Avatar } from "../../components/Avatar";
import { Badge } from "../../components/Badge";
import { ScreenLayout } from "../../components/ScreenLayout";
import { useMe } from "../../hooks/useMe";
import { DMParamList } from "./direct.message";

const Container = styled.View`
  background-color: ${(props) => props.theme.background.primary};
  flex: 1;
`;

const WithWhoContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Username = styled.Text`
  color: ${(props) => props.theme.color.primary};
  font-weight: 600;
`;
const LastChatText = styled.Text`
  color: ${(props) => props.theme.color.secondary};
  margin-left: 5px;
`;

const RoomListText = styled.Text`
  margin-top: 10px;
  color: ${(props) => props.theme.color.primary};
  font-size: 16px;
`;

export const DMRoomsPage: React.FC<StackScreenProps<DMParamList, "DMRoom">> = ({
  navigation,
  route,
}) => {
  const { data, loading } = useQuery<QuerySeeRooms>(GQL_SEE_ROOMS);
  const { data: me } = useMe();

  const renderItem: ListRenderItem<QuerySeeRooms_seeRooms_rooms> = ({
    item,
    index,
  }) => {
    const user = item.participants.find((user) => user.id !== me?.seeMe.id);
    return (
      <WithWhoContainer
        style={{
          padding: 10,
        }}
      >
        <Avatar uri={user?.avatar} size={26} color="gray"></Avatar>
        <Username>{user?.username}</Username>
        <TouchableOpacity
          onPress={() => navigation.navigate("DMRoom", { roomId: item.id })}
        >
          <LastChatText>{item.latestMessage?.payload}</LastChatText>
        </TouchableOpacity>
        {item.numUnread !== 0 && (
          <Badge color="red" textColor="white" num={item.numUnread} />
        )}
      </WithWhoContainer>
    );
  };
  const { width } = useWindowDimensions();

  return (
    <ScreenLayout loading={loading}>
      <RoomListText>Room List</RoomListText>
      <FlatList
        style={{ flex: 1, width }}
        data={data?.seeRooms.rooms}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View style={{ width: "100%", height: 1, backgroundColor: "gray" }} />
        )}
      />
    </ScreenLayout>
  );
};
