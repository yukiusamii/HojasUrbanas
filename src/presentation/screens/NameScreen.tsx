import {View, Text, Animated, StyleSheet} from 'react-native';
import {CameraAdapter} from '../adapters/camera-adapter';
import {globalStyles} from '../theme/global.styles';
import {Button} from 'react-native-paper';
import {useEffect, useRef} from 'react';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../routes/StackNavigator';
import {white} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

export const NameScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000, // Duración de la animación en milisegundos
      useNativeDriver: true, // Mejora el rendimiento al usar el controlador nativo
    }).start(() => {
      // Callback que se ejecuta después de la animación
      console.log(
        '*******************HOLA PANTALLA DE INICIO **************************',
      );
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{name: 'List'}],
        }); // Reemplaza con el nombre de la pantalla a la que deseas navegar
      }, 1500); // Reemplaza con el nombre de la pantalla a la que deseas navegar
    });
  }, [fadeAnim, navigation]);
  return (
    <View
      style={{
        ...globalStyles.centerContainer,
        backgroundColor: '#E20074',
      }}>
      {/* <Text style={globalStyles.title}>PQI</Text> */}
      <Animated.Image
        source={require('../../assets/img/iconPQI.png')}
        style={{...styles.image, opacity: fadeAnim}}></Animated.Image>
      <Animated.Text
        style={{
          ...styles.subtitle1,
          opacity: fadeAnim,
        }}>
        Welcome to the
      </Animated.Text>

      <Animated.Text
        style={{
          ...styles.subtitle2,
          opacity: fadeAnim,
        }}>
        Portable Quality Inspection Showcase
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 130, // ajusta el tamaño de la imagen según tus necesidades
    height: 130,
    resizeMode: 'contain', // puedes usar 'cover', 'stretch', etc. según tus necesidades
    marginBottom: 16,
  },

  subtitle1: {
    fontSize: 30,
    fontWeight: '200',
    color: 'white',
    textAlign: 'center',
  },

  subtitle2: {
    fontSize: 30,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});
