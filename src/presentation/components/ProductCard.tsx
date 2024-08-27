import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {MyTheme, globalStyles} from '../theme/global.styles';
import FastImage from 'react-native-fast-image';
import {Button} from 'react-native-paper';
import StarRating from 'react-native-star-rating-widget';
import {useCartStore} from '../store/cart-store';
interface Props {
  onPress: () => void;
  nombre_comun: string;
  precio: number;
  rating: {
    nota: number;
    total: number;
  };
  img_url: string;
  id: string;
  type: string;
}

export const ProductCard = ({
  onPress,
  nombre_comun,
  img_url,
  precio,
  rating,
  id,
  type,
}: Props) => {
  const addProduct = useCartStore(state => state.addProduct);
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
          source={require('../../assets/img/default_plant_img_big.png')}
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
      {/* <FastImage
        style={styles.image}
        source={{
          uri: img_url,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      /> */}
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
          <View style={globalStyles.rowCenterEnd}>
            <StarRating
              rating={rating?.nota || 0}
              onChange={() => {}}
              starSize={20} // Tamaño de las estrellas
              starStyle={{marginHorizontal: 2}} // Espacio entre estrellas
              maxStars={5}
            />
            <Text> ({rating?.total || 0})</Text>
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
              addProduct(id, 1, nombre_comun, img_url, precio, type);
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
});
