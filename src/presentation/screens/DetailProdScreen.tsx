import {ActivityIndicator, Image, ScrollView, Text, View} from 'react-native';
import {useRoute, RouteProp, useFocusEffect} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import React from 'react';
import {Planta, Producto} from '../models/models';
import {globalStyles, MyTheme} from '../theme/global.styles';
import FastImage from 'react-native-fast-image';
import {StyleSheet} from 'react-native';
import {Button, IconButton, List} from 'react-native-paper';
import {RootStackParamList} from '../routes/BottomTabsNavegator';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import StarRating from 'react-native-star-rating-widget';
import Icon from 'react-native-vector-icons/Ionicons';
import {useCartStore} from '../store/cart-store';

export const DetailProdScreen = () => {
  const params = useRoute<RouteProp<RootStackParamList, 'Detail'>>().params;
  const [product, setProduct] = React.useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [cantidadProd, setCantidadProd] = useState(1);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const addProduct = useCartStore(state => state.addProduct);

  const [isExpanded, setIsExpanded] = React.useState({
    info: true,
    riego: false,
    luz: false,
    tierra: false,
    enfermedades: false,
  });

  const getProduct = async (id: string) => {
    try {
      const prodcutDataSnapshot = await firestore()
        .collection('productos')
        .doc('productos')
        .collection('productos')
        .doc(id)
        .get();

      const docData = prodcutDataSnapshot.data();
      if (docData) {
        const producto: Producto = {
          descripcion: docData.descripcion,
          id: docData.id,
          img_url: docData.img_url,
          nombre_comun: docData.nombre_comun,
          precio: docData.precio,
          stock: docData.stock, // Cantidad en stock
          rating: {
            nota: docData.rating?.nota,
            total: docData.rating?.total,
          },
          type: docData.type,
        };
        setProduct(producto);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      // Aseguramos que el loading se desactive incluso en caso de error
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);

      getProduct(params.id);
    }, [params.id]),
  );

  if (loading) {
    return (
      <View style={globalStyles.centerContainer}>
        <ActivityIndicator
          animating={true}
          color={MyTheme.colors.primary}
          size="large"
        />
        <Text>Cargando detalle...</Text>
      </View>
    );
  }

  return (
    // <View>
    //   <Text>DetailScreen</Text>
    //   <Text>{plant?.nombre_comun}</Text>
    // </View>
    <View style={{backgroundColor: MyTheme.colors.background, flex: 1}}>
      {!product ||
      !product.img_url ||
      product.img_url === '' ||
      product.img_url.startsWith('gs') ? (
        <Image
          style={styles.image}
          source={require('../../assets/img/default_plant_img_big.png')}
        />
      ) : (
        <FastImage
          style={styles.image}
          source={{
            uri: product.img_url,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
      <IconButton
        style={styles.back}
        icon="arrow-back"
        size={35}
        iconColor={MyTheme.colors.accent}
        onPress={() => {
          navigation.goBack();
        }} // Abrir el modal de confirmación
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={{gap: 16, marginTop: 16}}>
          <Text
            style={{
              ...globalStyles.headlineMedium,
              color: MyTheme.colors.black,
            }}>
            {product?.nombre_comun}
          </Text>

          <View style={globalStyles.rowCenterSpaceBetween}>
            <Text
              style={{
                ...globalStyles.headlineMedium,
                color: MyTheme.colors.black,
              }}>
              {product?.precio}€
            </Text>
            <View style={globalStyles.rowCenterEnd}>
              <StarRating
                rating={product?.rating?.nota || 0}
                onChange={() => {}}
                starSize={20} // Tamaño de las estrellas
                starStyle={{marginHorizontal: 2}} // Espacio entre estrellas
                maxStars={5}
              />
              <Text> ({product?.rating?.total || 0})</Text>
            </View>
          </View>

          <View style={globalStyles.rowCenterSpaceBetween}>
            <View
              style={{...globalStyles.rowCenterStart, gap: 8, marginLeft: -8}}>
              <IconButton
                style={styles.btnCant}
                icon="remove"
                size={24}
                iconColor={MyTheme.colors.accent}
                onPress={() => {
                  if (cantidadProd > 1) {
                    setCantidadProd(cantidadProd - 1);
                  }
                }}
              />
              <Text
                style={{
                  ...globalStyles.titleLarge,
                  color: MyTheme.colors.black,
                }}>
                {cantidadProd}
              </Text>

              <IconButton
                style={styles.btnCant}
                icon="add"
                size={24}
                iconColor={MyTheme.colors.accent}
                onPress={() => {
                  if (cantidadProd < 5) {
                    setCantidadProd(cantidadProd + 1);
                  }
                }}
              />
            </View>
            <Button
              mode="contained"
              icon="cart-outline"
              onPress={() => {
                console.log('Has Añadido al carrito: ', product?.nombre_comun);
                if (product) {
                  addProduct(
                    product.id,
                    cantidadProd,
                    product.nombre_comun,
                    product.img_url,
                    product.precio,
                    product.type,
                  );
                }
              }}>
              Añadir al carrito
            </Button>
          </View>

          <List.Section>
            {/* INFO */}
            <List.Accordion
              title="Información"
              titleStyle={globalStyles.titleLarge}
              expanded={isExpanded.info}
              onPress={() =>
                setIsExpanded(prev => ({...prev, info: !prev.info}))
              }
              right={props =>
                isExpanded.info ? (
                  <Image source={require('../../assets/img/up.png')} />
                ) : (
                  <Image source={require('../../assets/img/down.png')} />
                )
              }>
              <View style={styles.accordionContent}>
                <Text style={{...globalStyles.bodyMedium}}>
                  {product?.descripcion}
                </Text>
              </View>
            </List.Accordion>
          </List.Section>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300,
  },

  tagWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Esto permite que las etiquetas salten a una nueva línea
    justifyContent: 'flex-start',
  },
  tagContainer: {
    backgroundColor: MyTheme.colors.navBar,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    ...globalStyles.labelMedium,
    color: MyTheme.colors.black,
  },
  scrollViewContent: {
    padding: 16,
    flexGrow: 1,
  },
  back: {
    backgroundColor: 'rgba(212, 245, 212, 0.6)',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  btnCant: {
    backgroundColor: 'rgba(212, 245, 212, 0.6)',
  },

  accordionContent: {
    ...globalStyles.colStartStart,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16,
  },
});
