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

export default function Profile() {
  const isDarkMode = useColorScheme() === 'dark';

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const backgroundColor = isDarkMode ? '#161716' : 'white';
  const textColor = isDarkMode ? '#FEFAE0' : 'black';
  const inputBorderColor = isDarkMode ? '#434343' : '#D3D3D3';
  const buttonIniciarBackground = isDarkMode ? '#FEFAE0' : 'black';
  const buttonCriarBackground = isDarkMode ? '#191A19' : 'white';
  const buttonIniciarTextColor = isDarkMode ? '#191A19' : 'white';
  const buttonCriarTextColor = isDarkMode ? '#FEFAE0' : 'black';

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <View style={styles.content}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={[styles.textTitulo, {color: textColor}]}>
          Inscreve-te ou inicia sessão para aceder ao teu perfil
        </Text>
        <Text style={{color: textColor}}>Email</Text>
        <TextInput
          style={[
            styles.input,
            {borderColor: inputBorderColor, color: textColor},
          ]}
          onChangeText={setEmail}
          value={email}
        />
        <Text style={{color: textColor}}>Password</Text>
        <TextInput
          style={[
            styles.input,
            {borderColor: inputBorderColor, color: textColor},
          ]}
          onChangeText={setPassword}
          value={password}
        />
        <Text style={[styles.forgotPassword, {color: textColor}]}>
          Esqueceu-se da password?
        </Text>
        <Pressable
          style={[
            styles.buttonIniciar,
            {backgroundColor: buttonIniciarBackground},
          ]}>
          <Text style={[styles.textIniciar, {color: buttonIniciarTextColor}]}>
            Iniciar Sessão
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.buttonCriar,
            {backgroundColor: buttonCriarBackground},
          ]}>
          <Text
            style={[
              styles.textCriar,
              {color: buttonCriarTextColor, borderColor: buttonCriarTextColor},
            ]}>
            Criar Conta
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
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 12,
    marginTop: '10%',
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
    borderWidth: 1.5,
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
