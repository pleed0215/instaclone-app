/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PartPhoto
// ====================================================

export interface PartPhoto_user {
  __typename: "User";
  id: number;
  username: string;
  firstName: string;
  avatar: string | null;
}

export interface PartPhoto_comments_user {
  __typename: "User";
  id: number;
  username: string;
  firstName: string;
  avatar: string | null;
}

export interface PartPhoto_comments {
  __typename: "Comment";
  id: number;
  payload: string;
  isMine: boolean;
  user: PartPhoto_comments_user;
}

export interface PartPhoto {
  __typename: "Photo";
  id: number;
  user: PartPhoto_user;
  caption: string | null;
  createdAt: any;
  file: string;
  isMine: boolean;
  isLiked: boolean;
  numLikes: number;
  numComments: number;
  /**
   * @onDelete(CASCADE)
   */
  comments: PartPhoto_comments[];
}
