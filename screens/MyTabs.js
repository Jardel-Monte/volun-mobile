// screens/MyTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './HomeScreen';
import ArtigosScreen from './ArtigosScreen';
import DesejosScreen from './DesejosScreen';
import NotificacoesScreen from './NotificacoesScreen';
import SearchScreen from './SearchScreen';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Início':
              iconName = 'home-outline';
              break;
            case 'Artigos':
              iconName = 'newspaper-outline';
              break;
            case 'Desejos':
              iconName = 'heart-outline';
              break;
            case 'Notificações':
              iconName = 'notifications-outline';
              break;
            case 'Buscar':
              iconName = 'search-outline';
              break;
            default:
              iconName = 'circle-outline';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Artigos" component={ArtigosScreen} />
      <Tab.Screen name="Desejos" component={DesejosScreen} />
      <Tab.Screen name="Notificações" component={NotificacoesScreen} />
      <Tab.Screen name="Buscar" component={SearchScreen} />
    </Tab.Navigator>
  );
}

export default MyTabs;