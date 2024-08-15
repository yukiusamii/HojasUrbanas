import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {ProductCard} from '../components/ProductCard';
import {globalStyles, MyTheme} from '../theme/global.styles';
import {useProfileStore} from '../store/profile-store';
import {Planta} from '../models/models';
import {FAB, IconButton, Searchbar} from 'react-native-paper';

export const HomeScreen = () => {
  const [data, setData] = useState<Planta[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<{[key: string]: string}>({});

  const getImageUrl = async (imgUrl: string) => {
    if (
      !imgUrl ||
      (!imgUrl.startsWith('gs://') && !imgUrl.startsWith('https://'))
    ) {
      return null;
    }
    try {
      const url = await storage().refFromURL(imgUrl).getDownloadURL();
      return url;
    } catch (error) {
      console.error('Error al obtener la URL de la imagen:', error);
      return null;
    }
  };
  const [searchQuery, setSearchQuery] = React.useState('');

  const onChangeSearch = (query: string) => setSearchQuery(query);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const plantasCollection = await firestore()
          .collection('productos')
          .doc('plantas')
          .collection('plantas')
          .get();

        const plantasData: Planta[] = plantasCollection.docs.map(doc => {
          const docData = doc.data();
          return {
            nombre_comun: docData.nombre_comun,
            descripcion: docData.descripcion,
            img_url: docData.img_url,
            precio: docData.precio,
            // Agrega otros campos que tengas en tu documento de planta
          } as Planta;
        });

        setData(plantasData);

        const urls: {[key: string]: string} = {};
        for (const planta of plantasData) {
          console.log(
            '-----------------*Precio Planta: ',
            planta.nombre_comun,
            planta.precio,
          );

          const url = await getImageUrl(planta.img_url);
          if (url) {
            urls[planta.img_url] = url;
          }
        }

        setImageUrls(urls);
      } catch (error) {
        console.error('Error getting documents: ', error);
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
            onPress={() => console.log('Filter pressed')}
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
                onPress={() => console.log('Search pressed')}
                size={24}
              />
            )}
          />
        </View>
      </View>
      <FlatList
        style={styles.flatList}
        data={data}
        renderItem={({item}) => (
          <ProductCard
            onPress={() => {
              console.log('Has pulsado: ', item.nombre_comun);
            }}
            nombre_comun={item.nombre_comun}
            img_url={imageUrls[item.img_url]}
            precio={item.precio}
            rating={{nota: 4.2, total: 3}}
          />
        )}
      />
      <FAB
        icon="camera-outline"
        color={MyTheme.colors.primary}
        style={styles.fab}
        size="medium"
        onPress={() => console.log('Abrir Cámara')}
      />
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
});
