import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import { Image, useWindowDimensions, View } from "react-native";
import styled from "styled-components/native";
import { QuerySeeFeeds_seeFeeds_feeds } from "../codegen/QuerySeeFeeds";
import { LoggedInNavParamList } from "../routers/navs";
import { useCustomTheme } from "../theme/theme";
import { getPluralText } from "../util";
import { Avatar } from "./Avatar";
import { LikeButton } from "./LikeButton";

interface FeedPhotoProp {
  photo: QuerySeeFeeds_seeFeeds_feeds;
}

const Container = styled.View``;

const Header = styled.TouchableOpacity`
  padding: 10px;
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
`;

const UsernameWrapper = styled.TouchableOpacity`
  align-self: flex-start;
`;
const Username = styled.Text`
  color: ${(props) => props.theme.color.primary};
  font-weight: 600;
`;
const PhotoFile = styled.Image``;
const Actions = styled.View`
  margin-top: 10px;
  margin-bottom: 5px;
  padding-left: 5px;
  flex-direction: row;
  align-items: center;
`;
const Action = styled.TouchableOpacity`
  margin-right: 10px;
  flex-direction: row;
  align-items: center;
`;
const ActionTextContainer = styled.View`
  flex-direction: row;
  margin-left: 5px;
`;

const ActionTextWrapper = styled.TouchableOpacity`
  align-self: flex-start;
  margin-right: 20px;
`;

const ActionText = styled.Text`
  color: ${(props) => props.theme.color.primary};
`;
const Caption = styled.View`
  flex-direction: row;
`;
const CaptionText = styled.Text`
  color: ${(props) => props.theme.color.primary};
  margin-left: 10px;
`;

export const FeedPhoto: React.FC<FeedPhotoProp> = ({ photo }) => {
  const { width, height } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState(height - 400);
  const navigation = useNavigation<NavigationProp<LoggedInNavParamList>>();
  const theme = useCustomTheme();

  useEffect(() => {
    Image.getSize(photo.file!, (w, h) => {
      if (w !== 0) {
        setImageHeight((width * h) / w);
      }
    });
  }, [photo.file]);

  return (
    <Container>
      <View>
        <Header
          onPress={() => navigation.navigate("Profile", { ...photo.user })}
        >
          <Avatar uri={photo.user.avatar} size={30} color="gray" />
          <Username>{photo.user.username}</Username>
        </Header>
      </View>
      <PhotoFile
        resizeMode="cover"
        source={{ uri: photo.file! }}
        style={{ width: width, height: imageHeight }}
      />
      <Actions>
        <LikeButton photoId={photo.id} isLiked={photo.isLiked} />
        <Action>
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={theme.color.primary}
          />
        </Action>
      </Actions>
      <ActionTextContainer>
        <ActionTextWrapper
          onPress={() => navigation.navigate("Likes", { photoId: photo.id })}
        >
          <ActionText>{getPluralText(photo.numLikes, "like")}</ActionText>
        </ActionTextWrapper>
        <ActionTextWrapper onPress={() => navigation.navigate("Comments")}>
          <ActionText>{getPluralText(photo.numComments, "comment")}</ActionText>
        </ActionTextWrapper>
      </ActionTextContainer>
      <Caption>
        <UsernameWrapper
          onPress={() => navigation.navigate("Profile", { ...photo.user })}
        >
          <Username>{photo.user.username}</Username>
        </UsernameWrapper>
        <CaptionText>{photo.caption}</CaptionText>
      </Caption>
    </Container>
  );
};
