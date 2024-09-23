import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const AuthButton = ({ icon }) => {
  return (
    <TouchableOpacity style={styles.authButton}>
      <Image source={icon} style={styles.icon} resizeMode="contain" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  authButton: {
    backgroundColor: '#FCFCFE',
    padding: 15,
    borderRadius: 16,
    marginHorizontal: 10,
    width: width * 0.28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  icon: {
    width: 35,
    height: 35,
  },
});
