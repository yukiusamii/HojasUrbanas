import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  View,
  ToastAndroid,
} from 'react-native';
import {useRoute, RouteProp, useFocusEffect} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import React from 'react';
import {Planta} from '../models/models';
import {globalStyles, MyTheme} from '../theme/global.styles';
import FastImage from 'react-native-fast-image';
import {StyleSheet} from 'react-native';
import {Button, IconButton, List} from 'react-native-paper';
import {RootStackParamList} from '../routes/BottomTabsNavegator';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import StarRating from 'react-native-star-rating-widget';
import Icon from 'react-native-vector-icons/Ionicons';
import {useCartStore} from '../store/cart-store';

export const DetailScreen = () => {
  const params = useRoute<RouteProp<RootStackParamList, 'Detail'>>().params;
  const [plant, setPlant] = React.useState<Planta | null>(null);
  const [loading, setLoading] = useState(true);
  const [cantidadProd, setCantidadProd] = useState(1);
  const addProduct = useCartStore(state => state.addProduct);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [isExpanded, setIsExpanded] = React.useState({
    info: true,
    riego: false,
    luz: false,
    tierra: false,
    enfermedades: false,
  });

  const getPlant = async (id: string) => {
    try {
      const plantDataSnapshot = await firestore()
        .collection('productos')
        .doc('plantas')
        .collection('plantas')
        .doc(id)
        .get();

      const plantdata = plantDataSnapshot.data();
      if (plantdata) {
        const planta: Planta = {
          descripcion: plantdata.descripcion,
          enfermedades: plantdata.enfermedades.map((enfermedad: any) => ({
            cuidados: enfermedad.cuidados,
            descripcion: enfermedad.descripcion,
            nombre: enfermedad.nombre,
          })),
          etiquetas: {
            cuidado: plantdata.etiquetas.cuidado,
            localizacion: plantdata.etiquetas.localizacion,
            luz: plantdata.etiquetas.luz,
            riego: plantdata.etiquetas.riego,
            toxicidad: plantdata.etiquetas.toxicidad,
          },
          fertilizacion: plantdata.fertilizacion,
          id: plantdata.id,
          id_modelo: plantdata.id_modelo,
          img_url: plantdata.img_url,
          luz: {
            adecuada: plantdata.luz.adecuada,
            preferida: plantdata.luz.preferida,
          },
          nom_comun: plantdata.nom_comun,
          nombre_cientifico: plantdata.nombre_cientifico,
          nombre_comun: plantdata.nombre_comun,
          precio: plantdata.precio,
          riego: {
            caracteristicas: plantdata.riego.caracteristicas,
            invierno: plantdata.riego.invierno,
            verano: plantdata.riego.verano,
          },
          stock: plantdata.stock,
          temperatura: {
            ideal: plantdata.temperatura.ideal,
            zona_rustica: plantdata.temperatura.zona_rustica,
          },
          tierra: plantdata.tierra,
          rating: {
            nota: plantdata.rating?.nota,
            total: plantdata.rating?.total,
          },
        };
        setPlant(planta);
        setLoading(false);
      } else {
        Alert.alert('Error', 'La planta no se encuentra en la base de datos.');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'No se ha podido obtener la planta de la base de datos.',
      );
    } finally {
      setLoading(false); // Aseguramos que el loading se desactive incluso en caso de error.
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Reestablecer el estado de carga al tener el foco

      if (params.type) {
      } else {
        getPlant(params.id);
      }
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
    <View style={{backgroundColor: MyTheme.colors.background, flex: 1}}>
      {!plant ||
      !plant.img_url ||
      plant.img_url === '' ||
      plant.img_url.startsWith('gs') ? (
        <Image
          style={styles.image}
          source={require('../../assets/img/default_plant_img_big.png')}
        />
      ) : (
        <FastImage
          style={styles.image}
          source={{
            uri: plant.img_url,
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
        }} // Asegúrate de que la navegación de regreso funcione correctamente.
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {!params.type ? (
          <View style={styles.tagWrapper}>
            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{plant?.etiquetas.cuidado}</Text>
            </View>

            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>
                {plant?.etiquetas.localizacion}
              </Text>
            </View>

            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{plant?.etiquetas.luz}</Text>
            </View>

            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{plant?.etiquetas.riego}</Text>
            </View>

            <View style={styles.tagContainer}>
              <Text style={styles.tagText}>{plant?.etiquetas.toxicidad}</Text>
            </View>
          </View>
        ) : (
          <View></View>
        )}

        <View style={{gap: 16, marginTop: 16}}>
          <Text
            style={{
              ...globalStyles.headlineMedium,
              color: MyTheme.colors.black,
            }}>
            {plant?.nombre_comun}
          </Text>

          <View style={globalStyles.rowCenterSpaceBetween}>
            <Text
              style={{
                ...globalStyles.headlineMedium,
                color: MyTheme.colors.black,
              }}>
              {plant?.precio}€
            </Text>
            <View style={globalStyles.rowCenterEnd}>
              <StarRating
                rating={plant?.rating?.nota || 0}
                onChange={() => {}}
                starSize={20} // Tamaño de las estrellas
                starStyle={{marginHorizontal: 2}} // Espacio entre estrellas
                maxStars={5}
              />
              <Text> ({plant?.rating?.total || 0})</Text>
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
                  } else {
                    ToastAndroid.show('Mínimo una unidad.', ToastAndroid.SHORT);
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
                  setCantidadProd(cantidadProd + 1);
                }}
              />
            </View>
            <Button
              mode="contained"
              icon="cart-outline"
              onPress={() => {
                console.log('Has Añadido al carrito: ', plant?.nombre_comun);
                if (plant) {
                  addProduct(
                    plant.id,
                    cantidadProd,
                    plant.nombre_comun,
                    plant.img_url,
                    plant.precio,
                    plant.type,
                  );
                } else {
                  Alert.alert(
                    'Error',
                    'No se ha podido añadir la planta al carrito.',
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
                  {plant?.descripcion}
                </Text>
              </View>
            </List.Accordion>

            {!params.type ? (
              <>
                {/* RIEGO */}
                <List.Accordion
                  title="Riego"
                  titleStyle={globalStyles.titleLarge}
                  expanded={isExpanded.riego}
                  onPress={() =>
                    setIsExpanded(prev => ({...prev, riego: !prev.riego}))
                  }
                  right={props =>
                    isExpanded.riego ? (
                      <Image source={require('../../assets/img/up.png')} />
                    ) : (
                      <Image source={require('../../assets/img/down.png')} />
                    )
                  }>
                  <View style={styles.accordionContent}>
                    <View
                      style={{
                        ...globalStyles.rowCenterStart,
                        gap: 16,
                      }}>
                      <Icon
                        name="snow-outline"
                        color={MyTheme.colors.accent}
                        size={24}
                      />
                      <Text style={globalStyles.bodyMedium}>
                        En invierno regar cada {plant?.riego.invierno}
                      </Text>
                    </View>
                    <View
                      style={{
                        ...globalStyles.rowCenterStart,
                        gap: 16,
                      }}>
                      <Icon
                        name="sunny-outline"
                        color={MyTheme.colors.accent}
                        size={24}
                      />
                      <Text style={globalStyles.bodyMedium}>
                        En verano regar cada {plant?.riego.verano}
                      </Text>
                    </View>
                  </View>
                </List.Accordion>

                {/* LUZ */}
                <List.Accordion
                  title="Luz"
                  titleStyle={globalStyles.titleLarge}
                  expanded={isExpanded.luz}
                  onPress={() =>
                    setIsExpanded(prev => ({...prev, luz: !prev.luz}))
                  }
                  right={props =>
                    isExpanded.luz ? (
                      <Image source={require('../../assets/img/up.png')} />
                    ) : (
                      <Image source={require('../../assets/img/down.png')} />
                    )
                  }>
                  <View style={styles.accordionContent}>
                    <View style={{...globalStyles.rowCenterStart, gap: 16}}>
                      <Icon
                        name="happy-outline"
                        color={MyTheme.colors.accent}
                        size={24}
                      />
                      <Text style={{...globalStyles.bodyMedium}}>
                        Luz preferida: {plant?.luz.preferida}
                      </Text>
                    </View>
                    <View style={{...globalStyles.rowCenterStart, gap: 16}}>
                      <Image source={require('../../assets/img/neutral.png')} />
                      <Text style={{...globalStyles.bodyMedium}}>
                        Luz adecuada: {plant?.luz.adecuada}
                      </Text>
                    </View>
                  </View>
                </List.Accordion>

                {/* TIERRA */}
                <List.Accordion
                  title="Tierra"
                  titleStyle={globalStyles.titleLarge}
                  expanded={isExpanded.tierra}
                  onPress={() =>
                    setIsExpanded(prev => ({...prev, tierra: !prev.tierra}))
                  }
                  right={props =>
                    isExpanded.tierra ? (
                      <Image source={require('../../assets/img/up.png')} />
                    ) : (
                      <Image source={require('../../assets/img/down.png')} />
                    )
                  }>
                  <View style={styles.accordionContent}>
                    <Text style={{...globalStyles.bodyMedium}}>
                      {plant?.tierra}
                    </Text>
                  </View>
                </List.Accordion>

                {/* ENFERMEDADES */}
                <List.Accordion
                  title="Enfermedades"
                  titleStyle={globalStyles.titleLarge}
                  expanded={isExpanded.enfermedades}
                  onPress={() =>
                    setIsExpanded(prev => ({
                      ...prev,
                      enfermedades: !prev.enfermedades,
                    }))
                  }
                  right={props =>
                    isExpanded.enfermedades ? (
                      <Image source={require('../../assets/img/up.png')} />
                    ) : (
                      <Image source={require('../../assets/img/down.png')} />
                    )
                  }>
                  <View style={styles.accordionContent}>
                    {plant?.enfermedades.map((enfermedad, index) => (
                      <View
                        key={index}
                        style={{...globalStyles.colStartStart, gap: 8}}>
                        <View style={{...globalStyles.colStartStart, gap: 4}}>
                          <Text
                            style={{
                              ...globalStyles.titleMedium,
                              color: MyTheme.colors.black,
                            }}>
                            {enfermedad.nombre}
                          </Text>
                          <Text style={globalStyles.bodyMedium}>
                            {enfermedad.descripcion}
                          </Text>
                        </View>
                        <View style={{...globalStyles.colStartStart, gap: 4}}>
                          <Text style={{...globalStyles.titleSmall}}>
                            Cuidados
                          </Text>
                          <Text style={globalStyles.bodyMedium}>
                            {enfermedad.cuidados}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </List.Accordion>
              </>
            ) : (
              <View></View>
            )}
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
