import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Material Icons
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
              iconName = 'home';
              break;
            case 'Artigos':
              iconName = 'article';
              break;
            case 'Desejos':
              iconName = 'favorite';
              break;
            case 'Notificações':
              iconName = 'notifications';
              break;
            case 'Buscar':
              iconName = 'search';
              break;
            default:
              iconName = 'circle';
              break;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'darkblue',
        tabBarInactiveTintColor: 'tomato',
        tabBarStyle: {
          height: 70, 
          paddingBottom: 16, 
          paddingTop: 16,
        },
      })}
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