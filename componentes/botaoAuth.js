import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../services/firebase-config';

const { width } = Dimensions.get('window');

export const BotaoAuth = ({ icon, navigation }) => {
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices(); // Verifica se os serviços do Google Play estão disponíveis
      
      const userInfo = await GoogleSignin.signIn(); // Faz o login com o Google
      
      const googleCredential = GoogleAuthProvider.credential(userInfo.idToken); // Obtém as credenciais do Google
      
      // Autentica no Firebase usando as credenciais do Google
      await signInWithCredential(auth, googleCredential); 
      
      console.log('Usuário logado com sucesso!', userInfo);
      
      // Navega para a HomeScreen após o login bem-sucedido
      navigation.navigate('HomeScreen');
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Login cancelado pelo usuário');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Login em andamento');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Google Play Services não disponível ou desatualizado');
      } else {
        console.log('Erro ao logar com Google:', error); // Exibe qualquer outro erro
      }
    }
  };

  return (
    <TouchableOpacity style={styles.BotaoAuth} onPress={handleGoogleSignIn}>
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