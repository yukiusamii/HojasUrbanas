import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ResponseScreen} from '../screens/ResponseScreen';
import {UploadPhotoScreen} from '../screens/UploadPhotoScreen';
import {ModelListScreen} from '../screens/ModelListScreen';
import {NameScreen} from '../screens/NameScreen';
import {MyTheme, globalStyles} from '../theme/global.styles';

// Definir los tipos para los parámetros de cada pantalla
export type RootStackParamList = {
  Model: {modelId: number; proyectName: string; height: number; width: number}; // No espera parámetros
  Response: {id: string; uri: string; modelId: number; proyectName: string}; // Espera un parámetro 'myData' de tipo string
  List: undefined;
  Inicio: undefined;
  Reconocimiento: undefined;
  Respuesta: {uri: string};
};

// Crear el stack navigator usando los tipos definidos
const Stack = createNativeStackNavigator<RootStackParamList>();

export const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerStyle: {
          backgroundColor: MyTheme.colors.primary, // Cambia el color de fondo del header
        },
        headerTintColor: '#fff', // Cambia el color del texto del header
        headerTitleStyle: {
          fontWeight: 'bold', // Cambia el estilo del título del header
        },
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="Inicio"
        component={NameScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen name="List" component={ModelListScreen} />
      <Stack.Screen name="Model" component={UploadPhotoScreen} />
      <Stack.Screen name="Response" component={ResponseScreen} />
      <Stack.Screen name="Respuesta" component={ResponseScreen} />
      <Stack.Screen
        name="Reconocimiento"
        component={UploadPhotoScreen}
        options={{headerTitle: 'Subida imagen'}}
      />
    </Stack.Navigator>
  );
};
