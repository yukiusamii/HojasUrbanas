import {Text, View, StyleSheet, Image, ActivityIndicator} from 'react-native';
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
import {Button} from 'react-native-paper';
import axios from 'axios';

export const ResponseScreen = () => {
  const params = useRoute<RouteProp<RootStackParamList, 'Response'>>().params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [estadoRespuesta, setEstadoRespuesta] = useState('sin respuesta');
  const [respuesta, setRespuesta] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [name, setName] = useState('');

  const waitResponse = async () => {
    const formData = new FormData();

    // Leer el archivo como blob o base64 si es necesario
    const file = {
      uri: params.uri,
      name: 'image.jpg',
      type: 'image/jpeg', // Cambia esto si el tipo es diferente
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
      console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
      console.log(JSON.stringify(response.data));
      setLoading(false);
      setEstadoRespuesta('completed');
      setConfidence(response.data.precision);
      setName(response.data.nombre);
    } catch (error) {
      console.error(error);
    }

    // setTimeout(() => {
    //   setLoading(false);
    //   setEstadoRespuesta('completed');
    //   setConfidence(Math.round(0.94 * 100));
    //   setRespuesta(false);
    // }, 4500);
  };
  useEffect(() => {
    setLoading(true);
    waitResponse();
  }, []);
  // const getResponse = async (
  //   id: string,
  //   proyectName: string,
  //   modelId: number,
  //   attempt = 1,
  // ): Promise<any> => {
  //   try {
  //     // Esperar 3 segundos antes de hacer la llamada
  //     await new Promise(resolve => setTimeout(resolve, 3000));

  //     // Hacer la solicitud HTTP
  //     const response = await fetch(
  //       apiUrls.result +
  //         `?project=${encodeURIComponent(
  //           proyectName,
  //         )}&model=${encodeURIComponent(modelId)}&imageId=${encodeURIComponent(
  //           id,
  //         )}`,
  //       {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       },
  //     );

  //     if (!response.ok) {
  //       // throw new Error('La solicitud para obtener la respuesta falló');
  //       setLoading(false);
  //       setEstadoRespuesta('failed');
  //     }

  //     const data = await response.json();

  //     console.log('************ INTENTO ', attempt);
  //     console.log('*************** STATUS', data.status);

  //     // Verificar los estados 'completed' o 'failed'
  //     if (data.status === 'completed' || data.status === 'failed') {
  //       console.log('Proceso completado:', data);
  //       return data; // Detener si el proceso está completado o ha fallado
  //     } else if (attempt < 10) {
  //       // Llamar de nuevo a la función si no se han alcanzado 10 intentos
  //       console.log('Reintentando, intento número:', attempt);
  //       return getResponse(id, proyectName, modelId, attempt + 1);
  //     } else {
  //       // Máximo de intentos alcanzado sin completar o fallar
  //       console.log('Máximo de intentos alcanzado');
  //       return data;
  //     }
  //   } catch (error) {
  //     console.error('Error en la solicitud para obtener la respuesta:', error);
  //     throw error; // Propagar el error para manejarlo más arriba si es necesario
  //   }
  // };

  return (
    <View style={{...globalStyles.centerContainer, margin: 0, padding: 0}}>
      {estadoRespuesta === 'completed' && (
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
              <Image source={{uri: params.uri}} style={styles.image} />
            </View>
          }

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
              con una confianza del {confidence}%
            </Text>
            <View style={styles.cardWrapRow}>
              <Button
                mode="contained"
                style={{marginBottom: 16, marginTop: 24}}
                onPress={async () => {}}>
                Ver más información
              </Button>
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
        <Text style={globalStyles.subtitle2}>
          We're sorry, the response failed. Please try again.
        </Text>
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
});
