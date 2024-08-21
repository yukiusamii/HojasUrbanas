import {FlatList, View} from 'react-native';
import {IconButton, Searchbar} from 'react-native-paper';
import {MyTheme} from '../theme/global.styles';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useAllStore} from '../store/all-store';
import {ProductCard} from '../components/ProductCard';
import {PlantCard} from '../components/PlantCard';
import {AddPlantCard} from '../components/AddPlantCard';
import {RootStackParamList} from '../routes/BottomTabsNavegator';
import {NavigationProp, useNavigation} from '@react-navigation/native';

export const AddPlantByNameScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const plantas = useAllStore(state => state.plantas);
  const onChangeSearch = (query: string) => setSearchQuery(query);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={{backgroundColor: MyTheme.colors.background, flex: 1}}>
      <View style={{padding: 10}}>
        <View style={styles.searchContainer}>
          {/* <IconButton
            style={{position: 'absolute', left: 0, top: 0, zIndex: 99}}
            icon="filter-outline"
            size={24}
            onPress={() => console.log('Filter pressed')}
          /> */}
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
        data={plantas}
        renderItem={({item}) => (
          <AddPlantCard
            onPress={() => {}}
            id={item.id}
            nombre_comun={item.nombre_comun}
            img_url={item.img_url}
            fertilizacion={item.fertilizacion}
            riego={item.riego.verano}
            navigation={navigation}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginLeft: -34,
  },
  flatList: {
    backgroundColor: MyTheme.colors.background,
    paddingTop: 10,
    flex: 1,
  },
});
