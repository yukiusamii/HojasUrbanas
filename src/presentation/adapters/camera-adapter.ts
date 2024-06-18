import {launchCamera} from 'react-native-image-picker';

export class CameraAdapter {
  static async takePicture(): Promise<string[]> {
    const response = await launchCamera({
      mediaType: 'photo',
      quality: 1,
      cameraType: 'back',
    });

    if (response.assets && response.assets[0].uri) {
      const {uri, fileSize} = response.assets[0];
      console.log(
        `******************************************${
          fileSize ? fileSize / 1024 : 0
        }KB`,
      );
      console.log(`******************************************${uri}`);
      const img = response.assets[0].uri;
      return [img];
    }

    return [];
  }

  static async pickImageFromLibrary(): Promise<string[]> {
    return [];
  }
}
