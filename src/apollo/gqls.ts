import gql from "graphql-tag";
import { PART_PHOTO } from "./fragments";

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

const GQL_TOGGLE_FOLLOW = gql`
  mutation MutationToggleFollow($input: ToggleFollowUserInput!) {
    toggleFollow(input: $input) {
      ok
      error
    }
  }
`;
