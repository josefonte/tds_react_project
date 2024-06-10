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
import AppLogo from './../assets/logo.svg';
import FacebookLogo from './../assets/facebook.svg';
import UmLogo from './../assets/umlogo.svg';
import {fetchTrails} from '../redux/actions';
import {useAppDispatch} from '../redux/hooks';

export default function About() {
  const isDarkMode = useColorScheme() === 'dark';

  const dispatch = useAppDispatch();
  dispatch(fetchTrails());

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      backgroundColor: isDarkMode ? '#161716' : '#FEFAE0',
      alignItems: 'center',
    },

    appNameText: {
      fontSize: 50,
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      color: isDarkMode ? '#FEFAE0' : 'black',
      marginTop: 20,
      marginBottom: 40,
    },

    appDescText: {
      fontSize: 20,
      fontFamily: 'Roboto',
      color: isDarkMode ? '#FEFAE0' : 'black',
      marginBottom: 50,
    },

    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between', // Center the buttons horizontally
      alignItems: 'center', // Center the buttons vertically
      marginBottom: 5, // Space between the button row and text
      width: '80%',
    },

    infoText: {
      fontSize: 15,
      fontFamily: 'Roboto',
      color: isDarkMode ? '#FEFAE0' : 'black',
      marginBottom: 30,
    },

    imageButton: {
      marginHorizontal: 10, // Space between the two buttons
      alignItems: 'center', // Center the content of the button
      alignSelf: 'center', // Center the content of the button
    },

    image: {
      width: 100,
      height: 100,
      resizeMode: 'cover', // or 'contain' depending on your needs
      alignSelf: 'center', // Center the image itself
    },
  });

  return (
    <View style={styles.container}>
      <AppLogo height={250} width={250} marginTop={50} />

      <Text style={styles.appNameText}>App name</Text>

      <Text style={styles.appDescText}>App description</Text>

      <View style={styles.rowContainer}>
        <Text style={styles.infoText}>Segue-nos em:</Text>
        <Text style={styles.infoText}>Os nossos parceiros:</Text>
      </View>

      <View style={styles.rowContainer}>
        <TouchableOpacity
          style={styles.imageButton}
          onPress={() => alert('First Image Button Pressed')}>
          <FacebookLogo height={100} width={100} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.imageButton}
          onPress={() => alert('Second Image Button Pressed')}>
          {/*
          <Image
            style={styles.image}
            source={require('../assets/umlogo.png')} // You can use a different image source here
          />*/}

          <UmLogo height={100} width={100} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
