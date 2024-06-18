import {Text, View, StyleSheet, Image, ActivityIndicator} from 'react-native';
import {MyTheme, globalStyles} from '../theme/global.styles';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {RootStackParamList} from '../routes/StackNavigator';
import {useEffect, useState} from 'react';
import {apiUrls} from './../config/urlsBuilder';
import {Button} from 'react-native-paper';

export const ResponseScreen = () => {
  const params = useRoute<RouteProp<RootStackParamList, 'Response'>>().params;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [estadoRespuesta, setEstadoRespuesta] = useState('sin respuesta');
  const [respuesta, setRespuesta] = useState(false);
  const [confidence, setConfidence] = useState(0);

  const waitResponse = async () => {
    const response = await getResponse(
      params.id,
      params.proyectName,
      params.modelId,
    );
    switch (response.status) {
      case 'completed':
        console.log(
          '***************** Se ha completado y el resultado es: ',
          response.isAnomalous,
        );
        setLoading(false);
        setEstadoRespuesta('completed');
        setConfidence(Math.round(response.confidence * 100));
        setRespuesta(response.isAnomalous);
        break;

      default:
        console.log('******* FALLO EN LA RESPUESTA *********');

        setLoading(false);
        setEstadoRespuesta('failed');
        break;
    }
  };
  useEffect(() => {
    setLoading(true);
    waitResponse();
  }, []);
  const getResponse = async (
    id: string,
    proyectName: string,
    modelId: number,
    attempt = 1,
  ): Promise<any> => {
    try {
      // Esperar 3 segundos antes de hacer la llamada
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Hacer la solicitud HTTP
      const response = await fetch(
        apiUrls.result +
          `?project=${encodeURIComponent(
            proyectName,
          )}&model=${encodeURIComponent(modelId)}&imageId=${encodeURIComponent(
            id,
          )}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        // throw new Error('La solicitud para obtener la respuesta falló');
        setLoading(false);
        setEstadoRespuesta('failed');
      }

      const data = await response.json();

      console.log('************ INTENTO ', attempt);
      console.log('*************** STATUS', data.status);

      // Verificar los estados 'completed' o 'failed'
      if (data.status === 'completed' || data.status === 'failed') {
        console.log('Proceso completado:', data);
        return data; // Detener si el proceso está completado o ha fallado
      } else if (attempt < 10) {
        // Llamar de nuevo a la función si no se han alcanzado 10 intentos
        console.log('Reintentando, intento número:', attempt);
        return getResponse(id, proyectName, modelId, attempt + 1);
      } else {
        // Máximo de intentos alcanzado sin completar o fallar
        console.log('Máximo de intentos alcanzado');
        return data;
      }
    } catch (error) {
      console.error('Error en la solicitud para obtener la respuesta:', error);
      throw error; // Propagar el error para manejarlo más arriba si es necesario
    }
  };

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
              <View
                style={{
                  ...styles.mascara,
                }}>
                <View
                  style={{
                    ...styles.confidence,
                    backgroundColor: respuesta ? '#DF1642' : '#18A957',
                  }}>
                  <Text style={styles.confidenceText}>
                    {respuesta ? 'ANOMALY' : 'NORMAL'}
                  </Text>
                  <Text style={styles.confidenceTextSmall}>
                    Confidence level {confidence}%{' '}
                  </Text>
                </View>
              </View>
            </View>
          }

          <View style={styles.cardWrap}>
            <Text style={styles.subtitle2}>Do you agree with the result?</Text>
            <Text style={styles.subtitle1}>
              Your feedback will help us improve the AI model
            </Text>
            <View style={styles.cardWrapRow}>
              <Button
                mode="contained"
                style={{marginBottom: 16, marginTop: 24, width: 80}}
                onPress={async () => {
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'Inicio'}],
                  });
                }}>
                Yes
              </Button>

              <Button
                mode="contained"
                style={{marginBottom: 16, marginTop: 24, width: 80}}
                onPress={async () => {
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'Inicio'}],
                  });
                }}>
                No
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

          <Text>Your product is being analyzed by AI...</Text>
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
    backgroundColor: 'red',
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
    padding: 16,
    paddingTop: 24,
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
