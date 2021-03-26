import React, { useState } from "react";
import { gql, useApolloClient, useMutation } from "@apollo/client";

import styled from "styled-components/native";
import { GQL_TOGGLE_LIKE } from "../apollo/gqls";
import { useCustomTheme } from "../theme/theme";
import { Ionicons } from "@expo/vector-icons";

interface LikeButtonProps {
  photoId: number;
  isLiked: boolean;
}

const Action = styled.TouchableOpacity`
  margin-right: 10px;
`;

export const LikeButton: React.FC<LikeButtonProps> = ({ photoId, isLiked }) => {
  const theme = useCustomTheme();
  const client = useApolloClient();
  const [like, setLike] = useState(isLiked);
  const [toggleLike] = useMutation(GQL_TOGGLE_LIKE, {
    onCompleted: (data) => {
      client.cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          numLikes(prev) {
            return like ? prev + 1 : prev - 1;
          },
        },
      });
    },
  });

  const onLikeClicked = () => {
    toggleLike({
      variables: {
        input: {
          id: photoId,
        },
      },
    });
    setLike(!like);
  };

  return (
    <Action onPress={onLikeClicked}>
      <Ionicons
        name={like ? "heart" : "heart-outline"}
        size={22}
        color={like ? theme.color.link : theme.color.primary}
      />
    </Action>
  );
};
