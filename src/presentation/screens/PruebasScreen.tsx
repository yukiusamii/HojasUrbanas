import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

interface Planta {
  nom_comun: string;
  descripcion: string;
  img_url: string;
  // Agrega otros campos que tengas en tu documento de planta
}

export const PruebasScreen = () => {
  const [data, setData] = useState<Planta[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState<{[key: string]: string}>({});

  const getImageUrl = async (imgUrl: string) => {
    console.log('************URL getImageUrl: ', imgUrl);
    if (
      !imgUrl ||
      (!imgUrl.startsWith('gs://') && !imgUrl.startsWith('https://'))
    ) {
      console.error('URL de la imagen no válida:', imgUrl);
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
            nom_comun: docData.nom_comun,
            descripcion: docData.descripcion,
            img_url: docData.img_url,
            // Agrega otros campos que tengas en tu documento de planta
          } as Planta;
        });

        setData(plantasData);

        const urls: {[key: string]: string} = {};
        for (const planta of plantasData) {
          console.log('-----------------*URL FOR: ', planta.img_url);

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
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{display: 'flex', flexDirection: 'column', gap: 30}}>
      {data.map((planta, index) => (
        <View key={index}>
          <Text>{planta.nom_comun}</Text>
          <Text>{planta.descripcion}</Text>
          {imageUrls[planta.img_url] ? (
            <FastImage
              style={{width: 200, height: 200}}
              source={{
                uri: imageUrls[planta.img_url],
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          ) : (
            <ActivityIndicator size="small" color="#0000ff" />
          )}
          {/* Renderiza otros campos según sea necesario */}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 200, // ajusta el tamaño de la imagen según tus necesidades
    height: 200,
    resizeMode: 'contain', // puedes usar 'cover', 'stretch', etc. según tus necesidades
    marginBottom: 8,
  },
  subtitle1: {
    fontSize: 30,
    fontWeight: '200',
    color: 'white',
    textAlign: 'center',
  },
  subtitle2: {
    fontSize: 30,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});
