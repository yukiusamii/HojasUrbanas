import {View, Text, Animated, StyleSheet} from 'react-native';
import {CameraAdapter} from '../adapters/camera-adapter';
import {Button} from 'react-native-paper';
import {useEffect, useRef} from 'react';
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {type RootStackParamList} from '../routes/BottomTabsNavegator';
import {white} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import {MyTheme, globalStyles} from '../theme/global.styles';

export const NameScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      // console.log(
      //   '*******************HOLA PANTALLA DE INICIO **************************',
      // );
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{name: 'Auth'}],
        });
      }, 1500);
    });
  }, [fadeAnim, navigation]);
  return (
    <View
      style={{
        ...globalStyles.centerContainer,
        backgroundColor: MyTheme.colors.tertiary100,
      }}>
      {/* <Text style={globalStyles.title}>PQI</Text> */}
      <Animated.Image
        source={require('../../assets/img/logo_hojas_urbanas_sin_fondo.png')}
        style={{...styles.image, opacity: fadeAnim}}></Animated.Image>
      <Animated.Text
        style={{
          ...globalStyles.headlineLarge,
          opacity: fadeAnim,
        }}>
        Hojas Urbanas
      </Animated.Text>

      {/* <Animated.Text
        style={{
          ...styles.subtitle2,
          opacity: fadeAnim,
        }}>
        Portable Quality Inspection Showcase
      </Animated.Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 8,
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
