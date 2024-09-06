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
import {Planta} from '../models/models';

export const PruebasScreen = () => {
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
          } as Planta;
        });

        setData(plantasData);

        const urls: {[key: string]: string} = {};
        for (const planta of plantasData) {
          // console.log(
          //   '-----------------*Precio Planta: ',
          //   planta.nombre_comun,
          //   planta.precio,
          // );

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
    <View style={{backgroundColor: MyTheme.colors.background}}>
      {/* <FlatList
        style={styles.flatList}
        data={data}
        renderItem={({item}) => (
          <ProductCard
            onPress={() => {}}
            nombre_comun={item.nombre_comun}
            img_url={imageUrls[item.img_url]}
            precio={item.precio}
            rating={{nota: 4.2, total: 3}}
          />
        )}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  flatList: {
    backgroundColor: MyTheme.colors.background,
    paddingTop: 10,
  },
});
