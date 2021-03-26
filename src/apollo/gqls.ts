import gql from "graphql-tag";
import { PART_PHOTO, SMALL_USER } from "./fragments";

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
