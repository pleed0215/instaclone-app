import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { ListRenderItem, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { GQL_PHOTO_LIKES } from "../../apollo/gqls";
import {
  QuerySeeLikeUsers,
  QuerySeeLikeUsersVariables,
  QuerySeeLikeUsers_seeLikeUsers_likeUsers,
} from "../../codegen/QuerySeeLikeUsers";
import { ProfileFollow } from "../../components/ProfileFollow";
import { ScreenLayout } from "../../components/ScreenLayout";
import { LoggedInScreenParam } from "../../routers/navs";

const SView = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background.primary};
  align-items: center;
  justify-content: center;
`;

const SText = styled.Text`
  color: ${(props) => props.theme.color.primary};
`;

export const LikesPage: React.FC<LoggedInScreenParam<"Likes">> = ({
  navigation,
  route: {
    params: { photoId },
  },
}) => {
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const { data, loading, refetch, fetchMore } = useQuery<
    QuerySeeLikeUsers,
    QuerySeeLikeUsersVariables
  >(GQL_PHOTO_LIKES, {
    variables: {
      input: {
        photoId,
        page,
        pageSize: 10,
      },
    },
    fetchPolicy: "network-only",
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch({ input: { photoId, page: 1 } });
    setRefreshing(false);
  };
  const onEndReached = async () => {
    if (!loading && data?.seeLikeUsers.totalPage! > page) {
      await fetchMore({ variables: { input: { photoId, page: page + 1 } } });
      setPage((page) => page + 1);
    }
  };
  const renderItem: ListRenderItem<QuerySeeLikeUsers_seeLikeUsers_likeUsers> = ({
    item,
  }) => <ProfileFollow user={item} />;

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        data={data?.seeLikeUsers.likeUsers}
        keyExtractor={(item: QuerySeeLikeUsers_seeLikeUsers_likeUsers) =>
          `User:${item.id}`
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.02}
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: "100%",
              height: 1,
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
          />
        )}
      />
    </ScreenLayout>
  );
};
