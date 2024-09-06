import {FlatList, Keyboard, Text, View} from 'react-native';
import {Icon, IconButton, Searchbar} from 'react-native-paper';
import {globalStyles, MyTheme} from '../theme/global.styles';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useAllStore} from '../store/all-store';
import {AddPlantCard} from '../components/AddPlantCard';
import {RootStackParamList} from '../routes/BottomTabsNavegator';
import {NavigationProp, useNavigation} from '@react-navigation/native';

export const AddPlantByNameScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const plantas = useAllStore(state => state.plantas);
  const [data, setData] = React.useState(plantas);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    filtrarPorNombre(query);
  };

  const filtrarPorNombre = (query: string) => {
    if (query.length === 0) {
      setData(plantas);
    } else {
      const filtered = plantas.filter(product =>
        product.nombre_comun.toLowerCase().includes(query.toLowerCase()),
      );
      setData(filtered);
    }
  };

  return (
    <View style={{backgroundColor: MyTheme.colors.background, flex: 1}}>
      <View style={{padding: 10}}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Buscar"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchbar}
            icon={() => null}
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
      )}
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
    elevation: 2,
  },
  searchbar: {
    flex: 1,
    elevation: 0,
    backgroundColor: 'transparent',
    paddingLeft: 0,
    marginLeft: -34,
  },
  flatList: {
    backgroundColor: MyTheme.colors.background,
    paddingTop: 10,
    flex: 1,
  },
});
