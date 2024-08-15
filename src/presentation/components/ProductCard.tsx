import {Pressable, StyleSheet, Text, View} from 'react-native';
import {MyTheme, globalStyles} from '../theme/global.styles';
import FastImage from 'react-native-fast-image';
import {Button} from 'react-native-paper';
import StarRating from 'react-native-star-rating-widget';
interface Props {
  onPress: () => void;
  nombre_comun: string;
  precio: number;
  rating: {
    nota: number;
    total: number;
  };
  img_url: string;
}

export const ProductCard = ({
  onPress,
  nombre_comun,
  img_url,
  precio,
  rating,
}: Props) => {
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
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.cardWrap}>
        <View style={styles.cardWrapRow}>
          <Text
            style={{...globalStyles.titleLarge, color: MyTheme.colors.black}}>
            {nombre_comun}
          </Text>
          <View style={globalStyles.rowCenterEnd}>
            <StarRating
              rating={rating.nota}
              onChange={() => {}}
              starSize={20} // Tamaño de las estrellas
              starStyle={{marginHorizontal: 2}} // Espacio entre estrellas
              maxStars={5}
            />
            <Text> ({rating.total})</Text>
          </View>
        </View>
        <View style={styles.cardWrapRow}>
          <Text
            style={{
              ...globalStyles.headlineMedium,
              color: MyTheme.colors.black,
            }}>
            {JSON.stringify(precio)}
            {'€'}
          </Text>
          <Button
            mode="outlined"
            icon="cart-outline"
            onPress={() => {
              console.log('Has Añadido al carrito: ', nombre_comun);
            }}>
            Añadir al carrito
          </Button>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,

    height: 380,

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
    marginTop: 15,
    marginBottom: 15,
  },

  image: {
    width: '100%',
    height: 257,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  listItemPressed: {
    elevation: 5,
  },

  loadingAlign: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  cardWrap: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
    flexDirection: 'column',
    padding: 16,
    height: '100%',
    width: '100%',
  },
  cardWrapRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },

  greenText: {
    color: '#18A957',
  },
  redText: {
    color: '#DF1642',
  },
});
