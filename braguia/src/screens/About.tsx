import React from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  useColorScheme,
  TouchableOpacity,
  Image,
} from 'react-native';


export default function About() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#161716' : 'white', justifyContent: 'flex-start', alignItems: 'center'}}>
      <Image
        style={styles.imageLogo}
        source={require('../assets/logo.png')}
      />
      
      <Text style={{ fontSize: 50, fontWeight: 'bold', color: isDarkMode ? 'white' : 'black', marginTop:20, marginBottom:40}}>
        App name
      </Text>

      <Text style={{ fontSize: 20, color: isDarkMode ? 'white' : 'black', marginBottom:50}}>
        App description
      </Text>

      <View style={styles.buttonRow}>
        
        <Text style={{ fontSize: 15, textAlign: 'center', color: isDarkMode ? 'white' : 'black', marginBottom:30, marginRight: 30}}>
          Segue-nos em:
        </Text>
        
        <Text style={{ fontSize: 15, textAlign: 'center',  color: isDarkMode ? 'white' : 'black', marginBottom:30}}>
          Os nossos parceiros:
        </Text>

      </View>
        
      <View style={styles.buttonRow}>
  
        <TouchableOpacity style={styles.imageButton} onPress={() => alert('First Image Button Pressed')}>
          <Image
            style={styles.image}
            source={require('../assets/Facebook_logo.png')}
          />
        </TouchableOpacity>
        
        
        <TouchableOpacity style={styles.imageButton} onPress={() => alert('Second Image Button Pressed')}>
          <Image
            style={styles.image}
            source={require('../assets/umlogo.png')} // You can use a different image source here
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the buttons horizontally
    alignItems: 'center', // Center the buttons vertically
    marginBottom: 20, // Space between the button row and text
    marginRight:20,
  },
  imageButton: {
    marginHorizontal: 10, // Space between the two buttons
    alignItems: 'center', // Center the content of the button
    alignSelf: 'center', // Center the content of the button
  },
  imageLogo: {
    width: 200,
    height: 200,
    alignContent: 'center',
    resizeMode: 'cover', // or 'contain' depending on your needs
    marginBottom: 20,
    marginTop:70
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover', // or 'contain' depending on your needs
    alignSelf: 'center', // Center the image itself
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
});
