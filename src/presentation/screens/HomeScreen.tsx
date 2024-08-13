import {View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {type RootStackParamList} from '../routes/BottomTabsNavegator';
import {MyTheme, globalStyles} from '../theme/global.styles';
import {useProfileStore} from '../store/profile-store';

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const changeProfile = useProfileStore(state => state.changeProfile);
  return (
    <View style={globalStyles.topLeftContainer}>
      <Text>HomeScreen</Text>
      <Button
        mode="contained"
        style={{marginBottom: 16, marginTop: 24}}
        onPress={async () => {
          navigation.navigate('Prueba');
        }}>
        Go to Prueba
      </Button>

      <Button
        mode="contained"
        style={{marginBottom: 16, marginTop: 24}}
        onPress={() => {
          changeProfile('Yousra', 'Yousra@emial.com');
        }}>
        Cambiar datos
      </Button>
    </View>
  );
};
