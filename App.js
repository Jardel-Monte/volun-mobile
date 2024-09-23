import React from 'react';
import { useFonts } from './hooks/useFonts';
import LoginScreen from './screens/LoginScreen';
import SplashScreen from './screens/SplashScreen';

export default function App() {
  const fontsLoaded = useFonts();

  if (!fontsLoaded) {
    return <SplashScreen />;
  }

  return <LoginScreen />;
}
