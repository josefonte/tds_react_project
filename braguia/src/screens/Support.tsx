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

import Site from './../assets/site.svg';
import Mail from './../assets/mail.svg';
import Phone from './../assets/phone2.svg';
import Redirect from './../assets/redirect.svg';

export default function Support() {
  const isDarkMode = useColorScheme() === 'dark';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      backgroundColor: isDarkMode? '#161716' : '#FEFAE0',
      alignItems: 'flex-start',
    },
  
    titleText: {
      fontSize: 50,
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      color: isDarkMode ? '#FEFAE0' : 'black',
      marginTop:20,
      marginBottom:40,
      marginStart:20,
      alignContent: 'flex-start'
    },

    appDescText: {
      fontSize:20,
      fontFamily: 'Roboto',
      color: isDarkMode ? '#FEFAE0' : 'black',
      marginBottom:20,
      marginTop:20,
      marginStart:20,
    },
  

    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between', // Center the buttons horizontally
      alignItems: 'center', // Center the buttons vertically
      marginBottom: 5, // Space between the button row and text
      width: '80%'
    },

    infoText:{
      fontSize:15,
      fontFamily: 'Roboto',
      color: isDarkMode ? '#FEFAE0' : 'black',
    },

    imageButton: {
      marginHorizontal: 10, // Space between the two buttons
      alignItems: 'center', // Center the content of the button
      alignSelf: 'center', // Center the content of the button
    },

  });
  

  return (
    <View style={styles.container}>

      <Text style={styles.titleText}>
        Bem Vindo ao Suporte do BraGuia
      </Text>

      

      <Text style={styles.appDescText}>
        Customer Support
      </Text>

      <TouchableOpacity style={styles.imageButton} onPress={() => alert('First Image Button Pressed')}>
        <View style={styles.rowContainer}>
          <Site height={20} width={20} />
          <Text style={styles.infoText}>
            site 
          </Text>
          <Redirect height={20} width={20} />
        </View>
      </TouchableOpacity>


      <TouchableOpacity style={styles.imageButton} onPress={() => alert('First Image Button Pressed')}>
        <View style={styles.rowContainer}>
          <Mail height={20} width={20} />
          <Text style={styles.infoText}>
            mail
          </Text>
          <Redirect height={20} width={20} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.imageButton} onPress={() => alert('First Image Button Pressed')}>
        <View style={styles.rowContainer}>
          <Phone height={20} width={20} />
          <Text style={styles.infoText}>
            phone
          </Text>
          <Redirect height={20} width={20} />
        </View>
      </TouchableOpacity>



      <Text style={styles.appDescText}>
        Medical Emergency Service
      </Text>

      <TouchableOpacity style={styles.imageButton} onPress={() => alert('First Image Button Pressed')}>
        <View style={styles.rowContainer}>
          <Site height={20} width={20} />
          <Text style={styles.infoText}>
            site 
          </Text>
          <Redirect height={20} width={20} />
        </View>
      </TouchableOpacity>


      <TouchableOpacity style={styles.imageButton} onPress={() => alert('First Image Button Pressed')}>
        <View style={styles.rowContainer}>
          <Mail height={20} width={20} />
          <Text style={styles.infoText}>
            mail
          </Text>
          <Redirect height={20} width={20} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.imageButton} onPress={() => alert('First Image Button Pressed')}>
        <View style={styles.rowContainer}>
          <Phone height={20} width={20} />
          <Text style={styles.infoText}>
            phone
          </Text>
          <Redirect height={20} width={20} />
        </View>
      </TouchableOpacity>
    </View>
  );
}
