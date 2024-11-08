import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useFonts } from './hooks/useFonts';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import CriarConta from './screens/CriarConta';
import EntrarConta from './screens/EntrarConta';
import CriarContaForm from './screens/CriarContaForm';
import InfoForm from './screens/InfoForm';
import EventoInfo from './screens/EventoInfo';
import Perfil from './screens/Perfil';
import BemVindo from './screens/BemVindo';
import MyTabs from './screens/MyTabs';
import { AppRegistry } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  const fontsLoaded = useFonts();

//  useEffect(() => {
//    GoogleSignin.configure({
//      webClientId: '276715044615-plaeq5a4ckgbct3on37roeer5fhlfvcd.apps.googleusercontent.com',
//      offlineAccess: true,
//    });
//  }, []);

  if (!fontsLoaded) {
    return <SplashScreen />;
  }

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
          name='BemVindo'
          component={BemVindo}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='HomeScreen'
          component={MyTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='EventoInfo'
          component={EventoInfo}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Perfil'
          component={Perfil}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name='CriacaoEvento'
          component={???}
          options={{ headerShown: false }}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent('main', () => App);
