import {
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {globalStyles, MyTheme} from '../theme/global.styles';
import React from 'react';
import {useProfileStore} from '../store/profile-store';
import {type RootStackParamList} from '../routes/BottomTabsNavegator';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {
  Portal,
  Dialog,
  Paragraph,
  TextInput,
  Button,
  Badge,
  IconButton,
  RadioButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {useCartStore} from '../store/cart-store';
import FastImage from 'react-native-fast-image';
export const BuyScreen = () => {
  const {uid, name, email, direccion} = useProfileStore();

  const [fullName, setFullName] = React.useState(name || '');
  const [userEmail, setUserEmail] = React.useState(email || '');
  const [dir, setDir] = React.useState(direccion || '');
  const [visible, setVisible] = React.useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const productos = useCartStore(state => state.productos);
  const subtotal = useCartStore(state => state.subtotal);
  const [value, setValue] = React.useState('selected');
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

  const handleBackPress = () => {
    setVisible(true); // Mostrar el modal de confirmación
  };

  const hideDialog = () => setVisible(false);

  const confirmExit = () => {
    setVisible(false);
    ToastAndroid.show('Tramitación cancelada', ToastAndroid.SHORT);
    navigation.goBack();
  };
  return (
    <View style={{backgroundColor: MyTheme.colors.background, flex: 1}}>
      <IconButton
        style={styles.back}
        icon="arrow-back"
        size={35}
        iconColor={MyTheme.colors.accent}
        onPress={handleBackPress}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.containerInfo}>
          <View style={{...globalStyles.rowCenterStart, gap: 8}}>
            <Icon
              name="home-outline"
              color={MyTheme.colors.primary}
              size={24}
            />
            <Text
              style={{...globalStyles.labelLarge, color: MyTheme.colors.black}}>
              Envío a domicilio
            </Text>
          </View>
          <Text
            style={{
              ...globalStyles.labelLarge,
              color: MyTheme.colors.primary,
            }}>
            3,99€
          </Text>
        </View>
        <View style={styles.container}>
          <Text
            style={{...globalStyles.titleMedium, color: MyTheme.colors.black}}>
            Datos de envío
          </Text>
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
        </View>
        <View style={styles.container}>
          <Text
            style={{
              ...globalStyles.titleMedium,
              color: MyTheme.colors.black,
              marginBottom: 16,
            }}>
            Resumen del pedido
          </Text>
          <View style={styles.prodWrapper}>
            {productos.map((producto, index) => (
              <View key={index}>
                <FastImage
                  style={styles.image}
                  source={{
                    uri: producto.img_url,
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                />
                <Badge style={styles.badge} size={24}>
                  {producto.cantProd}
                </Badge>
              </View>
            ))}
          </View>
          <View style={{...globalStyles.rowCenterSpaceBetween, marginTop: 16}}>
            <Text
              style={{
                ...globalStyles.labelLarge,
                color: MyTheme.colors.black,
              }}>
              Subtotal
            </Text>
            <Text
              style={{
                ...globalStyles.labelLarge,
                color: MyTheme.colors.primary,
              }}>
              {subtotal}€
            </Text>
          </View>
        </View>
        <View style={styles.container}>
          <Text
            style={{
              ...globalStyles.titleMedium,
              color: MyTheme.colors.black,
              marginBottom: 16,
            }}>
            Método de pago
          </Text>

          <View style={{...globalStyles.rowCenterStart, gap: 8}}>
            <RadioButton
              value=""
              status="checked"
              onPress={() => setValue('selected')}
            />
            <Icon name="cash-outline" size={24} />
            <Text
              style={{...globalStyles.labelLarge, color: MyTheme.colors.black}}>
              Transferencia bancaria
            </Text>
          </View>
        </View>
        <View style={styles.containerInfo}>
          <View style={{...globalStyles.rowCenterStart, gap: 8}}>
            <Text
              style={{...globalStyles.titleLarge, color: MyTheme.colors.black}}>
              Total
            </Text>
          </View>
          <Text
            style={{
              ...globalStyles.titleLarge,
              color: MyTheme.colors.primary,
            }}>
            {subtotal + 3.99}€
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={() => {}}
          style={styles.button}
          // disabled={isUploading} // Deshabilitar el botón mientras sube la imagen
        >
          Tamitar pedido
        </Button>
      </ScrollView>

      {/* Dialogo de Confirmación */}
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog} style={styles.dialog}>
          <Dialog.Title>Confirmación</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              ¿Estás seguro de que quieres salir la tramitación del pedido?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancelar</Button>
            <Button onPress={confirmExit} textColor={MyTheme.colors.accent}>
              Sí, salir
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  containerInfo: {
    padding: 16,
    borderColor: MyTheme.colors.lightGrey,
    borderWidth: 1,
    borderRadius: 16,
    ...globalStyles.rowCenterSpaceBetween,
  },
  container: {
    padding: 16,
    borderColor: MyTheme.colors.lightGrey,
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: MyTheme.colors.background,
  },
  input: {
    marginBottom: 16,
    backgroundColor: MyTheme.colors.background,
  },
  button: {
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
    // backgroundColor: 'rgba(212, 245, 212, 0.6)',
    // position: 'absolute',
    // left: 0,
    // top: 0,
  },
  dialog: {backgroundColor: MyTheme.colors.background},
  scrollViewContent: {
    flexGrow: 1,
    gap: 16,
    padding: 16,
  },
  prodWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Esto permite que las etiquetas salten a una nueva línea
    justifyContent: 'flex-start',
    gap: 16,
  },
  badge: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    backgroundColor: MyTheme.colors.navBar,
    color: MyTheme.colors.black,
  },
});
