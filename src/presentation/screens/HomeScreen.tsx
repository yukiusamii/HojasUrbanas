import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Pressable,
  ScrollView,
  Keyboard,
  ToastAndroid,
  Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {ProductCard} from '../components/ProductCard';
import {globalStyles, MyTheme} from '../theme/global.styles';
import {useProfileStore} from '../store/profile-store';
import {Planta, Producto} from '../models/models';
import {
  Button,
  Checkbox,
  FAB,
  IconButton,
  Menu,
  Modal,
  Portal,
  Searchbar,
} from 'react-native-paper';
import {useAllStore} from '../store/all-store';
import {RootStackParamList} from '../routes/BottomTabsNavegator';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {CameraAdapter} from '../adapters/camera-adapter';
import {useCartStore} from '../store/cart-store';
import {usePlantStore} from '../store/plant-store';
import {CustomCheckBox} from '../components/CustomCheckBox';

export const HomeScreen = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [searchQuery, setSearchQuery] = React.useState('');
  const setPlantas = useAllStore(state => state.setPlantas);
  const setProductos = useAllStore(state => state.setProductos);
  const allPlantas = useAllStore(state => state.plantas);
  const allProductos = useAllStore(state => state.productos);
  const [visibleOrden, setVisibleOrden] = React.useState(false);
  const [orden, setOrden] = React.useState('Plantas primero');
  const categories = [
    'Todo',
    'Fácil de cuidar',
    'Interior',
    'Riego escaso',
    'Exterior',
    'No tóxica',
    'Pleno sol',
    'Sol parcial',
    'Luz indirecta',
  ];
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const openMenuOrden = () => setVisibleOrden(true);
  const closeMenuOrden = () => setVisibleOrden(false);

  const handleOrdenhange = (value: string) => {
    setOrden(value);
    closeMenuOrden();
  };

  interface CheckboxesState {
    plantas: boolean;
    fertilizante: boolean;
    pesticida: boolean;
    fungicida: boolean;
    tierra: boolean;
    maceta: boolean;
  }
  const [visible, setVisible] = useState(false);
  const [checkboxes, setCheckboxes] = useState<CheckboxesState>({
    plantas: false,
    fertilizante: false,
    pesticida: false,
    fungicida: false,
    tierra: false,
    maceta: false,
  });

  const toggleCheckbox = (key: keyof CheckboxesState) => {
    setCheckboxes({...checkboxes, [key]: !checkboxes[key]});
  };

  const eliminarFiltro = () => {
    setCheckboxes({
      plantas: false,
      fertilizante: false,
      pesticida: false,
      fungicida: false,
      tierra: false,
      maceta: false,
    });

    setOrden('Plantas primero');

    const combinedData = [...allPlantas, ...allProductos];
    setData(combinedData);
  };

  const hideModal = () => setVisible(false);
  const showModal = () => setVisible(true);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    filtrarPorNombre(query); // Pasa el valor actualizado directamente a la función de filtrado
  };

  const filtrarPorNombre = (query: string) => {
    eliminarFiltro();
    setSelectedCategory('Todo');
    const combinedData = [...allPlantas, ...allProductos];
    if (query.length === 0) {
      setData(combinedData);
    } else {
      const filtered = combinedData.filter(product =>
        product.nombre_comun.toLowerCase().includes(query.toLowerCase()),
      );
      setData(filtered);
    }
  };

  const filtrarRapido = (category: string) => {
    eliminarFiltro();
    setSearchQuery('');

    const combinedData = [...allPlantas, ...allProductos];

    if (category === 'Todo') {
      setData(combinedData);
      return;
    }

    const filterByCategory = (key: string) => {
      return combinedData.filter(product =>
        product.etiquetas?.[key]
          ?.toLowerCase()
          .includes(category.toLowerCase()),
      );
    };

    switch (category) {
      case 'Fácil de cuidar':
        setData(filterByCategory('cuidado'));
        break;

      case 'Interior':
      case 'Exterior':
        setData(filterByCategory('localizacion'));
        break;

      case 'Riego escaso':
        setData(filterByCategory('riego'));
        break;

      case 'No tóxica':
        setData(filterByCategory('toxicidad'));
        break;

      case 'Pleno sol':
      case 'Sol parcial':
      case 'Luz indirecta':
        setData(filterByCategory('luz'));
        break;

      default:
        setData(combinedData); // Fallback, aunque en teoría nunca debería llegar aquí.
        break;
    }
  };

  const filtrosAvanzados = (query: CheckboxesState, orden: string) => {
    setSearchQuery('');
    setSelectedCategory('Todo');
    const combinedData = [...allPlantas, ...allProductos];

    // Si todos los checkboxes están seleccionados, mostramos todos los productos
    const allSelected = Object.values(query).every(value => value === false);
    let filteredData = combinedData;

    if (!allSelected) {
      // Filtramos solo los productos que coincidan con los tipos seleccionados
      filteredData = combinedData.filter(
        product =>
          (product.type === null && query.plantas) || // Filtrar plantas (type es null)
          (product.type === 'fertilizante' && query.fertilizante) ||
          (product.type === 'pesticida' && query.pesticida) ||
          (product.type === 'fungicida' && query.fungicida) ||
          (product.type === 'tierra' && query.tierra) ||
          (product.type === 'maceta' && query.maceta),
      );
    }

    // Aplicar ordenación basada en el criterio seleccionado
    console.log('******ORDEN: ', orden);
    switch (orden) {
      case 'Nombre':
        filteredData.sort((a, b) =>
          a.nombre_comun.localeCompare(b.nombre_comun),
        );
        break;
      case 'Plantas primero':
        filteredData.sort((a, b) => {
          if (a.type === null && b.type !== null) return -1;
          if (a.type !== null && b.type === null) return 1;
          return 0;
        });
        break;
      case 'Más barato primero':
        filteredData.sort((a, b) => a.precio - b.precio);
        break;
      case 'Valoraciones':
        filteredData.sort((a, b) => {
          // Asigna valores por defecto para rating.total y rating.nota si no existen
          const aTotal = a.rating?.total ?? 0;
          const bTotal = b.rating?.total ?? 0;
          const aNota = a.rating?.nota ?? 0;
          const bNota = b.rating?.nota ?? 0;

          // Primero ordena por la cantidad total de valoraciones
          if (bTotal !== aTotal) {
            return bTotal - aTotal;
          }
          // Si tienen el mismo número de valoraciones, ordena por la nota de la valoración
          return bNota - aNota;
        });
        break;
      default:
        break;
    }

    // Establecer los datos filtrados y ordenados en el estado
    setData(filteredData);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plantasCollection = await firestore()
          .collection('productos')
          .doc('plantas')
          .collection('plantas')
          .orderBy('nombre_comun')
          .get();

        const plantasData: Planta[] = plantasCollection.docs.map(doc => {
          const docData = doc.data();

          return {
            descripcion: docData.descripcion, // Descripción del bulbo florífero
            enfermedades: docData.enfermedades.map((enfermedad: any) => ({
              cuidados: enfermedad.cuidados,
              descripcion: enfermedad.descripcion,
              nombre: enfermedad.nombre,
            })), // Array de enfermedades con sus respectivos cuidados, descripción y nombre
            etiquetas: {
              cuidado: docData.etiquetas.cuidado,
              localizacion: docData.etiquetas.localizacion,
              luz: docData.etiquetas.luz,
              riego: docData.etiquetas.riego,
              toxicidad: docData.etiquetas.toxicidad,
            }, // Mapa de etiquetas
            fertilizacion: docData.fertilizacion,
            id: docData.id, // ID de la planta
            id_modelo: docData.id_modelo, // ID del modelo
            img_url: docData.img_url, // URL de la imagen
            luz: {
              adecuada: docData.luz.adecuada,
              preferida: docData.luz.preferida,
            }, // Mapa de características de la luz
            nom_comun: docData.nom_comun, // Nombre común de la planta
            nombre_cientifico: docData.nombre_cientifico, // Nombre científico de la planta
            nombre_comun: docData.nombre_comun, // Nombre común
            precio: docData.precio, // Precio de la planta
            riego: {
              caracteristicas: docData.riego.caracteristicas,
              invierno: docData.riego.invierno,
              verano: docData.riego.verano,
            }, // Mapa de características de riego
            stock: docData.stock, // Cantidad en stock
            temperatura: {
              ideal: docData.temperatura.ideal,
              zona_rustica: docData.temperatura.zona_rustica,
            }, // Mapa de temperatura
            tierra: docData.tierra, // Tipo de tierra
            rating: {
              nota: docData.rating?.nota,
              total: docData.rating?.total,
            },
          } as Planta;
        });

        const productosCollection = await firestore()
          .collection('productos')
          .doc('productos')
          .collection('productos')
          .orderBy('nombre_comun')
          .get();

        const productosData: Producto[] = productosCollection.docs.map(doc => {
          const docData = doc.data();
          return {
            descripcion: docData.descripcion,
            id: docData.id,
            img_url: docData.img_url,
            nombre_comun: docData.nombre_comun,
            precio: docData.precio,
            stock: docData.stock, // Cantidad en stock
            rating: {
              nota: docData.rating.nota,
              total: docData.rating.total,
            },
            type: docData.type,
          } as Producto;
        });

        const combinedData = [...plantasData, ...productosData];
        setData(combinedData);
        setPlantas(plantasData);
        setProductos(productosData);
      } catch (error) {
        // ToastAndroid.show(
        //   'Error al obtener los datos.',
        //   ToastAndroid.SHORT,
        // );
        Alert.alert('Error', 'Se ha producido un error al obtener los datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={globalStyles.centerContainer}>
        <ActivityIndicator
          animating={true}
          color={MyTheme.colors.primary}
          size="large"
        />

        <Text>Cargando los productos...</Text>
      </View>
    );
  }

  return (
    <View style={{backgroundColor: MyTheme.colors.background, flex: 1}}>
      <View style={{padding: 10}}>
        <View style={styles.searchContainer}>
          <IconButton
            style={{position: 'absolute', left: 0, top: 0, zIndex: 99}}
            icon="filter-outline"
            size={24}
            onPress={() => {
              showModal();
            }}
          />
          <Searchbar
            placeholder="Buscar"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchbar}
            icon={() => null} // Elimina el ícono a la izquierda
            right={() => (
              <IconButton
                icon="search"
                onPress={() => {
                  Keyboard.dismiss();
                }}
                size={24}
              />
            )}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSelectedCategory(category);
                filtrarRapido(category);
              }}
              style={styles.tab}>
              <Text
                style={[
                  styles.tabText,
                  selectedCategory === category && styles.selectedTabText,
                ]}>
                {category}
              </Text>
              {selectedCategory === category && (
                <View style={styles.underline} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {!data || data.length === 0 ? (
        <View style={{...globalStyles.centerContainer, gap: 16}}>
          <Text
            style={{
              ...globalStyles.titleLarge,
              color: MyTheme.colors.accent,
              textAlign: 'center',
            }}>
            No hay resultados con la siguiente búsqueda
          </Text>
        </View>
      ) : (
        <FlatList
          style={styles.flatList}
          data={data}
          renderItem={({item}) => (
            <ProductCard
              onPress={() => {
                console.log('Has pulsado: ', item.nombre_comun);
                if (item.id) {
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
                }
              }}
              id={item.id}
              nombre_comun={item.nombre_comun}
              img_url={item.img_url}
              precio={item.precio}
              rating={item.rating}
              type={item.type}
            />
          )}
        />
      )}
      <FAB
        icon="camera-outline"
        color={MyTheme.colors.primary}
        style={styles.fab}
        size="medium"
        onPress={async () => {
          try {
            const uriPhoto = await CameraAdapter.takePicture();
            if (uriPhoto && uriPhoto.length > 0) {
              navigation.navigate('Response', {uri: uriPhoto[0]});
            } else {
              ToastAndroid.show(
                'No se ha tomado ninguna foto.',
                ToastAndroid.SHORT,
              );
            }
          } catch (error) {
            Alert.alert('Error', 'Se ha producido un error al tomar la foto.');
          }
        }}
      />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainerStyle}>
          <View
            style={{...globalStyles.rowCenterSpaceBetween, marginBottom: 16}}>
            <Text style={{...globalStyles.headlineSmall, marginBottom: 10}}>
              Filtros
            </Text>
            <IconButton
              icon="close"
              size={24}
              onPress={hideModal}
              style={{alignSelf: 'flex-end'}}
            />
          </View>
          <CustomCheckBox
            label="Plantas"
            checked={checkboxes.plantas}
            onPress={() => toggleCheckbox('plantas')}
          />
          <CustomCheckBox
            label="Tierras"
            checked={checkboxes.tierra}
            onPress={() => toggleCheckbox('tierra')}
          />

          <CustomCheckBox
            label="Fertilizantes"
            checked={checkboxes.fertilizante}
            onPress={() => toggleCheckbox('fertilizante')}
          />
          <CustomCheckBox
            label="Pesticidas"
            checked={checkboxes.pesticida}
            onPress={() => toggleCheckbox('pesticida')}
          />

          <CustomCheckBox
            label="Fungicidas"
            checked={checkboxes.fungicida}
            onPress={() => toggleCheckbox('fungicida')}
          />

          {/* <CustomCheckBox
            label="Macetas"
            checked={checkboxes.maceta}
            onPress={() => toggleCheckbox('maceta')}
          /> */}

          <View style={{...globalStyles.rowCenterSpaceBetween, marginTop: 16}}>
            <Text style={globalStyles.titleMedium}>Ordenar por</Text>
            <View style={styles.dropdownContainer}>
              <Menu
                visible={visibleOrden}
                onDismiss={closeMenuOrden}
                contentStyle={styles.menuContent}
                anchor={
                  <Pressable
                    style={styles.dropContent}
                    onPress={() => setVisibleOrden(true)}>
                    <Text>{orden}</Text>
                    {/* <Image>../../assets/img/logo_hojas_urbanas_sin_fondo.png </Image>  */}
                    <Image
                      source={require('../../assets/img/arrow_drop_down.png')}></Image>
                  </Pressable>
                }>
                <Menu.Item
                  onPress={() => {
                    handleOrdenhange('Nombre');
                  }}
                  title="Nombre"
                />
                <Menu.Item
                  onPress={() => {
                    handleOrdenhange('Plantas primero');
                  }}
                  title="Plantas primero"
                />
                <Menu.Item
                  onPress={() => {
                    handleOrdenhange('Más barato primero');
                  }}
                  title="Más barato primero"
                />
                <Menu.Item
                  onPress={() => {
                    handleOrdenhange('Valoraciones');
                  }}
                  title="Valoraciones"
                />
              </Menu>
            </View>
          </View>
          <View
            style={{...globalStyles.rowCenterCenter, marginTop: 24, gap: 16}}>
            <Button
              mode="outlined"
              onPress={() => {
                hideModal();
                eliminarFiltro();
              }}
              style={{width: 150}}>
              Limpiar
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                hideModal();
                filtrosAvanzados(checkboxes, orden);
              }}
              style={{width: 150}}>
              Aplicar
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
  // ***********************************************************
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  // const changeProfile = useProfileStore(state => state.changeProfile);
  // return (
  //   <View style={globalStyles.topLeftContainer}>
  //     <Text>HomeScreen</Text>
  //     <Button
  //       mode="contained"
  //       style={{marginBottom: 16, marginTop: 24}}
  //       onPress={async () => {
  //         navigation.navigate('Prueba');
  //       }}>
  //       Go to Prueba
  //     </Button>

  //     <Button
  //       mode="contained"
  //       style={{marginBottom: 16, marginTop: 24}}
  //       onPress={() => {
  //         changeProfile('Yousra', 'Yousra@emial.com');
  //       }}>
  //       Cambiar datos
  //     </Button>
  //   </View>
  // );
};

