import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  useColorScheme,
} from 'react-native';

export default function Explore() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={{flex: 1, backgroundColor: isDarkMode ? '#161716' : 'white'}}>
      <Text>Explore</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
