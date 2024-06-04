import SearchComponent from './../components/searchbar';
import FiltroIcon from './../components/filtroIcon';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
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
import {Trail} from './../model/model';

import {fetchTrails} from './../redux/actions';
import {AppDispatch, RootState} from './../redux/store';
import {useDispatch, useSelector} from 'react-redux';

import PhoneImag from './../assets/phone.svg';
import naturaSel from './../assets/natureza_filter_sel.svg';
import naturaUnsel from './../assets/natureza_filter_not.svg';
import bebidaSel from './../assets/bebida_filter_sel.svg';
import bebidaUnsel from './../assets/bebida_filter_not.svg';
import comidaSel from './../assets/comida_filter_sel.svg';
import comidaUnsel from './../assets/comida_filter_not.svg';
import culturaSel from './../assets/cultura_filter_sel.svg';
import culturaUnsel from './../assets/cultura_filter_not.svg';
import religiaoSel from './../assets/religiao_filter_sel.svg';
import religiaoUnsel from './../assets/religiao_filter_not.svg';

export default function Explore() {
  const isDarkMode = useColorScheme() === 'dark';
  const textColor = isDarkMode ? '#FEFAE0' : 'black';
  const navigation = useNavigation();

  const trailsState = useSelector((state: RootState) => state.trails);
  const useAppDispatch = useDispatch.withTypes<AppDispatch>();

  const dispatch = useDispatch();
  useEffect(() => {
    // Dispatch fetchTrails action to load data into the store
    // dispatch<any>(fetchTrails()); ISTO FUNCIONA MAS DA ASNEIRA NO HOT RELOAD
    dispatch(fetchTrails());
  }, []);

  return (
    <View style={{backgroundColor: isDarkMode ? '#161716' : 'white'}}>
      <View style={styles.containerTop}>
        <SearchComponent isDarkMode={isDarkMode} />
        <TouchableOpacity onPress={() => navigation.navigate('Support')}>
          <PhoneImag height={50} width={50} />
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
      <ScrollView>
        {trailsState.trails.map((trail: Trail, index: number) => (
          <View key={index}>
            <Text>Oi</Text>
            <Text>{trail.trailId}</Text>
            <Text>{trail.trailName}</Text>
            <Text>{trail.trailDesc}</Text>
          </View>
        ))}
      </ScrollView>
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
