import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Switch} from 'react-native-paper';
import {globalStyles} from '../theme/global.styles';

interface Props {
  onPress: () => void;
  label: string;
  checked: boolean;
}

export const CustomCheckBox = ({onPress, label, checked}: Props) => {
  return (
    // <Pressable
    //   onPress={onPress}
    //   style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}}>
    //   <Image
    //     source={
    //       checked
    //         ? require('../../assets/img/fertilizer.png') // ícono personalizado para estado seleccionado
    //         : require('../../assets/img/neutral.png') // ícono personalizado para estado no seleccionado
    //     }
    //     style={{width: 24, height: 24, marginRight: 8}}
    //   />
    //   <Text>{label}</Text>
    // </Pressable>

    <View style={styles.switchContainer}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={checked} onValueChange={onPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    ...globalStyles.headlineMedium,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    ...globalStyles.titleMedium,
  },
});
