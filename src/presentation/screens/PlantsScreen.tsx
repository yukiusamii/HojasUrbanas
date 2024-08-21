import {FlatList, Image, StyleSheet, View} from 'react-native';
import {Button, FAB, IconButton, Modal, Portal, Text} from 'react-native-paper';
import React, {useState} from 'react';
import {PlantCard} from '../components/PlantCard';
import {usePlantStore} from '../store/plant-store';
import {globalStyles, MyTheme} from '../theme/global.styles';
import {RootStackParamList} from '../routes/BottomTabsNavegator';
import {NavigationProp, useNavigation} from '@react-navigation/native';
export const PlantsScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const misPlantas = usePlantStore(state => state.misPlantas);
  const [visible, setVisible] = useState(false); // Controla la visibilidad del modal

  const hideModal = () => setVisible(false);
  const openModal = () => setVisible(true);

  return (
    <View style={{backgroundColor: MyTheme.colors.background, flex: 1}}>
      {misPlantas.length === 0 ? (
        // <Text style={{textAlign: 'center', marginTop: 20}}>No hay plantas</Text>
        <View style={{...globalStyles.centerContainer, gap: 16}}>
          <Image source={require('../../assets/img/No_added_plants.png')} />

          <Button
            mode="contained"
            icon="add"
            onPress={() => {
              openModal();
            }}>
            Añadir planta
          </Button>
        </View>
      ) : (
        <View style={{flex: 1}}>
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
          <FAB
            icon="add"
            color={MyTheme.colors.primary}
            style={styles.fab}
            size="medium"
            onPress={() => openModal()}
          />
        </View>
      )}

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainerStyle}>
          {/* Contenido del modal */}
          <View style={{alignItems: 'center'}}>
            <IconButton
              icon="close"
              size={24}
              onPress={hideModal}
              style={{alignSelf: 'flex-end'}}
            />

            <Button
              icon="camera"
              mode="contained"
              onPress={() => console.log('Identificar con foto')}
              style={{marginBottom: 16, marginTop: 45}}>
              Identificar con foto
            </Button>

            <Button
              icon="search"
              mode="outlined"
              onPress={() => {
                hideModal();
                navigation.navigate('AddPlantByName');
              }}
              style={{marginBottom: 45}}>
              Buscar por nombre
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};
const styles = StyleSheet.create({
  modalContainerStyle: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: MyTheme.colors.navBar,
  },
});
