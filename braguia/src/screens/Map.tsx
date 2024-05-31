import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  useColorScheme,
} from 'react-native';

export default function Map() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={{flex: 1, backgroundColor: isDarkMode ? '#161716' : 'white'}}>
      <Text>Map</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
