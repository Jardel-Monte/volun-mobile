import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from './hooks/useFonts';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import CriarConta from './screens/CriarConta';
import EntrarConta from './screens/EntrarConta';
import CriarContaForm from './screens/CriarContaForm';
import InfoForm from './screens/InfoForm';
import MyTabs from './screens/MyTabs'; // Correct import for MyTabs
import { AppRegistry } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  const fontsLoaded = useFonts();

  // Enquanto as fontes estão sendo carregadas, exibe a tela de splash
  if (!fontsLoaded) {
    return <SplashScreen />;
  }

  // Configura a navegação usando React Navigation
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen
          name='Login'
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='CriarConta'
          component={CriarConta}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='CriarContaForm'
          component={CriarContaForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='InfoForm'
          component={InfoForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='EntrarConta'
          component={EntrarConta}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='HomeScreen'
          component={MyTabs} // Use MyTabs instead of HomeScreen
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Registrando o componente principal
AppRegistry.registerComponent('main', () => App);