import {ActivityIndicator, Image, ScrollView, Text, View} from 'react-native';
import {useRoute, RouteProp, useFocusEffect} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import React from 'react';
import {Planta} from '../models/models';
import {globalStyles, MyTheme} from '../theme/global.styles';
import FastImage from 'react-native-fast-image';
import {StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';
import {RootStackParamList} from '../routes/BottomTabsNavegator';
import {NavigationProp, useNavigation} from '@react-navigation/native';
export const DetailScreen = () => {
  const params = useRoute<RouteProp<RootStackParamList, 'Detail'>>().params;
  const [plant, setPlant] = React.useState<Planta | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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
        };
        setPlant(planta);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching plant data:', error);
    } finally {
      // Aseguramos que el loading se desactive incluso en caso de error
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true); // Reestablecer el estado de carga al tener el foco

      if (params.type) {
      } else {
        getPlant(params.id);
      } // Llamada a la función cuando la pantalla tiene foco
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
        }} // Abrir el modal de confirmación
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.tagWrapper}>
          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>{plant?.etiquetas.cuidado}</Text>
          </View>

          <View style={styles.tagContainer}>
            <Text style={styles.tagText}>{plant?.etiquetas.localizacion}</Text>
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
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    ...globalStyles.labelLarge,
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
});
