import { useColorScheme } from "react-native-appearance";
import { DefaultTheme } from "styled-components";

export const lightTheme: DefaultTheme = {
  color: {
    primary: "black",
    secondary: "rgb(96,96, 96)",
    border: "rgb(219,219,219)",
    link: "#0095f6",
    button: "white",
    error: "red",
  },
  background: {
    primary: "#fafafa",
    secondary: "white",
    button: "#4795f6",
    avatar: "#dbdbdb",
  },
};
export const darkTheme: DefaultTheme = {
  color: {
    primary: "#eee",
    secondary: "rgb(78,171,205)",
    border: "rgb(219,219,219)",
    link: "#0095f6",
    button: "white",
    error: "red",
  },
  background: {
    primary: "#111",
    secondary: "#454545",
    button: "#4795f6",
    avatar: "#dbdbdb",
  },
};

export const useCustomTheme = () => {
  const isDark = useColorScheme() === "dark";
  return isDark ? darkTheme : lightTheme;
};

export const useLogo = () => {
  const isDark = useColorScheme() === "dark";
  return isDark
    ? require("../../assets/insta_dark.png")
    : require("../../assets/insta.png");
};
