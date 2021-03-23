/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SmallPartPhoto
// ====================================================

export interface SmallPartPhoto_user {
  __typename: "User";
  id: number;
  username: string;
  firstName: string;
  avatar: string | null;
}

export interface SmallPartPhoto {
  __typename: "Photo";
  id: number;
  user: SmallPartPhoto_user;
  caption: string | null;
  createdAt: any;
  file: string;
  isMine: boolean;
  isLiked: boolean;
  numLikes: number;
  numComments: number;
}
