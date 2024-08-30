import {Alert, Image, StyleSheet, Text, ToastAndroid, View} from 'react-native';
import {useProfileStore} from '../store/profile-store';
import {MyTheme, globalStyles} from '../theme/global.styles';
import FastImage from 'react-native-fast-image';
import {
  Button,
  Dialog,
  IconButton,
  Paragraph,
  Portal,
} from 'react-native-paper';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {type RootStackParamList} from '../routes/BottomTabsNavegator';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useState} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export const InfoProfileScreen = () => {
  const name = useProfileStore(state => state.name);
  const userName = useProfileStore(state => state.userName);
  const email = useProfileStore(state => state.email);
  const photoURL = useProfileStore(state => state.photoURL);
  const bibliografia = useProfileStore(state => state.bibliografia);
  const direccion = useProfileStore(state => state.direccion);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogout = async () => {
    try {
      await auth().signOut(); // Cerrar sesión con Firebase
      navigation.navigate('Auth'); // Navegar a la pantalla de autenticación después del cierre de sesión
      ToastAndroid.show('Sesión cerrada.', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const reauthenticateUser = async () => {
    const user = auth().currentUser;
    if (user) {
      const providerId = user.providerData[0].providerId;

      if (providerId === 'google.com') {
        // Reautenticación con Google
        const {idToken} = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return user.reauthenticateWithCredential(googleCredential);
      } else if (providerId === 'password') {
        // Reautenticación con email y contraseña
        // Aquí debes pedir al usuario que introduzca su contraseña de nuevo
        Alert.alert(
          'Reautenticación requerida',
          'Por favor, inicia sesión nuevamente para continuar.',
          [
            {
              text: 'Aceptar',
              onPress: () => {
                auth().signOut();
                navigation.navigate('Auth');
              },
            },
          ],
        );
        throw new Error('Reautenticación requerida');
      }
      // Agregar otros proveedores de autenticación si es necesario
    }
  };

  const [visible, setVisible] = useState(false); // Controla la visibilidad del modal de confirmación
  const [loading, setLoading] = useState(false);
  const uid = useProfileStore(state => state.uid); // Asumiendo que tienes este estado

  const hideDialog = () => setVisible(false);

  const confirmDeleteAccount = () => {
    setVisible(true); // Mostrar el modal de confirmación
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      setVisible(false); // Ocultar el modal de confirmación

      await reauthenticateUser();

      // Borrar datos del usuario en Firestore
      if (uid) {
        await firestore().collection('usuarios').doc(uid).delete();
      } else {
        Alert.alert(
          'Error',
          'Se ha producido un error al eliminar el usuario.',
        );
      }

      // Eliminar la cuenta del usuario
      const user = auth().currentUser;
      await user?.delete();

      // Aquí puedes agregar la lógica adicional después de la eliminación, como redirigir al usuario a la pantalla de inicio
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error as any).code === 'auth/requires-recent-login'
      ) {
        console.error('Necesita reautenticarse:', error);
        Alert.alert(
          'Reautenticación requerida',
          'Por razones de seguridad, debe volver a iniciar sesión para eliminar su cuenta.',
        );
        await auth().signOut();
        navigation.navigate('Auth');
      } else {
        Alert.alert(
          'Error',
          'Hubo un problema al eliminar la cuenta. Por favor, inténtelo nuevamente.',
        );
      }
    } finally {
      setLoading(false);
      navigation.navigate('Auth');
    }
  };

  return (
    <View style={{backgroundColor: MyTheme.colors.background, flex: 1}}>
      {photoURL ? (
        <FastImage
          style={styles.image}
          source={{
            uri: photoURL,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <Image
          style={styles.image}
          source={require('../../assets/img/default_profile_img.png')}
        />
      )}

      <View style={styles.edit}>
        <Text style={styles.name}>{userName}</Text>
        <IconButton
          icon="create-outline"
          size={30}
          iconColor={MyTheme.colors.accent}
          style={{backgroundColor: 'rgba(212, 245, 212, 0.6)'}}
          onPress={() => {
            navigation.navigate('EditProfile', {firstTime: false});
          }}
        />
      </View>
      <View style={styles.infoContainer}>
        {/* NOMBRE COMPLETO */}
        <View style={styles.infowrap}>
          <Text style={globalStyles.labelMedium}>Nombre Completo</Text>
          <Text
            style={{...globalStyles.bodyLarge, color: MyTheme.colors.black}}>
            {name}
          </Text>
        </View>
        {/* EMAIL */}
        <View style={styles.infowrap}>
          <Text style={globalStyles.labelMedium}>Correo</Text>
          <Text
            style={{...globalStyles.bodyLarge, color: MyTheme.colors.black}}>
            {email}
          </Text>
        </View>

        {/* Dirección */}
        <View style={styles.infowrap}>
          <Text style={globalStyles.labelMedium}>Dirección</Text>
          <Text
            style={{...globalStyles.bodyLarge, color: MyTheme.colors.black}}>
            {direccion}
          </Text>
        </View>

        {/* Bibliografía */}
        <View style={styles.infowrap}>
          <Text style={globalStyles.labelMedium}>Bibliografía</Text>
          <Text
            style={{...globalStyles.bodyLarge, color: MyTheme.colors.black}}>
            {bibliografia}
          </Text>
        </View>

        <Button
          mode="outlined"
          icon="log-out-outline"
          onPress={() => {
            handleLogout();
          }}>
          Cerrar sesión
        </Button>

        <Button
          textColor={'red'}
          mode="outlined"
          icon="trash-outline"
          onPress={confirmDeleteAccount}
          loading={loading} // Mostrar indicador de carga mientras se procesa la eliminación
          disabled={loading} // Deshabilitar botón mientras se elimina
        >
          Eliminar cuenta
        </Button>

        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Confirmar eliminación</Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no
                se puede deshacer.
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cancelar</Button>
              <Button
                onPress={handleDeleteAccount}
                textColor={MyTheme.colors.accent}
                loading={loading} // Mostrar indicador de carga en el botón de confirmación
                disabled={loading} // Deshabilitar el botón mientras se elimina
              >
                Sí, eliminar
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300,
  },
  infoContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: 16,
  },
  infowrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  name: {
    ...globalStyles.headlineLarge,
    color: MyTheme.colors.white,
    fontWeight: '800',
    textShadowColor: 'rgba(112, 109, 109, 0.6)', // Color de la sombra
    textShadowOffset: {width: 3, height: 2}, // Desplazamiento de la sombra
    textShadowRadius: 5, // Radio de desenfoque de la sombra
  },
  edit: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    left: 0,
    top: 230,
  },
});
