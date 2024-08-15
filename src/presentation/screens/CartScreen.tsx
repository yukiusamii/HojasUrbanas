import {FlatList, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {type RootStackParamList} from '../routes/BottomTabsNavegator';
import {MyTheme, globalStyles} from '../theme/global.styles';
import {useCartStore} from '../store/cart-store';
import FastImage from 'react-native-fast-image';
import {CartCard} from '../components/CartCard';

export const CartScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const prodcutos = useCartStore(state => state.productos);

  return (
    <View style={{backgroundColor: MyTheme.colors.background, flex: 1}}>
      <FlatList
        data={prodcutos}
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
