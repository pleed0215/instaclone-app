import React from "react";
import { FeedPage } from "../pages/loggedin/feed";
import { LoggedInNav } from "./navs";
export const LoggedInNavigation = () => {
  return (
    <LoggedInNav.Navigator>
      <LoggedInNav.Screen name="Feed" component={FeedPage} />
    </LoggedInNav.Navigator>
  );
};
