import React from "react";
import { FeedPage } from "../pages/loggedin/feed";
import { NotificationPage } from "../pages/loggedin/notification";
import { ProfilePage } from "../pages/loggedin/profile";
import { SearchPage } from "../pages/loggedin/search";
import { LoggedInNav } from "./navs";
export const LoggedInNavigation = () => {
  return (
    <LoggedInNav.Navigator
      tabBarOptions={{
        style: {
          backgroundColor: "rgb(30,30,30)",
        },
      }}
    >
      <LoggedInNav.Screen name="Feed" component={FeedPage} />
      <LoggedInNav.Screen name="Search" component={SearchPage} />
      <LoggedInNav.Screen name="Notification" component={NotificationPage} />
      <LoggedInNav.Screen name="Profile" component={ProfilePage} />
    </LoggedInNav.Navigator>
  );
};
