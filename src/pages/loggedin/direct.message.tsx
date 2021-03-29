import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useCustomTheme } from "../../theme/theme";
import { DMRoomPage } from "./dm.room";
import { DMRoomsPage } from "./dm.rooms";

export type DMParamList = {
  Rooms: any;
  DMRoom: {
    roomId: number;
  };
};

const Stack = createStackNavigator<DMParamList>();

export const DirectMessages: React.FC = () => {
  const theme = useCustomTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: theme.color.primary,
        headerBackTitleVisible: false,

        headerStyle: {
          backgroundColor: theme.background.primary,
        },
      }}
    >
      <Stack.Screen
        name="Rooms"
        component={DMRoomsPage}
        options={{
          headerBackImage: ({ tintColor }) => (
            <Ionicons name="chevron-down" color={tintColor} size={24} />
          ),
        }}
      />
      <Stack.Screen name="DMRoom" component={DMRoomPage} />
    </Stack.Navigator>
  );
};
