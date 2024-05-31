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

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import About from './src/screens/About';
import Explore from './src/screens/Explore';
import Map from './src/screens/Map';
import Favorites from './src/screens/Favorites';
import Profile from './src/screens/Profile';

const Tab = createBottomTabNavigator();

function TabGroup() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="About" component={About} options={{}} />
      <Tab.Screen name="Explore" component={Explore} options={{}} />
      <Tab.Screen name="Map" component={Map} options={{}} />
      <Tab.Screen name="Favorites" component={Favorites} options={{}} />
      <Tab.Screen name="Profile" component={Profile} options={{}} />
    </Tab.Navigator>
  );
}

export default function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
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
