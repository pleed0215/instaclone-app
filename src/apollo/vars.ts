import { makeVar } from "@apollo/client";
import { Platform } from "react-native";
import { AUTH_TOKEN_NAME, DARK_NAME } from "../constants";

export const removeTokenFromLS = () => localStorage.removeItem(AUTH_TOKEN_NAME);
export const isLoggedInVar = makeVar(false);
export const authTokenVar = makeVar<string | null>(null);
export const makeLogin = (token: string) => {
  isLoggedInVar(true);
  authTokenVar(token);
};
export const makeLogout = () => {
  //removeTokenFromLS();
  isLoggedInVar(false);
  authTokenVar(null);
};

/*const isDarkFromLS = () => localStorage.getItem(DARK_NAME) || "false";
const setDarkModelToLS = (isDark: boolean) =>
  localStorage.setItem(DARK_NAME, isDark.toString());

export const darkModeVar = makeVar(isDarkFromLS() === "true");
export const setDarkMode = (isDark: boolean) => {
  setDarkModelToLS(isDark);
  darkModeVar(isDark);
};*/
