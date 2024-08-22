import {Pressable, View, Text, Image, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Button, IconButton, Menu} from 'react-native-paper';
import {globalStyles, MyTheme} from '../theme/global.styles';
import React from 'react';
import {usePlantStore} from '../store/plant-store';
import {RootStackParamList} from '../routes/BottomTabsNavegator';
import {NavigationProp, useNavigation} from '@react-navigation/native';
interface Props {
  onPress: () => void;
  nombre_comun: string;
  img_url: string;
  id: string;
  riego: string;
  fertilizacion: string;
  navigation: any;
}

export const AddPlantCard = ({
  onPress,
  nombre_comun,
  img_url,
  id,
  riego,
  fertilizacion,
  navigation,
}: Props) => {
  const addPlant = usePlantStore(state => state.addPlant);

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
            }}>
            {nombre_comun}
          </Text>
        </View>

        <Button
          icon="add"
          mode="outlined"
          onPress={() => {
            console.log('Añadir planta: ', nombre_comun);
            //         nombre_comun: string,
            // img_url: string,
            // id: string,
            // riego: string,
            // fertilizacion: string,
            console.log(
              '------------------ ADD PLANT CARD --------------------',
            );
            console.log(nombre_comun, img_url, id, riego, fertilizacion);
            addPlant(nombre_comun, img_url, id, riego, fertilizacion);
            navigation.goBack();
          }}>
          Añadir planta
        </Button>
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
    // elevation: 5,
  },

  cardWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
    gap: 8,
    // backgroundColor: 'blue',
    marginRight: 16,
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
});
