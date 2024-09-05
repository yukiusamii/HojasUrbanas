import {
  Text,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  ToastAndroid,
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
import {usePlantStore} from '../store/plant-store';

export const AddPlantByPhotoScreen = () => {
  const params = useRoute<RouteProp<RootStackParamList, 'Response'>>().params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [estadoRespuesta, setEstadoRespuesta] = useState('sin respuesta');
  const [confidence, setConfidence] = useState(0);
  const [name, setName] = useState('');
  const plantas = useAllStore(state => state.plantas);
  const addPlant = usePlantStore(state => state.addPlant);
  const [img, setImg] = useState('');

  const addToMyPlants = async () => {
    const plantaEncontrada = plantas.find(planta =>
      planta.nombre_comun.toLowerCase().includes(name.toLowerCase()),
    );

    if (plantaEncontrada) {
      addPlant(
        plantaEncontrada.nombre_comun,
        plantaEncontrada.img_url,
        plantaEncontrada.id,
        plantaEncontrada.riego.verano,
        plantaEncontrada.fertilizacion,
      );
      navigation.goBack();
    } else {
      console.log('Planta no encontrada');
      Alert.alert('Error', 'Planta no encontrada.');
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
      console.log('********* RESPUESTA FAILED ********', error);
      setLoading(false);
      setEstadoRespuesta('failed');
    }
  };

  useEffect(() => {
    if (params.uri) {
      setImg(params.uri);
      getResponse(params.uri);
    } else {
      console.log('No hay URI');
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
          {
            <View style={styles.container}>
              <Image source={{uri: img}} style={styles.image} />
            </View>
          }

          <View style={styles.cardWrap}>
            <Text
              style={{
                ...globalStyles.headlineSmall,
                color: MyTheme.colors.black,
                textAlign: 'center',
              }}>
              Es una{' '}
              <Text
                style={{
                  ...globalStyles.headlineSmall,
                  color: MyTheme.colors.primary,
                  textAlign: 'center',
                }}>
                {name}
              </Text>{' '}
            </Text>
            <Text style={{...globalStyles.bodyLarge, textAlign: 'center'}}>
              con un nivel de confianza del {confidence}%
            </Text>

            <View style={styles.btnWrap}>
              <View style={styles.cardWrapRow}>
                <Button
                  mode="contained"
                  icon="add"
                  onPress={async () => {
                    addToMyPlants();
                  }}>
                  Añadir a mis plantas
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
                        setImg(uriPhoto[0]);
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

          <Text style={{color: MyTheme.colors.accent}}>
            La planta está siendo analizada...
          </Text>
        </View>
      )}

      {!loading && estadoRespuesta === 'failed' && (
        <View style={globalStyles.centerContainer}>
          <Text style={{...globalStyles.subtitle2, textAlign: 'center'}}>
            Lo lamentamos, la predicción ha fallado.
          </Text>
          <Text style={{...globalStyles.subtitle2, textAlign: 'center'}}>
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
                  setImg(uriPhoto[0]);
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
  mascara: {
    position: 'absolute',
    width: '80%',
    height: '90%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
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
  confidence: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '90%',
    borderRadius: 10,
  },

  confidenceText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },

  confidenceTextSmall: {
    fontSize: 16,
    fontWeight: '400',
    color: '#fff',
    textAlign: 'center',
  },

  cardWrapRow: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  subtitle1: {
    fontSize: 18,
    fontWeight: '300',
    color: '#262626',
    textAlign: 'center',
  },

  subtitle2: {
    fontSize: 20,
    fontWeight: '600',
    color: '#262626',
    textAlign: 'center',
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
