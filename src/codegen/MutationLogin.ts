/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LoginInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: MutationLogin
// ====================================================

export interface MutationLogin_login {
  __typename: "LoginOutput";
  ok: boolean;
  token: string | null;
  error: string | null;
}

export interface MutationLogin {
  login: MutationLogin_login;
}

export interface MutationLoginVariables {
  input: LoginInput;
}
