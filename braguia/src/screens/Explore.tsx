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
import {Pin, Trail} from './../model/model';

import {fetchTrails} from './../redux/actions';
import {AppDispatch, RootState} from './../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {useAppSelector, useAppDispatch} from './../redux/hooks';

// COMPONENTES
import SearchComponent from './../components/searchbar';
import FiltroIcon from './../components/filtroIcon';
import PopularTrail from './../components/PopularTrail';
import SugestedTrail from './../components/SugestedTrail';
import PontoDeInteresse from './../components/PontoDeInteresse';

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

  const [pins, setPins] = useState<Pin[]>([]);

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchTrails());
  }, []);

  return (
    <ScrollView>
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
        {trailsState.trails && trailsState.trails.length > 0 ? (
          <ScrollView horizontal={true} style={styles.scrollViewPop}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('TrailDetail', {
                  trail: trailsState.trails[0],
                })
              }>
              <PopularTrail trail={trailsState.trails[0]} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('TrailDetail', {
                  trail: trailsState.trails[2],
                })
              }>
              <PopularTrail trail={trailsState.trails[2]} />
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <Text>Loading...</Text>
        )}
        <Text style={[styles.textTitulo, {color: textColor}]}>
          Pontos de Interesse
        </Text>
        {trailsState.pins && trailsState.pins.length > 0 ? (
          <ScrollView horizontal={true} style={styles.scrollViewPop}>
            {trailsState.pins
              .filter(
                (pin, index, self) =>
                  self.findIndex(p => p.pinId === pin.pinId) === index,
              )
              .map((pin: Pin, index: number) => (
                <View key={index}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('PontoDeInteresseDetail', {
                        pin: pin,
                      })
                    }>
                    <PontoDeInteresse pin={pin}></PontoDeInteresse>
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
        ) : (
          <Text>Loading...</Text>
        )}
        <Text style={[styles.textTitulo, {color: textColor}]}>Sugestões</Text>
        <ScrollView>
          {trailsState.trails.map((trail: Trail, index: number) => (
            <View key={index}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('TrailDetail', {trail: trail})
                }>
                <SugestedTrail trail={trail}></SugestedTrail>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
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
    marginBottom: 10,
  },
  scrollViewPop: {
    flexDirection: 'row',
  },
});
