import React, {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Alert, Image, Pressable, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {type RootStackParamList} from '../routes/BottomTabsNavegator';
import {MyTheme, globalStyles} from '../theme/global.styles';
import firestore from '@react-native-firebase/firestore';

GoogleSignin.configure({
  webClientId:
    '572226988876-ahrucc2v0qd3gfh5quki8anigc7nlug8.apps.googleusercontent.com',
});
import {useCallback} from 'react';
import {useProfileStore} from '../store/profile-store';
import {useCartStore} from '../store/cart-store';
import {usePlantStore} from '../store/plant-store';

async function onGoogleButtonPress() {
  try {
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  } catch (error) {
    Alert.alert(
      'Error',
      'Se ha producido un error al iniciar sesión con Google.',
    );
  }
}

const saveUserToFirestore = async () => {
  const user = auth().currentUser;

  if (user) {
    try {
      const userDoc = await firestore()
        .collection('usuarios')
        .doc(user.uid)
        .get();

      if (!userDoc.exists) {
        await firestore().collection('usuarios').doc(user.uid).set({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: firestore.FieldValue.serverTimestamp(),
          firtTime: true,
        });
        console.log('Usuario guardado en Firestore!');
      } else {
        console.log('El usuario ya existe en Firestore.');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'No se ha podido registrar el usuario en la base de datos.',
      );
    }
  } else {
    Alert.alert('Error', 'Usuario no autenticado.');
  }

  return user;
};

export const AuthScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const changeProfile = useProfileStore(state => state.changeProfile);
  const setProductos = useCartStore(state => state.setProductos);
  const setMisPlantas = usePlantStore(state => state.setMisPlantas);

  const fillProfile = async (user: any) => {
    try {
      const userdataSnapshot = await firestore()
        .collection('usuarios')
        .doc(user?.uid)
        .get();

      const userdata = userdataSnapshot.data();
      if (userdata) {
        if (userdata.firtTime) {
          changeProfile(
            userdata.uid,
            userdata.name,
            '',
            userdata.email,
            userdata.photoURL || undefined,
            '',
            '',
          );
          navigation.navigate('EditProfile', {firstTime: true});
        } else {
          changeProfile(
            userdata.uid,
            userdata.name,
            userdata.userName,
            userdata.email,
            userdata.photoURL || undefined,
            userdata.biografia,
            userdata.direccion,
          );

          if (userdata.misPlantas) {
            setMisPlantas(userdata.misPlantas);
          }
          if (userdata.miCarrito) {
            setProductos(userdata.miCarrito);
          }
          navigation.navigate('MainTabs');
        }
      } else {
        Alert.alert(
          'Error',
          'No se han encontrado el usuario en la base de datos.',
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se han podido obtener los datos del usuario.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await onGoogleButtonPress();
      console.log('Inició sesión con Google!');
      const user = await saveUserToFirestore();
      if (user) {
        fillProfile(user);
      } else {
        Alert.alert('Error', 'Usuario no guardado en la base de datos.');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Se ha producido un error durante el flujo de inicio de sesión.',
      );
    }
  };

  return (
    <View style={globalStyles.centerContainer}>
      <Image source={require('../../assets/img/iniciar_sesion.png')} />
      <Pressable
        style={({pressed}) => [
          styles.googleBtn,
          pressed && styles.googleBtnPressed,
        ]}
        onPress={handleGoogleLogin}>
        <Image source={require('../../assets/img/google_btn.png')} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  googleBtn: {
    borderRadius: 43,
    shadowColor: 'rgba(30, 30, 30, 0.6)',
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 5,
    marginTop: 20,
  },
  googleBtnPressed: {
    elevation: 1,
  },
});
