import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { Image, StatusBar, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import Slider from "@react-native-community/slider";
import * as MediaLibrary from "expo-media-library";
import { useNavigation } from "@react-navigation/core";
import { FlashButton } from "../../components/FlashButton";

const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.background.primary};
`;

const Actions = styled.View`
  flex: 0.2;
  justify-content: center;
  align-items: center;
  padding: 3px 20px;
`;

const ActionsInner = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TakePhoto = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  border-radius: 50px;
  border: 1px solid white;
  align-items: center;
  justify-content: center;
`;

const TakePhotoInner = styled.View`
  width: 50px;
  height: 50px;
  background-color: white;
  border-radius: 45px;
  opacity: 0.9;
`;

const SliderContainer = styled.View`
  width: 100%;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`;
const ThumbnailContainer = styled.View`
  background-color: gray;
  border-radius: 5px;
  width: 35px;
  height: 35px;
  border: 1px solid white;
`;

const ToggleCameraType = styled.TouchableOpacity``;

// @ts-ignore
export const TakePhotoPage: React.FC = ({ navigation }) => {
  const [ok, setOk] = useState(false);
  const camera = useRef(null);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [zoom, setZoom] = useState<number>(0);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [cameraReady, setCameraReady] = useState(false);
  const [firstPhoto, setFirstPhoto] = useState<string | null>();

  const toggleCameraType = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };
  const getPermission = async () => {
    const permissions = await Camera.getPermissionsAsync();

    if (permissions.granted) {
      setOk(true);
    } else if (!permissions.granted && permissions.canAskAgain) {
      const request = await Camera.requestPermissionsAsync();
      if (request.granted) {
        setOk(true);
      }
    }
  };
  const onZoomValueChange = (zoom: number) => {
    setZoom(zoom);
  };

  const getFirstPhoto = async () => {
    const { assets } = await MediaLibrary.getAssetsAsync();
    setFirstPhoto(assets[0].uri);
  };

  const takePhoto = async () => {
    if (camera && cameraReady) {
      // @ts-ignore
      const result = await camera.current.takePictureAsync({
        quality: 1,
        exif: true,
      });
      //await MediaLibrary.saveToLibraryAsync(result.uri);
      await MediaLibrary.createAssetAsync(result.uri);
      setFirstPhoto(result.uri);
    }
  };

  useEffect(() => {
    getPermission();
    getFirstPhoto();
  }, []);

  return (
    <Container>
      <StatusBar hidden />
      <Camera
        type={type}
        style={{ flex: 1 }}
        zoom={zoom}
        flashMode={flashMode}
        ref={camera}
        onCameraReady={() => setCameraReady(true)}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", top: 50, left: 20 }}
        >
          <Ionicons name="close-circle" color="white" size={30} />
        </TouchableOpacity>
      </Camera>
      <Actions>
        <ActionsInner>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            {firstPhoto ? (
              <Image
                source={{ uri: firstPhoto }}
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 5,
                  borderColor: "white",
                  borderWidth: 1,
                }}
              />
            ) : (
              <ThumbnailContainer />
            )}
          </TouchableOpacity>
          <TakePhoto onPress={takePhoto}>
            <TakePhotoInner />
          </TakePhoto>
          <ToggleCameraType onPress={toggleCameraType}>
            <Ionicons name="camera-reverse" color="white" size={25} />
          </ToggleCameraType>
        </ActionsInner>
        <SliderContainer>
          <Slider
            style={{ width: 200, height: 40 }}
            minimumValue={0}
            maximumValue={0.3}
            step={0.005}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            onValueChange={onZoomValueChange}
          />
          <FlashButton value={flashMode} setValue={setFlashMode} />
        </SliderContainer>
      </Actions>
    </Container>
  );
};
