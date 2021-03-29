import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import {
  FlatList,
  Text,
  View,
  ListRenderItem,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components/native";
import { GQL_SEE_FEEDS } from "../../apollo/gqls";
import {
  QuerySeeFeeds,
  QuerySeeFeedsVariables,
  QuerySeeFeeds_seeFeeds_feeds,
} from "../../codegen/QuerySeeFeeds";
import { FeedPhoto } from "../../components/FeedPhoto";
import { ScreenLayout } from "../../components/ScreenLayout";

const SView = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background.primary};
  align-items: center;
  justify-content: center;
`;

const SText = styled.Text`
  color: ${(props) => props.theme.color.primary};
`;

export const FeedPage = () => {
  const pageSize = 2;
  const [page, setPage] = useState(1);
  const [fetching, setFetching] = useState(false);
  const { data, loading, refetch, fetchMore } = useQuery<
    QuerySeeFeeds,
    QuerySeeFeedsVariables
  >(GQL_SEE_FEEDS, {
    variables: {
      input: {
        page,
        pageSize,
      },
    },
    onCompleted: () => setFetching(false),
  });
  const renderPhoto: ListRenderItem<QuerySeeFeeds_seeFeeds_feeds> = ({
    item,
  }) => <FeedPhoto photo={item} />;

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch({ input: { page: 1, pageSize } });
    setRefreshing(false);
  };
  const onEndReached = async () => {
    if (!loading && data?.seeFeeds.totalPage! > page) {
      setFetching(true);
      await fetchMore({ variables: { input: { page: page + 1, pageSize } } });
      setPage((page) => page + 1);
    }
  };

  return (
    <ScreenLayout loading={loading}>
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        onEndReachedThreshold={-0.17}
        onEndReached={onEndReached}
        data={data?.seeFeeds.feeds}
        keyExtractor={(item: QuerySeeFeeds_seeFeeds_feeds) => `${item.id}`}
        showsVerticalScrollIndicator={false}
        renderItem={renderPhoto}
      />
      {fetching && <ActivityIndicator color="gray" />}
    </ScreenLayout>
  );
};
