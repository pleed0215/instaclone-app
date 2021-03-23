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
