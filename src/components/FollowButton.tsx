import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, { useState } from "react";
import {
  MutationToggleFollow,
  MutationToggleFollowVariables,
} from "../codegen/MutationToggleFollow";
import { useMe } from "../hooks/useMe";
import styled from "styled-components/native";
import { ActivityIndicator } from "react-native";
import { GQL_TOGGLE_FOLLOW } from "../apollo/gqls";

interface ToggleFollowPros {
  isFollowing: boolean;

  username: string;
}

const SButton = styled.TouchableOpacity`
  width: 100px;
  height: 40px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.color.link};
  border-radius: 4px;
`;

const Text = styled.Text`
  color: white;
  font-weight: 600;
`;

export const ToggleFollow: React.FC<ToggleFollowPros> = ({
  isFollowing,
  username,
}) => {
  const { data: me } = useMe();
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(isFollowing);
  const client = useApolloClient();
  const [toggleFollow] = useMutation<
    MutationToggleFollow,
    MutationToggleFollowVariables
  >(GQL_TOGGLE_FOLLOW, {
    onCompleted: (data: MutationToggleFollow) => {
      setLoading(false);
      setFollowing((prev) => !prev);
      if (data.toggleFollow.ok) {
        client.cache.modify({
          id: `User: ${me?.seeMe.username}`,
          fields: {
            totalFollowings(prev) {
              return following ? prev - 1 : prev + 1;
            },
          },
        });
        client.cache.modify({
          id: `User: ${username}`,
          fields: {
            totalFollowers(prev) {
              return following ? prev - 1 : prev + 1;
            },
            isFollowing(prev) {
              return !prev;
            },
          },
        });
      }
    },
  });

  const onClick = () => {
    setLoading(true);
    toggleFollow({
      variables: {
        input: {
          username,
        },
      },
    });
  };
  return (
    <SButton onPress={onClick}>
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text>{following ? "언팔로우" : "팔로우"}</Text>
      )}
    </SButton>
  );
};
