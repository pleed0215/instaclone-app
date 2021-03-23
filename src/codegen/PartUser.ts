/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PartUser
// ====================================================

export interface PartUser_photos_user {
  __typename: "User";
  id: number;
  username: string;
  firstName: string;
  avatar: string | null;
}

export interface PartUser_photos {
  __typename: "Photo";
  id: number;
  user: PartUser_photos_user;
  caption: string | null;
  createdAt: any;
  file: string;
  isMine: boolean;
  isLiked: boolean;
  numLikes: number;
  numComments: number;
}

export interface PartUser {
  __typename: "User";
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string | null;
  avatar: string | null;
  bio: string | null;
  numPhotos: number;
  totalFollowers: number;
  totalFollowings: number;
  isFollower: boolean;
  isFollowing: boolean;
  photos: PartUser_photos[];
}
