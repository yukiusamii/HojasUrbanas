import {Image, StyleSheet, Text, View} from 'react-native';
import {useProfileStore} from '../store/profile-store';
import {MyTheme, globalStyles} from '../theme/global.styles';
import FastImage from 'react-native-fast-image';
import {IconButton} from 'react-native-paper';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {type RootStackParamList} from '../routes/BottomTabsNavegator';
export const InfoProfileScreen = () => {
  const name = useProfileStore(state => state.name);
  const userName = useProfileStore(state => state.userName);
  const email = useProfileStore(state => state.email);
  const photoURL = useProfileStore(state => state.photoURL);
  const bibliografia = useProfileStore(state => state.bibliografia);
  const direccion = useProfileStore(state => state.direccion);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // const photoURL = null;

  return (
    <View style={{backgroundColor: MyTheme.colors.background, flex: 1}}>
      {photoURL ? (
        <FastImage
          style={styles.image}
          source={{
            uri: photoURL,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <Image
          style={styles.image}
          source={require('../../assets/img/default_profile_img.png')}
        />
      )}

      <View style={styles.edit}>
        <Text style={styles.name}>{userName}</Text>
        <IconButton
          icon="create-outline"
          size={30}
          iconColor={MyTheme.colors.accent}
          style={{backgroundColor: 'rgba(212, 245, 212, 0.6)'}}
          onPress={() => {
            navigation.navigate('EditProfile', {firstTime: false});
          }}
        />
      </View>
      <View style={styles.infoContainer}>
        {/* NOMBRE COMPLETO */}
        <View style={styles.infowrap}>
          <Text style={globalStyles.labelMedium}>Nombre Completo</Text>
          <Text
            style={{...globalStyles.bodyLarge, color: MyTheme.colors.black}}>
            {name}
          </Text>
        </View>
        {/* EMIAL */}
        <View style={styles.infowrap}>
          <Text style={globalStyles.labelMedium}>Correo</Text>
          <Text
            style={{...globalStyles.bodyLarge, color: MyTheme.colors.black}}>
            {email}
          </Text>
        </View>

        {/* Diredccion */}
        <View style={styles.infowrap}>
          <Text style={globalStyles.labelMedium}>Dirección</Text>
          <Text
            style={{...globalStyles.bodyLarge, color: MyTheme.colors.black}}>
            {direccion}
          </Text>
        </View>

        {/* Bibliografía */}
        <View style={styles.infowrap}>
          <Text style={globalStyles.labelMedium}>Bibliografía</Text>
          <Text
            style={{...globalStyles.bodyLarge, color: MyTheme.colors.black}}>
            {bibliografia}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300,
  },
  infoContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: 16,
  },
  infowrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  name: {
    ...globalStyles.headlineLarge,
    color: MyTheme.colors.white,
    fontWeight: '800',
    textShadowColor: 'rgba(112, 109, 109, 0.6)', // Color de la sombra
    textShadowOffset: {width: 3, height: 2}, // Desplazamiento de la sombra
    textShadowRadius: 5, // Radio de desenfoque de la sombra
  },
  edit: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    left: 0,
    top: 230,
  },
});
