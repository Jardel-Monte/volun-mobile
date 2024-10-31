import { StyleSheet } from 'react-native';

export const theme = {
  colors: {
    primary: '#1F0171',
    secondary: '#FF5C00',
    white: '#FFFFFF',
  },
};

export const globalStyles = StyleSheet.create({
  textRegular: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontWeight: '400',
  },
  textSemiBold: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontWeight: '600',
  },
  textBold: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontWeight: '1000',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  orangeFont: {
    color: theme.colors.secondary,
  },
});
