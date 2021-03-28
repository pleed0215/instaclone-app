import React, { useEffect, useLayoutEffect, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import styled from "styled-components/native";
import {
  FlatList,
  ListRenderItem,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCustomTheme } from "../../theme/theme";
import { useIsFocused } from "@react-navigation/core";

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background.primary};
`;

const Top = styled.View`
  flex: 1;
`;
const Bottom = styled.View`
  flex: 1;
`;

const ImageContainer = styled.TouchableOpacity`
  position: relative;
`;

// @ts-ignore
export const SelectPhotoPage = ({ navigation, route }) => {
  const theme = useCustomTheme();
  const [ok, setOk] = useState(false);
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [choosen, setChoosen] = useState<Array<string>>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();
  const imageWidth = Math.floor((width - 3) / 4);
  const getPermissions = async () => {
    const {
      canAskAgain,
      granted,
      status,
      accessPrivileges,
    } = await MediaLibrary.getPermissionsAsync();
    if (!granted && canAskAgain) {
      const permission = await MediaLibrary.requestPermissionsAsync();

      if (permission.granted) {
        setOk(true);
        getPhotos();
      }
    } else if (granted) {
      setOk(true);
      getPhotos();
    }
  };
  const getPhotos = async () => {
    setRefreshing(true);
    const { assets } = await MediaLibrary.getAssetsAsync();
    setPhotos(assets);
    setRefreshing(false);
  };
  const selected = (uri: string) => choosen.some((c) => c === uri);
  const toggleChoosen = (uri: string) => {
    if (selected(uri)) {
      setChoosen(choosen.filter((c) => c !== uri));
    } else {
      setChoosen((prev) => [uri, ...prev]);
    }
  };
  const isFocused = useIsFocused();

  const renderPhoto: ListRenderItem<MediaLibrary.Asset> = ({ item, index }) => {
    return (
      <ImageContainer onPress={() => toggleChoosen(item.uri)}>
        <Image
          source={{ uri: item.uri }}
          style={{
            width: imageWidth,
            height: imageWidth,
            ...(index % 4 !== 3 && { marginRight: 1 }),
          }}
        />

        {selected(item.uri) && (
          <View
            style={{
              width: 19,
              height: 19,
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              right: 5,
              bottom: 5,
              borderRadius: 9.5,
              borderColor: "white",
              backgroundColor: "white",
            }}
          >
            <Ionicons
              name="checkmark-circle"
              size={19}
              color={theme.color.link}
              style={{ right: -1 }}
            />
          </View>
        )}
      </ImageContainer>
    );
  };

  useEffect(() => {
    getPermissions();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            if (choosen.length > 0) {
              navigation.navigate("UploadForm", { localUri: choosen[0] });
            }
          }}
        >
          <Text
            style={{
              color: choosen.length > 0 ? theme.color.link : "gray",
              marginRight: 15,
              fontWeight: "600",
              fontSize: 16,
            }}
          >
            올리기
          </Text>
        </TouchableOpacity>
      ),
      headerBackTitleVisible: false,
      headerBackImage: ({ tintColor }: { tintColor: string }) => (
        <Ionicons name="close" color={tintColor} size={28} />
      ),
      headerTintColor: theme.color.primary,
      headerStyle: { backgroundColor: theme.background.primary },
    });
  }, [choosen]);

  useEffect(() => {
    if (navigation.isFocused()) {
      getPhotos();
    }
  }, [navigation.isFocused()]);

  return (
    <Container>
      {isFocused && <StatusBar hidden={false} />}
      <Top>
        {choosen.length > 0 && (
          <Image source={{ uri: choosen[0] }} style={{ flex: 1 }} />
        )}
      </Top>
      <Bottom>
        <FlatList
          onRefresh={getPhotos}
          refreshing={refreshing}
          data={photos}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderPhoto}
          numColumns={4}
        />
      </Bottom>
    </Container>
  );
};
