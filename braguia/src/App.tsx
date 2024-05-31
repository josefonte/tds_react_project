/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import 'react-native-gesture-handler';

import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {SafeAreaView, useColorScheme} from 'react-native';

import About from './screens/About';
import Explore from './screens/Explore';
import Map from './screens/Map';
import Favorites from './screens/Favorites';
import Profile from './screens/Profile';

import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Tab = createBottomTabNavigator();

function TabGroup() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarActiveTintColor: isDarkMode ? '#FEFAE0' : 'black',
        tabBarInactiveTintColor: isDarkMode ? '#A3A3A3' : 'black',
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          backgroundColor: isDarkMode ? '#191A19' : 'white',
          borderTopColor: isDarkMode ? '#1B2107' : 'gray',
        },
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'About') {
            iconName = focused
              ? 'information-circle'
              : 'information-circle-outline';
            return <Ionicons name={iconName} size={28} color={color} />;
          } else if (route.name === 'Explore') {
            iconName = focused ? 'search' : 'search-outline';
            return <Ionicons name={iconName} size={26} color={color} />;
          }
          if (route.name === 'Map') {
            iconName = focused ? 'map-sharp' : 'map-outline';
            return <Ionicons name={iconName} size={26} color={color} />;
          }
          if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'hearto';
            return <AntDesign name={iconName} size={26} color={color} />;
          }
          if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
            return <Ionicons name={iconName} size={28} color={color} />;
          }
        },
      })}>
      <Tab.Screen name="About" component={About} />
      <Tab.Screen name="Explore" component={Explore} />
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="Favorites" component={Favorites} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

export default function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#191A19' : 'white',
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: backgroundStyle.backgroundColor}}>
      <NavigationContainer>
        <TabGroup />
      </NavigationContainer>
    </SafeAreaView>
  );
}
