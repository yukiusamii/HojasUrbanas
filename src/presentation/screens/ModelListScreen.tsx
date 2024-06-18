import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {MyTheme, globalStyles} from '../theme/global.styles';
import {Button, IconButton, List, MD3Colors, shadow} from 'react-native-paper';
import {Pressable} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../routes/StackNavigator';
import {apiUrls} from './../config/urlsBuilder';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

export const ModelListScreen = () => {
  // models?suser=12345
  // Define una interfaz para los elementos de la List de Models
  interface Model {
    modelId: number;
    modelName: string;
  }

  // Define una interfaz para el objeto principal que incluye la List de Models
  interface Data {
    userId: string;
    projectName: string;
    modelList: Model[];
    width: number;
    height: number;
    status: string;
  }
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);
  const [loadingCambioEStadoModelo, setLoadingCambioEStadoModelo] =
    useState(false);

  const [estadoModel, setEstadoModel] = useState('-');
  const [data, setData] = useState<Data | null>(null);

  const startStopService = async (
    proyectName: string,
    modelId: number,
    start: boolean,
  ) => {
    try {
      const requestBody = {
        project: proyectName,
        model: modelId.toString(),
      };

      let url = start ? apiUrls.startService : apiUrls.stopService;

      const response = await axios.post(
        url,
        requestBody, // Enviar un objeto vacío si no hay datos para enviar en el cuerpo de la solicitud, o eliminar este argumento si es innecesario
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Respuesta: ', response.data.message);

      console.log(
        'Retorno: ',
        response.data.message === 'Model started successfully',
      );
      // Verificamos el mensaje en la respuesta para determinar el éxito
      await new Promise(resolve => setTimeout(resolve, 5000));
      return response.data.message;
    } catch (error: any) {
      // axios encapsula los errores en un objeto 'error.response' si el error proviene de una respuesta HTTP no exitosa
      if (error.response) {
        // La solicitud se realizó y el servidor respondió con un estado de error
        console.error('Error al iniciar el servicio:', error.response.data);
      } else if (error.request) {
        // La solicitud se realizó pero no se recibió respuesta
        console.error(
          'Error al iniciar el servicio: No se recibió respuesta',
          error.request,
        );
      } else {
        // Algo más causó un error en la solicitud
        console.error('Error:', error.message);
      }
      throw error;
    }
  };

  const getModels = async () => {
    try {
      const response = await fetch(apiUrls.models + '?user=12345', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('La solicitud para obtener los Models falló');
      }

      const data = await response.json();
      setData(data);
      console.log('RESPONSE', data);
      return data; // Asegúrate de que este sea el camino correcto al URL en la respuesta de tu servidor.
    } catch (error) {
      console.error('Error al obtener los Models:', error);
      throw error;
    }
  };

  const getModelStatus = async () => {
    console.log(
      '--------------------------->>>>>>',
      apiUrls.modelStatus + '?project=PQI_Showcase_Screens&model=3',
    );
    try {
      const response = await fetch(
        apiUrls.modelStatus + '?project=PQI_Showcase_Screens&model=3',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!response.ok) {
        throw new Error('La solicitud para obtener los ModelStatus falló');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener los ModelStatus:', error);
      throw error;
    }
  };

  const waitModel = async () => {
    const response = await getModels();

    switch (response.status) {
      case 'OK':
        let modelStatus = await getModelStatus();

        if (modelStatus.Model.Status === 'HOSTED') {
          setEstadoModel('ON');
        } else {
          setEstadoModel('OFF');
        }
        setLoading(false);
        break;

      default:
        console.log('******* FALLO AL OBTENER EL Modelo *********');
        break;
    }
  };

  const waitModelRecursive = async (attempt = 1) => {
    setLoadingCambioEStadoModelo(true);

    await new Promise(resolve => setTimeout(resolve, 30000));

    const modelStatus = await getModelStatus();

    if (modelStatus.Model.Status !== 'HOSTED' && attempt < 40) {
      waitModelRecursive(attempt + 1);
    } else if (modelStatus.Model.Status === 'HOSTED') {
      // parar cargas
      setLoadingCambioEStadoModelo(false);
      setEstadoModel('ON');
      ToastAndroid.show(
        'The model has been initialized successfully',
        ToastAndroid.SHORT,
      );
    } else if (modelStatus.Model.Status !== 'HOSTED' && attempt >= 40) {
      //parar cargar y decir que no se ha podido iniciar el modelo
      setLoadingCambioEStadoModelo(false);
      ToastAndroid.show(
        'The model could not be initialized, please try again later.',
        ToastAndroid.SHORT,
      );
    }
  };

  useEffect(() => {
    setLoading(true);
    waitModel();
  }, []);
  return (
    // <View style={globalStyles.centerContainer}>
    <View style={globalStyles.topLeftContainer}>
      {!loadingCambioEStadoModelo &&
        !loading &&
        data &&
        data.modelList.map(model => (
          <Pressable
            key={model.modelId} // Usar modelId como key para cada elemento
            style={({pressed}) => [
              styles.listItem,
              pressed && styles.listItemPressed,
            ]}
            onPress={() => {
              if (estadoModel === 'ON') {
                navigation.navigate('Model', {
                  modelId: model.modelId,
                  proyectName: data.projectName,
                  width: data.width,
                  height: data.height,
                });
              } else {
                ToastAndroid.show('Model status OFF', ToastAndroid.SHORT);
              }
            }}>
            <View style={styles.cardWrap}>
              <Text style={styles.cardTitle}>{model.modelName}</Text>

              <Text style={styles.cardSubtitle}>Mobile screen defects</Text>
            </View>

            <View style={styles.cardWrapRow}>
              {/* <Text
                style={{
                  ...styles.cardTitle,
                  fontWeight: '100',
                  color: MyTheme.colors.accent,
                }}>
                Status:
              </Text> */}
              {/* <Text
                style={[
                  styles.status,
                  estadoModel === 'ON'
                    ? styles.greenText
                    : estadoModel === 'OFF'
                    ? styles.redText
                    : styles.status,
                ]}>
                {estadoModel}
              </Text> */}

              {/* <Icon
                name="power"
                size={32}
                color={estadoModel === 'ON' ? '#18A957' : '#DF1642'}
              /> */}

              <IconButton
                icon="power"
                iconColor={estadoModel === 'ON' ? '#18A957' : '#DF1642'}
                size={32}
                onPress={() => {
                  if (estadoModel === 'ON') {
                    console.log('MODELO ON');
                    startStopService(data.projectName, model.modelId, false);
                    setEstadoModel('OFF');
                    ToastAndroid.show(
                      'The model has been stopped successfully',
                      ToastAndroid.SHORT,
                    );
                  } else {
                    console.log('MODELO OFF');
                    startStopService(data.projectName, model.modelId, true);
                    waitModelRecursive();
                  }
                }}
              />
            </View>
          </Pressable>
        ))}

      {!loadingCambioEStadoModelo && loading && (
        <View style={styles.loadingAlign}>
          <ActivityIndicator
            animating={true}
            color={MyTheme.colors.primary}
            size="large"
          />

          <Text>Loading Models...</Text>
        </View>
      )}

      {loadingCambioEStadoModelo && (
        <View style={styles.loadingAlign}>
          <ActivityIndicator
            animating={true}
            color={MyTheme.colors.primary}
            size="large"
          />

          <Text>Initializing model......</Text>
        </View>
      )}

      {/* {loading && (
        <Text style={{alignSelf: 'center'}}>Cargando Models...</Text>
      )} */}
    </View>
  );
};
{
  /* {loading && (
        <ActivityIndicator
          animating={true}
          color={MyTheme.colors.primary}
          size="large"
        />
      )}

      {loading && <Text>Cargando Models...</Text>}
    </View> */
}

const styles = StyleSheet.create({
  listItem: {
    borderRadius: 10,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 80,
    padding: 10,
    backgroundColor: 'white',
    shadowColor: 'rgba(30, 30, 30, 0.6)',
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 10,
  },
  listItemPressed: {
    // backgroundColor: 'rgba(165, 165, 165, 0.1)',
    elevation: 5,

    // shadowColor: 'white',
  },

  loadingAlign: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  cardTitle: {
    fontSize: 18,
    color: MyTheme.colors.primary,
    fontWeight: '500',
    paddingBottom: 6,
  },

  status: {
    fontSize: 18,
    color: MyTheme.colors.accent,
    fontWeight: '500',
  },

  cardSubtitle: {
    fontSize: 16,
    color: MyTheme.colors.accent,
    fontWeight: '200',
  },

  cardWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  cardWrapRow: {
    display: 'flex',
    justifyContent: 'center',
    // alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 6,
  },

  greenText: {
    color: '#18A957',
  },
  redText: {
    color: '#DF1642',
  },
});
