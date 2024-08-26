import {FlatList, Image, StyleSheet, View} from 'react-native';
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
import {useProfileStore} from '../store/profile-store';
import Icon from 'react-native-vector-icons/Ionicons';

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
      {productos.length === 0 ? (
        // <Text style={{textAlign: 'center', marginTop: 20}}>No hay plantas</Text>
        <View style={{...globalStyles.centerContainer, gap: 16}}>
          <Icon name="cart-outline" color={MyTheme.colors.primary} size={50} />
          <Text
            style={{...globalStyles.titleLarge, color: MyTheme.colors.accent}}>
            El carrito está vacío.
          </Text>
        </View>
      ) : (
        <View style={{flex: 1}}>
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
                navigation.navigate('Buy');
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
                    if (!item.type) {
                      navigation.navigate('Detail', {
                        id: item.id,
                        type: item.type,
                      });
                    } else {
                      navigation.navigate('DetailProd', {
                        id: item.id,
                        type: item.type,
                      });
                    }
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
        </View>
      )}
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
