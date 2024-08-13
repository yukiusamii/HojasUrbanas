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

export const CartScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View style={globalStyles.topLeftContainer}>
      <Text>CartScreen</Text>
      <Button
        mode="contained"
        style={{marginBottom: 16, marginTop: 24}}
        onPress={async () => {
          navigation.navigate('Auth');
        }}>
        Go to AuthScreen
      </Button>
    </View>
  );
};
