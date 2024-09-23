import React from 'react';
import { View, Image, TouchableOpacity, Text, Dimensions, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { globalStyles, theme } from '../styles/theme';
import { AuthButton } from '../componentes/authButton';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/logo-name.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.authButtonsContainer}>
        <AuthButton icon={require('../assets/images/google.png')} />
        <AuthButton icon={require('../assets/images/facebook.png')} />
      </View>
      <TouchableOpacity style={styles.createAccountButton}>
        <Text style={[styles.createAccountButtonText, globalStyles.textSemiBold]}>Criar Conta</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton}>
        <Text style={[styles.loginButtonText, globalStyles.textSemiBold]}>Entrar</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFE',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: width * 0.6,
    height: undefined,
    aspectRatio: 3,
    marginTop: 90,
    marginBottom: 140,
  },
  authButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 120,
  },
  createAccountButton: {
    backgroundColor: theme.colors.white,
    paddingVertical: 15,
    borderRadius: 10,
    width: width * 0.62,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  createAccountButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 15,
    borderRadius: 10,
    width: width * 0.62,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  loginButtonText: {
    color: theme.colors.white,
    fontSize: 16,
  },
});
