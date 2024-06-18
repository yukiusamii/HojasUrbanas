import {Platform, StyleSheet} from 'react-native';
import {DefaultTheme} from 'react-native-paper';

export const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#E20074', // Color Primario
    accent: '#666666', // Color Secundario
    background: '#ffffff', // Color de Fondo
    surface: '#ffffff', // Color de Superficie
    primary5: '#fce1ef',
    lightGrey: '#b7b7b7',
    // Puedes personalizar otros colores según necesites
  },
};

export const globalStyles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topLeftContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#ffffff',
  },

  title: {
    fontSize: 80,
    fontWeight: '300',
    color: MyTheme.colors.primary,
  },
  subtitle: {
    fontSize: 40,
    fontWeight: '300',
    color: MyTheme.colors.accent,
  },

  subtitle2: {
    fontSize: 20,
    fontWeight: '300',
    color: MyTheme.colors.accent,
    textAlign: 'center',
  },

  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: Platform.OS === 'android' ? 15 : 0,
  },
});
