import { makeVar } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_TOKEN_NAME } from "../constants";
import { apolloClient } from "./client";

export const removeTokenFromStorage = async () =>
  await AsyncStorage.removeItem(AUTH_TOKEN_NAME);
export const setTokenToStorage = async (token: string) =>
  await AsyncStorage.setItem(AUTH_TOKEN_NAME, JSON.stringify(token));
export const getTokenFromStorage = async () => {
  const jsonValue = await AsyncStorage.getItem(AUTH_TOKEN_NAME);
  if (jsonValue) {
    return JSON.parse(jsonValue);
  } else {
    return null;
  }
};
export const isLoggedInVar = makeVar(false);
export const authTokenVar = makeVar<string | null>(null);

/*const isDarkFromLS = () => localStorage.getItem(DARK_NAME) || "false";
const setDarkModelToLS = (isDark: boolean) =>
  localStorage.setItem(DARK_NAME, isDark.toString());

export const darkModeVar = makeVar(isDarkFromLS() === "true");
export const setDarkMode = (isDark: boolean) => {
  setDarkModelToLS(isDark);
  darkModeVar(isDark);
};*/
