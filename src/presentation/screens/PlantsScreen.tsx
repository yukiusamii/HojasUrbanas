import {View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {type RootStackParamList} from '../routes/BottomTabsNavegator';
import {MyTheme, globalStyles} from '../theme/global.styles';
import {useCallback} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import React from 'react';

export const PlantsScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [user, setUser] = React.useState<FirebaseAuthTypes.User | null>(null);
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = auth().onAuthStateChanged(u => {
        setUser(u);
        console.log('***U***');
        if (u) {
          console.log('Usuario autenticado:', u.email);
          // navigation.navigate('MyPlants');
        } else {
          console.log('No hay usuario autenticado');
        }
      });

      // Limpieza cuando el componente se desmonta
      return unsubscribe;
    }, []),
  );
  return (
    <View style={globalStyles.centerContainer}>
      <Button
        onPress={() => {
          navigation.navigate('Auth', {pantalla: 'MyPlants'});
        }}>
        Iniciar Sesión
      </Button>
    </View>
  );
};
