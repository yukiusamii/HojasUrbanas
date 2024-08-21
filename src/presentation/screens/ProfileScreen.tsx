import {Image, Pressable, StyleSheet, View} from 'react-native';

import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
// import {type RootStackParamList} from '../routes/BottomTabsNavegator';
import {MyTheme, globalStyles} from '../theme/global.styles';
import {useProfileStore} from '../store/profile-store';
import {Button} from 'react-native-paper';

export const ProfileScreen = () => {
  // const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={globalStyles.centerContainer}>
      <Button
        onPress={() => {
          // navigation.navigate('Auth', {pantalla: 'InfoProfile'});
        }}>
        Iniciar Sesión
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  googleBtn: {
    borderRadius: 43,
    shadowColor: 'rgba(30, 30, 30, 0.6)',
    shadowOffset: {
      width: 0,
      height: 16,
    },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 5,
    marginTop: 20,
  },
  googleBtnPressed: {
    elevation: 1,
  },
});
