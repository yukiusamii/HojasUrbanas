import {Pressable, View, Text, Image, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {IconButton, Menu} from 'react-native-paper';
import {globalStyles, MyTheme} from '../theme/global.styles';
import React from 'react';
import {usePlantStore} from '../store/plant-store';

interface Props {
  onPress: () => void;
  nombre_comun: string;
  img_url: string;
  id: string;
  riego: string;
  fertilizacion: string;
}

export const PlantCard = ({
  onPress,
  nombre_comun,
  img_url,
  id,
  riego,
  fertilizacion,
}: Props) => {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const deletePlant = usePlantStore(state => state.deletePlant);

  return (
    <Pressable
      onPress={() => onPress()}
      style={({pressed}) => [
        styles.listItem,
        pressed && styles.listItemPressed,
      ]}>
      {!img_url || img_url === '' || img_url.startsWith('gs') ? (
        <Image
          style={styles.image}
          source={require('../../assets/img/default_plant_img.png')}
        />
      ) : (
        <FastImage
          style={styles.image}
          source={{
            uri: img_url,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
      <View style={styles.cardWrap}>
        <View style={styles.cardWrapRow}>
          <Text
            style={{
              ...globalStyles.titleLarge,
              color: MyTheme.colors.black,
              flex: 1,
              flexWrap: 'wrap',
            }}
            numberOfLines={1}
            ellipsizeMode="tail">
            {nombre_comun}
          </Text>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            contentStyle={styles.menuContent}
            anchor={
              <IconButton
                icon={() => (
                  <Image
                    source={require('../../assets/img/more.png')} // Ruta de tu archivo PNG
                    style={{width: 24, height: 24}} // Ajusta el tamaño según tus necesidades
                  />
                )}
                size={20}
                onPress={openMenu}
              />
            }>
            <Menu.Item
              onPress={() => {
                deletePlant(id);
              }}
              title="Eliminar"
            />
          </Menu>
        </View>

        <View style={styles.row}>
          <Image source={require('../../assets/img/watering-plants.png')} />
          <Text style={{color: MyTheme.colors.accent}}>Regar cada {riego}</Text>
        </View>

        <View style={styles.row}>
          <Image source={require('../../assets/img/fertilizer.png')} />
          <Text style={{color: MyTheme.colors.accent}}>
            Fertilizar cada {fertilizacion}
          </Text>
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

    height: 105,

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
    height: 105,
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

  menuContent: {
    backgroundColor: '#fff', // Cambia el color del fondo del menú
    borderRadius: 10, // Opcional: Redondea los bordes del menú
  },
  row: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
});