const styles = StyleSheet.create({
  image: {
    width: 200, // ajusta el tamaño de la imagen según tus necesidades
    height: 200,
    resizeMode: 'contain', // puedes usar 'cover', 'stretch', etc. según tus necesidades
    marginBottom: 8,
  },
  flatList: {
    backgroundColor: MyTheme.colors.background,
    paddingTop: 10,
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: MyTheme.colors.navBar,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    paddingHorizontal: 10,
    elevation: 2, // Para sombra en Android
  },
  searchbar: {
    flex: 1,
    elevation: 0, // Elimina la sombra del Searchbar
    backgroundColor: 'transparent', // Hace que el fondo sea transparente
    paddingLeft: 0,
    marginLeft: -8,
  },
  modalContainerStyle: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkboxItem: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdown: {
    width: 250,
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
    width: 200,
    height: 36,
  },

  menuContent: {
    backgroundColor: '#fff', // Cambia el color del fondo del menú
    borderRadius: 10, // Opcional: Redondea los bordes del menú
  },

  scrollViewContainer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 10,
  },
  tab: {
    marginRight: 20,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: 'gray',
  },
  selectedTabText: {
    color: MyTheme.colors.primary, // Utiliza el color principal de tu tema
    fontWeight: 'bold',
  },
  underline: {
    marginTop: 4,
    height: 2,
    width: '100%',
    backgroundColor: MyTheme.colors.primary, // Utiliza el color principal de tu tema
  },
});
