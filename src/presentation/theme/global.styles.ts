import {Platform, StyleSheet} from 'react-native';
import {DefaultTheme} from 'react-native-paper';
import {black} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

export const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4DB22A', // Color Primario
    accent: '#656565', // Color Secundario
    background: '#ffffff', // Color de Fondo
    surface: '#ffffff',
    tertiary100: '#DEF7FF',
    primary5: '#fce1ef',
    lightGrey: '#b7b7b7',
    black: '#1A1A1A',
    navBar: '#D4F5D4',
    white: '#ffffff',
  },
};

export const globalStyles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
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

  /* Headline Styles */
  headlineLarge: {
    color: MyTheme.colors.accent,
    fontFamily: 'Roboto',
    fontSize: 32,
    fontWeight: '400',
    lineHeight: 40,
    letterSpacing: 0,
  },
  headlineMedium: {
    color: MyTheme.colors.accent,
    fontFamily: 'Roboto',
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 36,
    letterSpacing: 0,
  },
  headlineSmall: {
    color: MyTheme.colors.accent,
    fontFamily: 'Roboto',
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 32,
    letterSpacing: 0,
  },

  /* Title Styles */
  titleLarge: {
    color: MyTheme.colors.accent,
    fontFamily: 'Roboto',
    fontSize: 22,
    fontWeight: '400',
    lineHeight: 28,
    letterSpacing: 0,
  },
  titleMedium: {
    color: MyTheme.colors.accent,
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  titleSmall: {
    color: MyTheme.colors.accent,
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  /* Label Styles */
  labelLarge: {
    color: MyTheme.colors.accent,
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelMedium: {
    color: MyTheme.colors.accent,
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSmall: {
    color: MyTheme.colors.accent,
    fontFamily: 'Roboto',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.5,
  },

  /* Body Styles */
  bodyLarge: {
    color: MyTheme.colors.accent,
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  bodyMedium: {
    color: MyTheme.colors.accent,
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bodySmall: {
    color: MyTheme.colors.accent,
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  rowCenterCenter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCenterSpaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenterEnd: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  rowCenterStart: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  colCenterCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  colStartStart: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});
