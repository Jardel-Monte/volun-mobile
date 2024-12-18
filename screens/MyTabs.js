import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Material Icons
import HomeScreen from './HomeScreen';
import OrgScreen from './OrgScreen';
import PerfilScreen from './PerfilScreen';
import CategoriasScreen from './CategoriasScreen';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Início':
              iconName = 'home';
              break;
            case 'Organização':
              iconName = 'article';
              break;
            
            case 'Buscar':
              iconName = 'search';
              break;
            case 'Perfil':
              iconName = 'person';
              break;
            default:
              iconName = 'circle';
              break;
          }

          return (
            <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
              <Icon name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'tomato',
        tabBarStyle: {
          height: 64,
          paddingBottom: 0,
          paddingTop: 0,
          marginBottom: 5,
          backgroundColor: 'white', // Set the tab bar background color to white
          borderRadius: 64,
          marginLeft: 3,
          marginRight: 3,
        },
        tabBarLabel: () => null, // Hide the default tab label
        headerShown: false,
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Organização" component={OrgScreen} />
      <Tab.Screen name="Buscar" component={CategoriasScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 6,
  },
  activeIconContainer: {
    backgroundColor: "rgba(57, 66, 134, 0.88)",
  },
});

export default MyTabs;