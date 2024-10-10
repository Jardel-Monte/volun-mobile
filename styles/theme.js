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
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
  },
  textSemiBold: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
  },
  textBold: {
    fontFamily: 'Poppins-Bold',
    fontWeight: '1000',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  orangeFont: {
    color: theme.colors.secondary,
  },
});
