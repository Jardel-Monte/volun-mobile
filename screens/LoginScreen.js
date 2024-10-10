import React from 'react';
import { View, Image, TouchableOpacity, Text, Dimensions, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { globalStyles, theme } from '../styles/theme';
import { BotaoAuth } from '../componentes/botaoAuth';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/logo-name.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.botoesAuthContainer}>
        {/* Passe o navigation para BotaoAuth */}
        <BotaoAuth icon={require('../assets/images/google.png')} navigation={navigation} />
        <BotaoAuth icon={require('../assets/images/facebook.png')} navigation={navigation} />
      </View>
      <TouchableOpacity style={styles.botaoCriarConta} onPress={() => navigation.navigate('CriarConta')}>
        <Text style={[styles.botaoCriarContaTexto, globalStyles.textBold]}>Criar Conta</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.botaoLogin} onPress={() => navigation.navigate('EntrarConta')}>
        <Text style={[styles.botaoLoginTexto, globalStyles.textBold]}>Entrar</Text>
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
  botoesAuthContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 120,
  },
  botaoCriarConta: {
    backgroundColor: theme.colors.white,
    paddingVertical: 15,
    borderRadius: 16,
    width: width * 0.62,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },  
    shadowOpacity: 0.25,                    
    shadowRadius: 4,                        
    elevation: 5,                           
  },
  botaoCriarContaTexto: {
    color: theme.colors.primary,
    fontSize: 16,
  },
  botaoLogin: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 15,
    borderRadius: 16,
    width: width * 0.62,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },  
    shadowOpacity: 0.25,                    
    shadowRadius: 4,                        
    elevation: 5,                           
  },
  botaoLoginTexto: {
    color: theme.colors.white,
    fontSize: 16,
  },
});
