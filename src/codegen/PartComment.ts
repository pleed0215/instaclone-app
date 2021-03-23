/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PartComment
// ====================================================

export interface PartComment_user {
  __typename: "User";
  id: number;
  username: string;
  firstName: string;
  avatar: string | null;
}

export interface PartComment {
  __typename: "Comment";
  id: number;
  payload: string;
  isMine: boolean;
  user: PartComment_user;
}
