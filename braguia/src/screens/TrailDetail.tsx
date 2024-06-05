import React, {useEffect, useState} from 'react';
import {RouteProp, useNavigation} from '@react-navigation/native';
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
import {Trail} from '../model/model';

import {fetchTrails} from '../redux/actions';
import {AppDispatch, RootState} from '../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import GoBack from './../assets/goBack.svg';

const TrailDetail = ({
  route,
}: {
  route: RouteProp<{TrailDetail: {trail: Trail}}, 'TrailDetail'>;
}) => {
  console.log('Entrei num trail específico');
  const {trail} = route.params;
  const isDarkMode = useColorScheme() === 'dark';
  const textColor = isDarkMode ? '#FEFAE0' : 'black';
  const navigation = useNavigation();

  // const trailsState = useSelector((state: RootState) => state.trails);

  return (
    <ScrollView>
      <View style={{backgroundColor: isDarkMode ? '#161716' : 'white'}}>
        <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
          <GoBack />
        </TouchableOpacity>
        <Text>{trail.trailName}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default TrailDetail;
