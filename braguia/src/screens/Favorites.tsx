import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  useColorScheme,
} from 'react-native';

export default function Favorites() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={{flex: 1, backgroundColor: isDarkMode ? '#161716' : 'white'}}>
      <Text>Favorites</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
