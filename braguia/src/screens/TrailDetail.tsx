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
import {Trail} from '../model/model';

import {fetchTrails} from '../redux/actions';
import {AppDispatch, RootState} from '../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {useAppSelector, useAppDispatch} from '../redux/hooks';

interface ExploreProps {
  trail: Trail;
}

export default function Explore() {
  const isDarkMode = useColorScheme() === 'dark';
  const textColor = isDarkMode ? '#FEFAE0' : 'black';
  const navigation = useNavigation();

  const trailsState = useSelector((state: RootState) => state.trails);

  return (
    <ScrollView>
      <View style={{backgroundColor: isDarkMode ? '#161716' : 'white'}}>
        <Text>oi</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
