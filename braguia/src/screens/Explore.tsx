import SearchComponent from './../components/searchbar';
import FiltroIcon from './../components/filtroIcon';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  useColorScheme,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

export default function Explore() {
  const isDarkMode = useColorScheme() === 'dark';
  const textColor = isDarkMode ? '#FEFAE0' : 'black';

  return (
    <View style={{backgroundColor: isDarkMode ? '#161716' : 'white'}}>
      <View style={styles.containerTop}>
        <SearchComponent isDarkMode={isDarkMode} />
        <TouchableOpacity onPress={() => {}}>
          <Image
            style={styles.imageSuporte}
            source={require('./../assets/phone.png')}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>
        <FiltroIcon
          image1={require('./../assets/filtro11.png')}
          image2={require('./../assets/filtro12.png')}></FiltroIcon>
        <FiltroIcon
          image1={require('./../assets/filtro11.png')}
          image2={require('./../assets/filtro12.png')}></FiltroIcon>
        <FiltroIcon
          image1={require('./../assets/filtro11.png')}
          image2={require('./../assets/filtro12.png')}></FiltroIcon>
        <FiltroIcon
          image1={require('./../assets/filtro11.png')}
          image2={require('./../assets/filtro12.png')}></FiltroIcon>
        <FiltroIcon
          image1={require('./../assets/filtro11.png')}
          image2={require('./../assets/filtro12.png')}></FiltroIcon>
      </ScrollView>
      <Text style={[styles.textTitulo, {color: textColor}]}>
        Roteiros Populares
      </Text>
      <Text style={[styles.textTitulo, {color: textColor}]}>
        Pontos de Interesse
      </Text>
      <Text style={[styles.textTitulo, {color: textColor}]}>Sugestões</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  imageSuporte: {
    height: 50,
    width: 50,
    marginLeft: 10,
  },
  containerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textTitulo: {
    marginLeft: 10,
    fontSize: 26,
    fontFamily: 'Roboto',
    lineHeight: 32,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    marginBottom: 20,
  },
  scrollViewContent: {
    flexDirection: 'row',
    marginBottom: 20,
  },
});
