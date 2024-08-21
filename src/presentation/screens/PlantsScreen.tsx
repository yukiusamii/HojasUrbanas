import {FlatList, Image, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React from 'react';
import {PlantCard} from '../components/PlantCard';
import {usePlantStore} from '../store/plant-store';
import {globalStyles, MyTheme} from '../theme/global.styles';
import {RootStackParamList} from '../routes/BottomTabsNavegator';

export const PlantsScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const misPlantas = usePlantStore(state => state.misPlantas);

  return (
    <View style={{backgroundColor: MyTheme.colors.background, flex: 1}}>
      {misPlantas.length === 0 ? (
        // <Text style={{textAlign: 'center', marginTop: 20}}>No hay plantas</Text>
        <View style={{...globalStyles.centerContainer, gap: 16}}>
          <Image source={require('../../assets/img/No_added_plants.png')} />

          <Button mode="contained" icon="add" onPress={() => {}}>
            Añadir planta
          </Button>
        </View>
      ) : (
        <FlatList
          data={misPlantas}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View>
              <PlantCard
                onPress={() => {
                  console.log('Has pulsado: ');
                }}
                id={item.id}
                nombre_comun={item.nombre_comun}
                img_url={item.img_url}
                fertilizacion={item.fertilizacion}
                riego={item.riego}
              />
            </View>
          )}
        />
      )}
    </View>
  );
};
