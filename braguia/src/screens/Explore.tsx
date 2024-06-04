import SearchComponent from '../components/searchbar';
import FiltroIcon from '../components/filtroIcon';
import React, {useEffect, useState} from 'react';
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
import {fetchDataAndInsertIntoDB} from './../model/teste';
import {Trail} from './../model/model';
import database from './../model/database';

import {fetchTrails} from './../redux/actions';
import {RootState} from './../redux/store';
import {useDispatch, useSelector} from 'react-redux';

export default function Explore() {
  const isDarkMode = useColorScheme() === 'dark';
  const textColor = isDarkMode ? '#FEFAE0' : 'black';

  const trailsState = useSelector((state: RootState) => state.trails);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTrails());
  }, [dispatch]);

  const [trails, setTrails] = useState<Trail[]>([]);

  const fetchTrails = async () => {
    try {
      // Query the database for trails data
      const fetchedTrails = await database.collections
        .get<Trail>('trails')
        .query()
        .fetch();
      // Set the fetched trails data to state
      setTrails(fetchedTrails);
    } catch (error) {
      console.error('Error fetching trails:', error);
    }
  };

  useEffect(() => {
    fetchDataAndInsertIntoDB().then(fetchTrails);
  }, []);

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
      <ScrollView>
        {/* Display the fetched trails data */}
        {trails.map((trail, index) => (
          <View key={index}>
            <Text>oi</Text>
            <Text>oi</Text>
            <Text>oi</Text>
            <Text>{trail.trailId}</Text>
            <Text>{trail.trailName}</Text>
            <Text>{trail.trailDesc}</Text>
            {/* Display other trail properties as needed */}
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
