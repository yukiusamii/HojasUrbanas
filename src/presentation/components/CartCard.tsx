import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useCartStore} from '../store/cart-store';
import {MyTheme, globalStyles} from '../theme/global.styles';
import FastImage from 'react-native-fast-image';
import {Button, IconButton, Menu} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

import React, {useCallback, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';

interface Props {
  onPress: () => void;
  nombre_comun: string;
  precio: number;
  img_url: string;
  id: string;
  cantProd: number;
}

export const CartCard = ({
  onPress,
  nombre_comun,
  img_url,
  precio,
  id,
  cantProd,
}: Props) => {
  const modifyCant = useCartStore(state => state.modifyCant);
  const deleteProduct = useCartStore(state => state.deleteProduct);
  const [visible, setVisible] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
    closeMenu();
  };

  useFocusEffect(
    useCallback(() => {
      setQuantity(cantProd);

      // Si necesitas limpiar algo cuando la pantalla pierde foco, puedes devolver una función de limpieza
      return () => {
        // Función de limpieza si es necesaria
      };
    }, [cantProd]),
  );
  return (
    <Pressable
      onPress={() => onPress()}
      style={({pressed}) => [
        styles.listItem,
        pressed && styles.listItemPressed,
      ]}>
      <FastImage
        style={styles.image}
        source={{
          uri: img_url,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
      />

      <View style={styles.cardWrap}>
        <View
          style={{
            ...styles.cardWrapRow,
            marginTop: -4,
          }}>
          <Text
            style={{...globalStyles.titleMedium, color: MyTheme.colors.black}}>
            {nombre_comun}
          </Text>
          <IconButton
            icon="close"
            size={20}
            onPress={() => console.log('Borrar:', nombre_comun)}></IconButton>
        </View>

        <View style={styles.cardWrapRow}>
          <View style={styles.dropdownContainer}>
            <Menu
              visible={visible}
              onDismiss={closeMenu}
              contentStyle={styles.menuContent}
              anchor={
                <Pressable
                  style={styles.dropContent}
                  onPress={() => setVisible(true)}>
                  <Text>{quantity}</Text>
                  {/* <Image>../../assets/img/logo_hojas_urbanas_sin_fondo.png </Image>  */}
                  <Image
                    source={require('../../assets/img/arrow_drop_down.png')}></Image>
                </Pressable>
              }>
              <Menu.Item onPress={() => handleQuantityChange(1)} title="1" />
              <Menu.Item onPress={() => handleQuantityChange(2)} title="2" />
              <Menu.Item onPress={() => handleQuantityChange(3)} title="3" />
              <Menu.Item onPress={() => handleQuantityChange(4)} title="4" />
            </Menu>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,

    height: 90,

    borderRadius: 10,
    backgroundColor: MyTheme.colors.background,
    shadowColor: 'rgba(30, 30, 30, 0.6)',
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 10,

    marginLeft: 16,
    marginRight: 16,
    marginTop: 10,
    marginBottom: 10,
  },

  image: {
    width: '30%',
    height: 90,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 0,
  },

  listItemPressed: {
    elevation: 5,
  },

  cardWrap: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    flex: 1,
    // backgroundColor: 'blue',
  },
  cardWrapRow: {
    // backgroundColor: 'red',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },

  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown: {
    width: 100,
  },
  dropContent: {
    borderWidth: 1,
    borderColor: MyTheme.colors.accent,
    borderRadius: 10,
    padding: 4,
    paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 100,
    height: 36,
  },

  menuContent: {
    backgroundColor: '#fff', // Cambia el color del fondo del menú
    borderRadius: 10, // Opcional: Redondea los bordes del menú
  },
});
