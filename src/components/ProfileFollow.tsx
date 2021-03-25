import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/core";
import React from "react";
import { Dimensions } from "react-native";
import styled from "styled-components/native";
import { QuerySeeLikeUsers_seeLikeUsers_likeUsers } from "../codegen/QuerySeeLikeUsers";
import { useMe } from "../hooks/useMe";
import { LoggedInNavParamList } from "../routers/navs";
import { ToggleFollow } from "./FollowButton";

interface ProfileFollowProp {
  user: QuerySeeLikeUsers_seeLikeUsers_likeUsers;
}

const { width } = Dimensions.get("window");

const Container = styled.View`
  margin-top: 10px;
  margin-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  flex-direction: row;

  align-items: center;
  justify-content: space-between;
  width: ${width}px;
`;

const ProfileContainer = styled.TouchableOpacity`
  align-self: center;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const Avatar = styled.Image`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin-right: 7px;
`;

const EmptyAvatar = styled.View`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin-right: 7px;
  justify-content: center;
  align-items: center;
  background-color: rgb(150, 150, 150);
`;

const UsernameBox = styled.View``;
const Username = styled.Text`
  color: ${(props) => props.theme.color.primary};
  margin-bottom: 2px;
`;
const UserFirstName = styled.Text`
  color: ${(props) => props.theme.color.secondary};
`;

export const ProfileFollow: React.FC<ProfileFollowProp> = ({ user }) => {
  const navigation = useNavigation<NavigationProp<LoggedInNavParamList>>();
  const { data: me, loading } = useMe();

  if (loading) {
    return <></>;
  } else {
    return (
      <Container>
        <ProfileContainer
          onPress={() => navigation.navigate("Profile", { ...user })}
        >
          {user.avatar && (
            <Avatar source={{ uri: user.avatar }} resizeMode="contain" />
          )}
          {!user.avatar && (
            <EmptyAvatar>
              <Ionicons color="white" name="person" size={20} />
            </EmptyAvatar>
          )}
          <UsernameBox>
            <Username>{user.username}</Username>
            <UserFirstName>{user.firstName}</UserFirstName>
          </UsernameBox>
        </ProfileContainer>
        {me?.seeMe.id !== user.id && (
          <ToggleFollow
            isFollowing={user.isFollowing}
            username={user.username}
          />
        )}
      </Container>
    );
  }
};
