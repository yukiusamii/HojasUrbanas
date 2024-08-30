import {
  Text,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  ToastAndroid,
  Alert,
} from 'react-native';
import {MyTheme, globalStyles} from '../theme/global.styles';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {RootStackParamList} from '../routes/BottomTabsNavegator';
import {useEffect, useState} from 'react';
import {apiUrls} from './../config/urlsBuilder';
import {Button, IconButton} from 'react-native-paper';
import axios from 'axios';
import {CameraAdapter} from '../adapters/camera-adapter';
import {useAllStore} from '../store/all-store';

export const ResponseScreen = () => {
  const params = useRoute<RouteProp<RootStackParamList, 'Response'>>().params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [estadoRespuesta, setEstadoRespuesta] = useState('sin respuesta');
  const [confidence, setConfidence] = useState(0);
  const [name, setName] = useState('');
  const plantas = useAllStore(state => state.plantas);

  const goToInfo = async () => {
    try {
      const plantaEncontrada = plantas.find(
        planta => planta.nombre_comun === name,
      );

      if (plantaEncontrada) {
        const idPlanta = plantaEncontrada.id;
        const typePlanta = plantaEncontrada.type;

        console.log('ID de la planta encontrada:', idPlanta);
        navigation.navigate('Detail', {id: idPlanta, type: typePlanta});
      } else {
        Alert.alert('Error', 'Planta no encontrada.');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al navegar a la información de la planta.');
    }
  };

  const getResponse = async (uri: string) => {
    setLoading(true);
    const formData = new FormData();
    const file = {
      uri: uri,
      name: 'image.jpg',
      type: 'image/jpeg',
    };
    formData.append('image', file);
    try {
      const response = await axios.post(
        'https://major-honestly-mallard.ngrok-free.app/predict',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      setLoading(false);
      setEstadoRespuesta('completed');
      setConfidence(response.data.precision);
      setName(response.data.nombre);
    } catch (error) {
      setLoading(false);
      setEstadoRespuesta('failed');

      Alert.alert('Error', 'Error al obtener la respuesta de predicción.');
    }
  };

  useEffect(() => {
    try {
      getResponse(params.uri);
    } catch (error) {
      console.error('Error en useEffect al obtener la respuesta:', error);
      Alert.alert('Error', 'Error al obtener la respuesta de predicción.');
    }
  }, []);

  return (
    <View style={{...globalStyles.centerContainer, margin: 0, padding: 0}}>
      <IconButton
        style={styles.back}
        icon="arrow-back"
        size={35}
        iconColor={MyTheme.colors.accent}
        onPress={() => {
          navigation.goBack();
        }}
      />
      {!loading && estadoRespuesta === 'completed' && (
        <View
          style={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <View style={styles.container}>
            <Image source={{uri: params.uri}} style={styles.image} />
          </View>

          <View style={styles.cardWrap}>
            <Text
              style={{
                ...globalStyles.headlineSmall,
                color: MyTheme.colors.black,
              }}>
              Es una{' '}
              <Text
                style={{
                  ...globalStyles.headlineSmall,
                  color: MyTheme.colors.primary,
                }}>
                {name}
              </Text>{' '}
            </Text>
            <Text style={globalStyles.bodyLarge}>
              con un nivel de confianza del {confidence}%
            </Text>

            <View style={styles.btnWrap}>
              <View style={styles.cardWrapRow}>
                <Button
                  mode="contained"
                  icon="information-circle-outline"
                  onPress={async () => {
                    try {
                      await goToInfo();
                    } catch (error) {
                      console.error(
                        'Error al intentar ver más información:',
                        error,
                      );
                    }
                  }}>
                  Ver más información
                </Button>
              </View>
              <View style={styles.cardWrapRow}>
                <Button
                  mode="outlined"
                  icon="camera-outline"
                  onPress={async () => {
                    try {
                      const uriPhoto = await CameraAdapter.takePicture();
                      if (uriPhoto && uriPhoto.length > 0) {
                        getResponse(uriPhoto[0]);
                      } else {
                        ToastAndroid.show(
                          'No se ha tomado ninguna foto.',
                          ToastAndroid.SHORT,
                        );
                      }
                    } catch (error) {
                      Alert.alert(
                        'Error',
                        'Se ha producido un error al tomar la foto.',
                      );
                    }
                  }}>
                  Capturar otra planta
                </Button>
              </View>
            </View>
          </View>
        </View>
      )}

      {loading && (
        <View style={styles.container}>
          <ActivityIndicator
            animating={true}
            color={MyTheme.colors.primary}
            size="large"
          />

          <Text>La planta está siendo analizada...</Text>
        </View>
      )}

      {!loading && estadoRespuesta === 'failed' && (
        <View style={globalStyles.centerContainer}>
          <Text style={globalStyles.subtitle2}>
            Lo lamentamos, la predicción ha fallado.
          </Text>
          <Text style={globalStyles.subtitle2}>
            Por favor, inténtelo de nuevo.
          </Text>
          <Button
            mode="contained"
            icon="camera-outline"
            style={{marginBottom: 16, marginTop: 24}}
            onPress={async () => {
              try {
                const uriPhoto = await CameraAdapter.takePicture();
                if (uriPhoto && uriPhoto.length > 0) {
                  getResponse(uriPhoto[0]);
                } else {
                  console.log('Captura de foto cancelada o fallida.'); // ****ERROR**** Manejar el caso en que la captura sea cancelada o falle.
                }
              } catch (error) {
                console.error(
                  'Error al capturar y analizar una nueva planta:',
                  error,
                ); // ****ERROR**** Manejar errores al capturar y analizar una nueva planta.
              }
            }}>
            Capturar planta
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    minWidth: 400,
    height: '100%',
    minHeight: 500,
    objectFit: 'cover',
    position: 'absolute',
  },
  cardWrap: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    paddingTop: 40,
    backgroundColor: 'white',
    width: '100%',
  },
  cardWrapRow: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  back: {
    backgroundColor: 'rgba(212, 245, 212, 0.6)',
    position: 'absolute',
    left: 4,
    top: 4,
    zIndex: 9999,
  },
  btnWrap: {
    ...globalStyles.colCenterCenter,
    gap: 16,
    marginBottom: 16,
    marginTop: 24,
  },
});
