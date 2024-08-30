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
