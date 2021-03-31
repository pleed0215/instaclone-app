import gql from "graphql-tag";
import { PART_MESSAGE, PART_PHOTO, PART_ROOM, SMALL_USER } from "./fragments";

export const GQL_SEE_FEEDS = gql`
  query QuerySeeFeeds($input: SeeFeedsInput!) {
    seeFeeds(input: $input) {
      ok
      error
      totalCount
      totalPage
      currentCount
      currentPage
      pageSize
      feeds {
        ...PartPhoto
      }
    }
  }
  ${PART_PHOTO}
`;

export const GQL_TOGGLE_LIKE = gql`
  mutation MutationToggleLike($input: ToggleLikeInput!) {
    toggleLike(input: $input) {
      ok
      error
    }
  }
`;

export const GQL_PHOTO_LIKES = gql`
  query QuerySeeLikeUsers($input: SeeLikeUsersInput!) {
    seeLikeUsers(input: $input) {
      ok
      error
      currentCount
      currentPage
      totalCount
      totalPage
      pageSize
      likeUsers {
        id
        username
        firstName
        avatar
        isFollowing
      }
    }
  }
`;

export const GQL_TOGGLE_FOLLOW = gql`
  mutation MutationToggleFollow($input: ToggleFollowUserInput!) {
    toggleFollow(input: $input) {
      ok
      error
    }
  }
`;

export const GQL_SEE_PHOTO_DETAIL = gql`
  query QuerySeePhotoDetail($input: SeePhotoDetailInput!) {
    seePhotoDetail(input: $input) {
      ok
      error
      photo {
        ...PartPhoto
      }
    }
  }
  ${PART_PHOTO}
`;

export const GQL_SEARCH_PHOTO = gql`
  query QuerySearchPhotos($input: SearchPhotoInput!) {
    searchPhotos(input: $input) {
      ok
      error
      currentPage
      currentCount
      totalPage
      totalCount
      pageSize
      photos {
        ...PartPhoto
      }
    }
  }
  ${PART_PHOTO}
`;

export const GQL_SEARCH_USER = gql`
  query QuerySearchUser($input: SearchUserInput!) {
    searchUser(input: $input) {
      ok
      error
      currentPage
      currentCount
      totalPage
      totalCount
      pageSize
      results {
        ...SmallUser
      }
    }
  }
  ${SMALL_USER}
`;

export const GQL_PHOTO_DETAIL = gql`
  query QueryPhotoDetail($input: SeePhotoDetailInput!) {
    seePhotoDetail(input: $input) {
      ok
      error
      photo {
        ...PartPhoto
      }
    }
  }
  ${PART_PHOTO}
`;

export const GQL_UPLOAD_PHOTO = gql`
  mutation MutationUploadPhoto($input: UploadPhotoInput!) {
    uploadPhoto(input: $input) {
      ok
      error
      photo {
        ...PartPhoto
      }
    }
  }
  ${PART_PHOTO}
`;

export const GQL_SEE_ROOMS = gql`
  query QuerySeeRooms {
    seeRooms {
      ok
      error
      rooms {
        ...PartRoom
      }
    }
  }
  ${PART_ROOM}
`;

export const GQL_SEE_ROOM = gql`
  query QuerySeeRoom($input: SeeRoomInput!) {
    seeRoom(input: $input) {
      ok
      error
      room {
        ...PartRoom
      }
    }
  }
  ${PART_ROOM}
`;

export const GQL_SEND_MESSAGE = gql`
  mutation MutationSendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      ok
      error
      message {
        ...PartMessage
      }
    }
  }
  ${PART_MESSAGE}
`;

export const GQL_FETCH_MESSAGE = gql`
  query QueryFetchMessage($input: FetchMessagesInput!) {
    fetchAndReadMessages(input: $input) {
      ok
      error
      messages {
        ...PartMessage
      }
      count
    }
  }
  ${PART_MESSAGE}
`;

export const GQL_WAIT_MESSAGE = gql`
  subscription SubWaitMessage($roomId: Int!) {
    waitNewMessage(roomId: $roomId) {
      ...PartMessage
    }
  }
  ${PART_MESSAGE}
`;
