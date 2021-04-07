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
  QuerySeeFeeds_seeFeeds,
} from "../../codegen/QuerySeeFeeds";
import { FeedPhoto } from "../../components/FeedPhoto";
import { ScreenLayout } from "../../components/ScreenLayout";

export const FeedPage = () => {
  const pageSize = 2;
  const [fetching, setFetching] = useState(false);
  const { data, loading, refetch, fetchMore } = useQuery<
    QuerySeeFeeds,
    QuerySeeFeedsVariables
  >(GQL_SEE_FEEDS, {
    variables: {
      input: {
        offset: 0,
        limit: pageSize,
      },
    },
    onCompleted: () => setFetching(false),
  });
  const renderPhoto: ListRenderItem<QuerySeeFeeds_seeFeeds> = ({ item }) => (
    <FeedPhoto photo={item} />
  );

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch({ input: { offset: 0, limit: data?.seeFeeds.length } });
    setRefreshing(false);
  };

  const onEndReached = async () => {
    if (!loading) {
      setFetching(true);
      await fetchMore({
        variables: {
          input: { offset: data?.seeFeeds.length, limit: pageSize },
        },
      });
      setFetching(false);
    }
  };

  return (
    <ScreenLayout loading={loading}>
      {data && (
        <FlatList
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReachedThreshold={0.05}
          onEndReached={onEndReached}
          data={data?.seeFeeds}
          keyExtractor={(item: QuerySeeFeeds_seeFeeds) => `Photo:${item.id}`}
          showsVerticalScrollIndicator={false}
          renderItem={renderPhoto}
        />
      )}
      {fetching && <ActivityIndicator color="gray" />}
    </ScreenLayout>
  );
};
