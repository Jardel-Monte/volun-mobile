import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const BotaoAuth = ({ icon }) => {
  return (
    <TouchableOpacity style={styles.BotaoAuth}>
      <Image source={icon} style={styles.icon} resizeMode="contain" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  BotaoAuth: {
    backgroundColor: '#FCFCFE',
    padding: 15,
    borderRadius: 16,
    marginHorizontal: 10,
    width: width * 0.28,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    width: 35,
    height: 35,
  },
});
