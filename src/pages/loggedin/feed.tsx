import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";
import { GQL_SEE_FEEDS } from "../../apollo/gqls";
import {
  QuerySeeFeeds,
  QuerySeeFeedsVariables,
} from "../../codegen/QuerySeeFeeds";
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
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<QuerySeeFeeds, QuerySeeFeedsVariables>(
    GQL_SEE_FEEDS,
    {
      variables: {
        input: {
          page,
        },
      },
    }
  );
  return (
    <ScreenLayout loading={loading}>
      <Text>hello</Text>
    </ScreenLayout>
  );
};
