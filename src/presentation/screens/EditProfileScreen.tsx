import * as React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  ToastAndroid,
  BackHandler,
} from 'react-native';
import {
  TextInput,
  Button,
  FAB,
  IconButton,
  Dialog,
  Portal,
  Paragraph,
} from 'react-native-paper';
import {useProfileStore} from '../store/profile-store';
import {MyTheme, globalStyles} from '../theme/global.styles';
import FastImage from 'react-native-fast-image';
import {CameraAdapter} from '../adapters/camera-adapter';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {type RootStackParamList} from '../routes/BottomTabsNavegator';

export const EditProfileScreen = () => {
  const {
    uid,
    name,
    userName,
    email,
    photoURL,
    bibliografia,
    direccion,
    changeProfile,
  } = useProfileStore();

  const [username, setUsername] = React.useState(userName || '');
  const [fullName, setFullName] = React.useState(name || '');
  const [userEmail, setUserEmail] = React.useState(email || '');
  const [bio, setBio] = React.useState(bibliografia || '');
  const [dir, setDir] = React.useState(direccion || '');
  const [urlImg, setUrlImg] = React.useState(photoURL || '');

  const [visible, setVisible] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  React.useEffect(() => {
    const backAction = () => {
      setVisible(true);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  // Función para subir la imagen a Firebase Storage
  const uploadImageToStorage = async (imageUri: string) => {
    if (!uid) return null;

    const imageRef = storage().ref(`profilePictures/${uid}.jpg`);
    const task = imageRef.putFile(imageUri);

    setIsUploading(true);

    try {
      await task;
      const downloadURL = await imageRef.getDownloadURL();
      setIsUploading(false);
      return downloadURL;
    } catch (error) {
      setIsUploading(false);
      ToastAndroid.show('Error al subir la imagen', ToastAndroid.SHORT);
      console.error('Error al subir la imagen:', error);
      return null;
    }
  };

  // Función para guardar los cambios del perfil
  const handleSave = async () => {
    // Validar que todos los campos estén llenos
    if (!username || !fullName || !userEmail || !bio || !dir) {
      ToastAndroid.show(
        'Por favor completa todos los campos antes de guardar.',
        ToastAndroid.SHORT,
      );
      return;
    }

    let finalPhotoURL = urlImg || null;

    if (urlImg && typeof urlImg === 'string' && urlImg !== photoURL) {
      finalPhotoURL = await uploadImageToStorage(urlImg);
    }

    if (!finalPhotoURL) {
      ToastAndroid.show(
        'Error al subir la imagen. Intenta nuevamente.',
        ToastAndroid.SHORT,
      );
      return;
    }

    // Guardar los datos actualizados en Firestore
    firestore()
      .collection('usuarios')
      .doc(uid)
      .update({
        name: fullName,
        userName: username,
        email: userEmail,
        photoURL: finalPhotoURL,
        biografia: bio,
        direccion: dir,
        firtTime: false,
      })
      .then(() => {
        // Actualizar el estado global después de guardar
        changeProfile(
          uid,
          fullName,
          username,
          userEmail,
          finalPhotoURL,
          bio,
          dir,
        );
        ToastAndroid.show(
          'Perfil actualizado exitosamente',
          ToastAndroid.SHORT,
        );
        navigation.navigate('InfoProfile');
      })
      .catch(error => {
        console.error('Error al guardar los datos:', error);
        ToastAndroid.show('Error al guardar los datos', ToastAndroid.SHORT);
      });
  };

  const handleBackPress = () => {
    setVisible(true); // Mostrar el modal de confirmación
  };

  const hideDialog = () => setVisible(false);

  const confirmExit = () => {
    setVisible(false);
    navigation.goBack(); // Navega hacia atrás sin guardar
  };

  const cambiarFoto = async () => {
    const uriPhoto = await CameraAdapter.takePicture();
    if (uriPhoto && uriPhoto.length > 0) {
      setUrlImg(uriPhoto[0]); // Establece la nueva imagen
    }
  };

  return (
    <View style={{backgroundColor: MyTheme.colors.background, flex: 1}}>
      {urlImg ? (
        <FastImage
          style={styles.image}
          source={{
            uri: urlImg,
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
      <FAB
        icon="camera-outline"
        color={MyTheme.colors.primary}
        style={styles.fab}
        size="medium"
        onPress={cambiarFoto}
        disabled={isUploading} // Deshabilitar el botón mientras sube la imagen
      />
      <IconButton
        style={styles.back}
        icon="arrow-back"
        size={35}
        iconColor={'#fff'}
        onPress={handleBackPress} // Abrir el modal de confirmación
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          <TextInput
            label="Nombre de Usuario"
            value={username}
            onChangeText={text => setUsername(text)}
            style={styles.input}
          />
          <TextInput
            label="Nombre Completo"
            value={fullName}
            onChangeText={text => setFullName(text)}
            style={styles.input}
          />
          <TextInput
            label="Correo Electrónico"
            value={userEmail}
            onChangeText={text => setUserEmail(text)}
            style={styles.input}
            keyboardType="email-address"
          />
          <TextInput
            label="Dirección Completa"
            value={dir}
            onChangeText={text => setDir(text)}
            style={styles.input}
            multiline
          />
          <TextInput
            label="Biografía"
            value={bio}
            onChangeText={text => setBio(text)}
            style={styles.input}
            multiline
          />
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
            disabled={isUploading} // Deshabilitar el botón mientras sube la imagen
          >
            Guardar Cambios
          </Button>
        </View>
      </ScrollView>

      {/* Dialogo de Confirmación */}
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
          <Dialog.Title>Confirmación</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              ¿Estás seguro de que quieres volver atrás sin guardar los cambios?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancelar</Button>
            <Button onPress={confirmExit} textColor={MyTheme.colors.accent}>
              Sí, volver
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300,
  },
  container: {
    padding: 16,
    backgroundColor: MyTheme.colors.background,
  },
  input: {
    marginBottom: 16,
    backgroundColor: MyTheme.colors.background,
  },
  button: {
    marginTop: 24,
    backgroundColor: MyTheme.colors.primary,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    top: 210,
    backgroundColor: MyTheme.colors.navBar,
  },
  back: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  dialog: {backgroundColor: MyTheme.colors.background},
  scrollViewContent: {
    flexGrow: 1,
  },
});
