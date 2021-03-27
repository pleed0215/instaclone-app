import React, { useEffect, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import styled from "styled-components/native";
import { FlatList, ListRenderItem, TouchableOpacity } from "react-native";
import { Image, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCustomTheme } from "../../theme/theme";

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
const IconContainer = styled.View`
  position: absolute;
  bottom: 0;
  right: 5px;
`;

export const SelectPhotoPage = () => {
  const theme = useCustomTheme();
  const [ok, setOk] = useState(false);
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [choosen, setChoosen] = useState<Array<string>>([]);
  const { width, height } = useWindowDimensions();
  const imageWidth = Math.floor((width - 3) / 4);
  const getPermissions = async () => {
    const {
      accessPrivileges,
      canAskAgain,
    } = await MediaLibrary.getPermissionsAsync();
    if (accessPrivileges === "none" && canAskAgain) {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.accessPrivileges !== "none") {
        setOk(true);
        getPhotos();
      }
    } else if (accessPrivileges !== "none") {
      setOk(true);
      getPhotos();
    }
  };
  const getPhotos = async () => {
    const { assets } = await MediaLibrary.getAssetsAsync();
    setPhotos(assets);
  };
  const selected = (uri: string) => choosen.some((c) => c === uri);
  const toggleChoosen = (uri: string) => {
    if (selected(uri)) {
      setChoosen(choosen.filter((c) => c !== uri));
    } else {
      setChoosen((prev) => [uri, ...prev]);
    }
  };

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
        <IconContainer>
          {selected(item.uri) && (
            <Ionicons
              name="checkbox-sharp"
              size={20}
              color={theme.color.link}
            />
          )}
        </IconContainer>
      </ImageContainer>
    );
  };

  useEffect(() => {
    getPermissions();
    getPhotos();
  }, []);
  return (
    <Container>
      <Top>
        {choosen.length > 0 && (
          <Image source={{ uri: choosen[0] }} style={{ flex: 1 }} />
        )}
      </Top>
      <Bottom>
        <FlatList
          data={photos}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderPhoto}
          numColumns={4}
        />
      </Bottom>
    </Container>
  );
};
