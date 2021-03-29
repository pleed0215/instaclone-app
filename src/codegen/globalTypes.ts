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

export interface SearchPhotoInput {
  page?: number | null;
  pageSize?: number | null;
  keyword: string;
}

export interface SearchUserInput {
  page?: number | null;
  pageSize?: number | null;
  keyword: string;
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

export interface SeePhotoDetailInput {
  id: number;
}

export interface SeeRoomInput {
  roomId: number;
}

export interface ToggleFollowUserInput {
  username: string;
}

export interface ToggleLikeInput {
  id: number;
}

export interface UploadPhotoInput {
  file: any;
  caption?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
