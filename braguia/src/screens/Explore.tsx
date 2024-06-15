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
  Touchable,
} from 'react-native';

import {SearchBar} from '@rneui/themed';
import {Pin, Trail} from './../model/model';

import {fetchTrails} from './../redux/actions';
import {AppDispatch, RootState} from './../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {useAppSelector, useAppDispatch} from './../redux/hooks';
import database from '../model/database';
import {lightModeTheme, darkModeTheme} from '../utils/themes';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
// COMPONENTES
import FiltroIcon from './../components/filtroIcon';
import PopularTrail from './../components/PopularTrail';
import SugestedTrail from './../components/SugestedTrail';
import PontoDeInteresse from './../components/PontoDeInteresse';

export default function Explore() {
  const isDarkMode = useColorScheme() === 'dark';

  const theme = useColorScheme() === 'dark' ? darkModeTheme : lightModeTheme;

  const backgroundColor = theme.background_color;
  const textColor = theme.text;

  const navigation = useNavigation();
  const trailsState = useSelector((state: RootState) => state.trails);
  const useAppDispatch = useDispatch.withTypes<AppDispatch>();

  const [pins, setPins] = useState<Pin[]>([]);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [search, setSearch] = useState('');
  const [filterIconPressed, setFilterIconPressed] = useState<number[]>([]);

  const changeFilters = (filter: number) => {
    if (filterIconPressed.includes(filter)) {
      setFilterIconPressed(filterIconPressed.filter(f => f !== filter));
      console.log(
        'FILTROS',
        filterIconPressed.filter(f => f !== filter),
      );
    } else {
      setFilterIconPressed([...filterIconPressed, filter]);

      console.log('FILTROS', [...filterIconPressed, filter]);
    }
  };

  const updateSearch = (search: string) => {
    setSearch(search);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTrails = await database.collections
          .get<Trail>('trails')
          .query()
          .fetch();
        setTrails(fetchedTrails);

        const fetchedPins = await database.collections
          .get<Pin>('pins')
          .query()
          .fetch();
        setPins(fetchedPins);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        flex: 1,
        paddingHorizontal: '4%',
        paddingTop: '3%',
      }}>
      <View style={styles.containerTop}>
        <SearchBar
          placeholder="Pesquisar..."
          onChangeText={updateSearch}
          value={search}
          lightTheme={!isDarkMode}
          containerStyle={{
            borderRadius: 1000,
            width: '83%',
            height: 50,
            borderBlockColor: 'transparent',
            padding: 3,
            justifyContent: 'center',
          }}
          inputContainerStyle={{
            height: 40,
            width: '98%',
            borderRadius: 1000,
            marginLeft: 2.5,
          }}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Support')}>
          <View
            style={{
              backgroundColor: textColor,
              height: 50,
              width: 50,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 100,
            }}>
            <Feather
              name={'phone'}
              size={25}
              color={backgroundColor}
              style={{paddingHorizontal: 10}}
            />
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.scrollViewContent, {marginTop: 10}]}>
          {[
            {
              packageNAme: 'Ionicons',
              iconName: 'leaf-outline',
              filterName: 'Natureza',
            },
            {
              packageNAme: 'Ionicons',
              iconName: 'wine-outline',
              filterName: 'Bebida',
            },
            {
              packageNAme: 'MaterialIcons',
              iconName: 'drama-masks',
              filterName: 'Cultura',
            },
            {
              packageNAme: 'MaterialIcons',
              iconName: 'church',
              filterName: 'Religião',
            },
            {
              packageNAme: 'MaterialIcons',
              iconName: 'pot-steam-outline',
              filterName: 'Comida',
            },
          ].map((filter, index) => (
            <FiltroIcon
              key={index}
              packageNAme={filter.packageNAme}
              iconName={filter.iconName}
              filterName={filter.filterName}
              isActive={filterIconPressed.includes(index)}
              toggleFilter={() => changeFilters(index)}
            />
          ))}
        </ScrollView>

        <Text style={[styles.textTitulo, {color: textColor}]}>
          Roteiros Populares
        </Text>
        {trails && trails.length > 0 ? (
          <ScrollView horizontal={true} style={styles.scrollViewPop}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('TrailDetail', {
                  trail: trails[0],
                })
              }>
              <PopularTrail trail={trails[0]} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('TrailDetail', {
                  trail: trails[2],
                })
              }>
              <PopularTrail trail={trails[2]} />
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <Text>Loading...</Text>
        )}
        <Text style={[styles.textTitulo, {color: textColor}]}>
          Pontos de Interesse
        </Text>
        {pins && pins.length > 0 ? (
          <ScrollView horizontal={true} style={styles.scrollViewPop}>
            {pins
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
          {trails.map((trail: Trail, index: number) => (
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  imageSuporte: {
    height: 50,
    width: 50,
  },
  containerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  textTitulo: {
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
