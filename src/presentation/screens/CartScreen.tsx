import {FlatList, StyleSheet, View} from 'react-native';
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
import {useCartStore} from '../store/cart-store';
import FastImage from 'react-native-fast-image';
import {CartCard} from '../components/CartCard';
import {useCallback} from 'react';
import React from 'react';

export const CartScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const productos = useCartStore(state => state.productos);
  const subtotal = useCartStore(state => state.subtotal);

  useFocusEffect(
    useCallback(() => {
      // setsubtotal(getSubtotal());

      // Si necesitas limpiar algo cuando la pantalla pierde foco, puedes devolver una función de limpieza
      return () => {
        // Función de limpieza si es necesaria
      };
    }, []),
  );
  return (
    <View style={{backgroundColor: MyTheme.colors.background, flex: 1}}>
      <View
        style={{
          ...globalStyles.rowCenterSpaceBetween,
          width: '100%',
          padding: 16,
        }}>
        <Text style={globalStyles.titleMedium}>
          Subtotal: {subtotal.toFixed(2)}€
        </Text>
        <Button
          mode="outlined"
          onPress={() => {
            console.log('Tramitar pedido');
          }}>
          Tramitar pedido
        </Button>
      </View>
      <FlatList
        data={productos}
        renderItem={({item}) => (
          <View>
            {/* <Text>{item.nombre_comun}</Text>
            <FastImage
              style={styles.image}
              source={{
                uri: item.img_url,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            /> */}
            <CartCard
              onPress={() => {
                console.log('Has pulsado: ', item.nombre_comun);
              }}
              id={item.id}
              nombre_comun={item.nombre_comun}
              img_url={item.img_url}
              precio={item.precio}
              cantProd={item.cantProd}
            />
          </View>
        )}
      />
      {/* <Text>CartScreen</Text>
      <Button
        mode="contained"
        style={{marginBottom: 16, marginTop: 24}}
        onPress={async () => {
          navigation.navigate('Auth');
        }}>
        Go to AuthScreen
      </Button> */}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '25%',
    height: 60,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 0,
  },
});
