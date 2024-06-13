import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  Pressable,
  useColorScheme,
  Image,
} from 'react-native';

import {AuthContext} from '../navigation/AuthContext';

export default function Profile() {
  const {logout} = React.useContext(AuthContext);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundColor = isDarkMode ? '#161716' : 'white';
  const textColor = isDarkMode ? '#FEFAE0' : 'black';
  const inputBorderColor = isDarkMode ? '#434343' : '#D3D3D3';
  const buttonIniciarBackground = isDarkMode ? '#FEFAE0' : 'black';
  const buttonCriarBackground = isDarkMode ? '#191A19' : 'white';
  const buttonIniciarTextColor = isDarkMode ? '#191A19' : 'white';
  const buttonCriarTextColor = isDarkMode ? '#FEFAE0' : 'black';

  const onPressLeave = () => {
    logout();
  };

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <View style={styles.content}>
        <Text style={[styles.textTitulo, {color: textColor}]}>
          PERFIL DO USER
        </Text>
        <Pressable
          style={[
            styles.buttonIniciar,
            {backgroundColor: buttonIniciarBackground},
          ]}
          onPress={onPressLeave}>
          <Text style={[styles.textIniciar, {color: buttonIniciarTextColor}]}>
            Sair
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: '5%',
  },

  input: {
    height: 40,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
  },
  buttonIniciar: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 3,
  },
  buttonCriar: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 3,
    borderWidth: 2,
  },
  textIniciar: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
  textCriar: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
  textTitulo: {
    fontSize: 26,
    fontFamily: 'Roboto',
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    marginBottom: 20,
  },
  forgotPassword: {
    marginBottom: 12,
  },
});
