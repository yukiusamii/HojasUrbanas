import {View, Text, StyleSheet} from 'react-native';
import {CameraAdapter} from '../adapters/camera-adapter';
import {MyTheme, globalStyles} from '../theme/global.styles';
import {ActivityIndicator, Button, DefaultTheme} from 'react-native-paper';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {ToastAndroid} from 'react-native';
import ImageResizer from 'react-native-image-resizer';
import ImageEditor from '@react-native-community/image-editor';

import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {type RootStackParamList} from '../routes/StackNavigator';
import {apiUrls} from '../config/urlsBuilder';

export const UploadPhotoScreen = () => {
  const [servicioIniciado, setServicioIniciado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [esperandoRespuesta, setEsperandoRespuesta] = useState(false);
  const navegation = useNavigation<NavigationProp<RootStackParamList>>();
  const params = useRoute<RouteProp<RootStackParamList, 'Model'>>().params;

  // const startServiceAsync = async () => {
  //   try {
  //     setLoading(true);
  //     const iniciarServicio = await startService();
  //     if (iniciarServicio) {
  //       setServicioIniciado(true);
  //       setLoading(false);

  //       console.log(
  //         '****************Servicio iniciado con éxito***********************',
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Error al iniciar el servicio:', error);
  //   }
  // };

  useEffect(() => {
    // ------------ DESCOMENTAR PARA INICIAR EL SERVICIO -------------------
    // startServiceAsync();

    // ------------ COMENTAR SI INICIAMOS EL SERVICIO -------------------
    setServicioIniciado(true);
  }, []);

  const processImage = async (
    uri: string,
    width: number,
    height: number,
  ): Promise<string> => {
    try {
      const rotationAngle = width > height ? 90 : 0;
      const resizedWidth = width > height ? 4200 : 3500;
      const resizedHeight = width > height ? 3500 : 4200;

      const resizedImage = await ImageResizer.createResizedImage(
        uri,
        resizedWidth,
        resizedHeight,
        'JPEG',
        100,
        rotationAngle,
        undefined,
      );

      // console.log('-------ANCHO-------', resizedImage.width);
      // console.log('-------ALTO-------', resizedImage.height);

      // Obtener el ancho y alto original de la imagen redimensionada
      const originalWidth = resizedImage.width;
      const originalHeight = resizedImage.height;

      // coordenadas para un recorte centrado
      const offsetX = (originalWidth - width) / 2;
      const offsetY = (originalHeight - height) / 2;

      const cropData = {
        offset: {x: offsetX, y: offsetY}, // Punto de inicio del recorte
        size: {width: width, height: height}, // Dimensiones del recorte
      };

      const croppedImageUri = await ImageEditor.cropImage(
        resizedImage.uri,
        cropData,
      );
      return croppedImageUri.uri;
    } catch (error) {
      console.error('Error resizing and cropping image: ', error);
      throw error;
    }
  };

  const uploadImage = async (file: string) => {
    try {
      if (!file) {
        console.log('Por favor, tome una imagen primero');
        setLoading(false);
        setEsperandoRespuesta(false);
        ToastAndroid.show(
          'Please capture the product first',
          ToastAndroid.SHORT,
        );
        return;
      }
      if (servicioIniciado) {
        console.log('-----------> El Servicio está iniciado');
        const presignedUrlAndID = await getPresignedUrlAndID();

        await putFileToS3(presignedUrlAndID.presigned_url, file);
        // ToastAndroid.show('The image is uploaded', ToastAndroid.SHORT);

        console.log('-----------> La imágen se ha subido con éxito');

        navegation.navigate('Response', {
          id: presignedUrlAndID.uuid,
          proyectName: params.proyectName,
          modelId: params.modelId,
          uri: file,
        });

        setTimeout(() => {
          setEsperandoRespuesta(false);
          setLoading(false);
        }, 1500);
      } else {
        ToastAndroid.show(
          'The service is not available, please try again later.',
          ToastAndroid.SHORT,
        );
        console.log('-----------> El servicio no está levantado');
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      console.log('Error al subir la imagen.');
    }
  };

  const getPresignedUrlAndID = async () => {
    try {
      const response = await fetch(
        apiUrls.imageUrl +
          `?project=${encodeURIComponent(
            params.proyectName,
          )}&model=${encodeURIComponent(params.modelId)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) {
        throw new Error('La solicitud para obtener el presigned URL falló');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener el presigned URL:', error);
      throw error;
    }
  };

  const getBlob = async (fileUri: string) => {
    const img = await processImage(fileUri, params.width, params.height);
    const resp = await fetch(img);
    const imageBody = await resp.blob();
    return imageBody;
  };

  // const getBlob = async (fileUri: string) => {
  //   const resizedImageUri = await ImageResizer.createResizedImage(
  //     fileUri,
  //     2213,
  //     3930,
  //     'JPEG',
  //     100,
  //     0,
  //     undefined,
  //   );
  //   // `resizedImageUri` contiene la nueva URI de la imagen redimensionada
  //   const resp = await fetch(resizedImageUri.uri);
  //   const imageBody = await resp.blob();
  //   return imageBody;
  // };

  const putFileToS3 = async (url: string, file: string) => {
    console.log('---------------URL SUBIDA----->>' + url);
    const imageData = await getBlob(file);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/*',
      },
      body: imageData,
    });
  };

  return (
    <View style={{...globalStyles.centerContainer}}>
      {servicioIniciado && !esperandoRespuesta && (
        <View style={{...globalStyles.centerContainer, padding: 10}}>
          <View>
            <Text style={styles.subtitle1}>This use case will detect</Text>

            <Text style={{...styles.subtitle2, paddingBottom: 16}}>
              defects on your mobile screen
            </Text>
          </View>

          <View>
            <Text style={styles.subtitle1}>Please capture the</Text>

            <Text style={{...styles.subtitle1, paddingBottom: 16}}>
              {' '}
              <Text style={styles.subtitle2}>entire product, centered</Text> on
              the screen
            </Text>
          </View>

          <Button
            mode="contained"
            style={{marginBottom: 16, marginTop: 24}}
            onPress={async () => {
              const uriPhoto = await CameraAdapter.takePicture();

              console.log('************ FILE ***************', uriPhoto[0]);
              setLoading(true);
              setEsperandoRespuesta(true);
              uploadImage(uriPhoto[0]);
            }}>
            Capture the product
          </Button>
        </View>
      )}

      {loading && (
        <ActivityIndicator
          animating={true}
          color={MyTheme.colors.primary}
          size="large"
        />
      )}

      {esperandoRespuesta && (
        <Text>Your product is being uploaded to the cloud...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 150, // ajusta el tamaño de la imagen según tus necesidades
    height: 150,
    resizeMode: 'contain', // puedes usar 'cover', 'stretch', etc. según tus necesidades
    marginBottom: 16,
  },

  subtitle1: {
    fontSize: 20,
    fontWeight: '200',
    color: '#262626',
    textAlign: 'center',
  },

  subtitle2: {
    fontSize: 20,
    fontWeight: '600',
    color: '#262626',
    textAlign: 'center',
  },
});
