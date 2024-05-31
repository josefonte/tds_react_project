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

  return (
    <View style={{flex: 1, backgroundColor: isDarkMode ? '#161716' : 'white'}}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          margin: '5%',
        }}>
        <Image
          source={require('../assets/logo.png')}
          style={{
            width: 150,
            height: 150,
            alignSelf: 'center',
            marginBottom: 12,
            marginTop: '10%',
          }}
        />

        <Text style={styles.textTitulo}>
          Inscreve-te ou inicia sessão para aceder ao teu perfil
        </Text>
        <Text style={{color: isDarkMode ? '#FEFAE0' : 'black'}}>Email</Text>
        <TextInput style={styles.input} onChangeText={setEmail} value={email} />
        <Text style={{color: isDarkMode ? '#FEFAE0' : 'black'}}>Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
        />
        <Text
          style={{
            color: isDarkMode ? '#FEFAE0' : 'black',
            marginBottom: 12,
          }}>
          Esqueceu-se da password?
        </Text>
        <Pressable style={styles.buttonIniciar} onPress={() => {}}>
          <Text style={styles.textIniciar}>Iniciar Sessão </Text>
        </Pressable>
        <Pressable style={styles.buttonCriar} onPress={() => {}}>
          <Text style={styles.textCriar}>Criar Conta </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    borderColor: '#434343',
    textShadowColor: 'black',
  },
  buttonIniciar: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#FEFAE0',
  },
  buttonCriar: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#191A19',
    borderColor: '#FEFAE0',
    borderWidth: 1.5,
  },
  textIniciar: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#191A19',
  },

  textCriar: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: '#FEFAE0',
  },
  textTitulo: {
    fontSize: 26,
    fontFamily: 'Roboto Slab',
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    marginBottom: 20,
    color: '#FEFAE0',
  },
});
