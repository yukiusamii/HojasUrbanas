import React from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {type RootStackParamList} from '../routes/BottomTabsNavegator';
import {MyTheme, globalStyles} from '../theme/global.styles';
import firestore from '@react-native-firebase/firestore';

GoogleSignin.configure({
  webClientId:
    '572226988876-ahrucc2v0qd3gfh5quki8anigc7nlug8.apps.googleusercontent.com', // Este es el clientId del archivo google-services.json
});

async function onGoogleButtonPress() {
  // Obtén las credenciales de autenticación de Google
  const {idToken} = await GoogleSignin.signIn();

  // Crea una credencial de Firebase con el token de Google
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Inicia sesión en Firebase con la credencial de Google
  return auth().signInWithCredential(googleCredential);
}

const saveUserToFirestore = async () => {
  const user = auth().currentUser;

  if (user) {
    // Verificar si el usuario ya existe
    const userDoc = await firestore()
      .collection('usuarios')
      .doc(user.uid)
      .get();

    if (!userDoc.exists) {
      // Crear un nuevo documento para el usuario
      await firestore()
        .collection('usuarios')
        .doc(user.uid)
        .set({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          console.log('Usuario guardado en Firestore!');
        })
        .catch(error => {
          console.error('Error al guardar el usuario en Firestore: ', error);
        });
    } else {
      console.log('El usuario ya existe en Firestore.');
    }
  }
};

export const AuthScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View>
      <Button
        mode="contained"
        style={{marginBottom: 16, marginTop: 24}}
        onPress={async () => {
          onGoogleButtonPress().then(() => {
            console.log('Inició sesión con Google!');
            saveUserToFirestore();
          });
        }}>
        Iniciar sesión con Google
      </Button>
    </View>
  );
};
