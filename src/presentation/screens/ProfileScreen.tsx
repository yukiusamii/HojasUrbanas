import {View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {type RootStackParamList} from '../routes/BottomTabsNavegator';
import {useProfileStore} from '../store/profile-store';
import {MyTheme, globalStyles} from '../theme/global.styles';

export const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const name = useProfileStore(state => state.name);
  const email = useProfileStore(state => state.email);

  return (
    <View style={globalStyles.topLeftContainer}>
      {/* <Text>ProfileScreen</Text> */}

      <Text style={globalStyles.titleLarge}>{name}</Text>
      <Text style={globalStyles.titleLarge}>{email}</Text>
      {/* <Button
        mode="contained"
        style={{marginBottom: 16, marginTop: 24}}
        onPress={async () => {
          navigation.navigate('Prueba');
        }}>
        Go to Prueba
      </Button> */}
    </View>
  );
};
