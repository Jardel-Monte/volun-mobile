import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, Dimensions } from 'react-native';

export default function SplashScreen({ onSplashEnd }) {
  const { width } = Dimensions.get('window');

  useEffect(() => {
    const timer = setTimeout(() => {
      // Após 3 segundos, chama a função para finalizar a splash screen
      if (onSplashEnd) {
        onSplashEnd();
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [onSplashEnd]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/logo-start.png')}
        style={{ width: width * 0.75, height: undefined, aspectRatio: 3 }}
        resizeMode="contain"
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C024F',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
