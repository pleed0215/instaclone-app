/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface CreateAccountInput {
  username: string;
  email: string;
  firstName: string;
  lastName?: string | null;
  password: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface SeeFeedsInput {
  page?: number | null;
  pageSize?: number | null;
}

export interface SeeLikeUsersInput {
  page?: number | null;
  pageSize?: number | null;
  photoId: number;
}

export interface ToggleFollowUserInput {
  username: string;
}

export interface ToggleLikeInput {
  id: number;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
