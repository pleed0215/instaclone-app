import { gql } from "@apollo/client";

export const SMALL_PART_USER = gql`
  fragment SmallPartUser on User {
    id
    username
    firstName
    avatar
  }
`;

export const SMALL_PART_COMMENT = gql`
  fragment SmallPartComment on Comment {
    id
    payload
    isMine
  }
`;
export const PART_COMMENT = gql`
  fragment PartComment on Comment {
    id
    payload
    isMine
    user {
      ...SmallPartUser
    }
  }
  ${SMALL_PART_USER}
`;

export const SMALL_PART_PHOTO = gql`
  fragment SmallPartPhoto on Photo {
    id
    user {
      id
      username
      firstName
      avatar
    }
    caption
    createdAt
    file
    isMine
    isLiked
    numLikes
    numComments
  }
`;

export const PART_PHOTO = gql`
  fragment PartPhoto on Photo {
    ...SmallPartPhoto
    comments(take: 10, orderBy: { createdAt: desc }) {
      ...PartComment
    }
  }
  ${SMALL_PART_PHOTO}
  ${PART_COMMENT}
`;

export const PART_USER = gql`
  fragment PartUser on User {
    id
    username
    email
    firstName
    lastName
    avatar
    bio
    numPhotos
    totalFollowers
    totalFollowings
    isFollower
    isFollowing
    photos(take: 9, orderBy: { createdAt: desc }) {
      ...SmallPartPhoto
    }
  }
  ${SMALL_PART_PHOTO}
`;

export const SMALL_USER = gql`
  fragment SmallUser on User {
    id
    username
    email
    firstName
    avatar
    isFollower
    isFollowing
  }
`;

export const PART_MESSAGE = gql`
  fragment PartMessage on Message {
    id
    isRead
    createdAt
    payload
    user {
      id
      username
      avatar
    }
  }
`;

export const PART_ROOM = gql`
  fragment PartRoom on Room {
    id
    createdAt
    updatedAt
    participants {
      id
      username
      avatar
      firstName
    }
    numUnread
    latestMessage {
      ...PartMessage
    }
  }
  ${PART_MESSAGE}
`;
