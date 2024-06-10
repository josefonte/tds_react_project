import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  useColorScheme,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import SugestedTrail from '../components/SugestedTrail';
import database from '../model/database';
import {Q} from '@nozbe/watermelondb';
import {Trail} from '../model/model';
import {useNavigation} from '@react-navigation/native';

export default function Favorites() {
  const isDarkMode = useColorScheme() === 'dark';
  const trailsState = useSelector((state: RootState) => state.trails);
  const navigation = useNavigation();
  const fetchTrailById = async (trailId: number): Promise<Trail> => {
    try {
      const trailCollection = database.collections.get<Trail>('trails'); // Get the collection for trails
      const trail = await trailCollection
        .query(Q.where('trail_id', trailId)) // Assuming 'trailId' is the correct field name
        .fetch();
      console.log('HERE IS THE TRAIL');
      console.log(trail[0]);
      return trail[0]; // Assuming trailId is unique, so we return the first (and only) item in the array
    } catch (error) {
      throw new Error('Failed to fetch traill');
    }
  };

  return (
    <ScrollView>
      <View
        style={{flex: 1, backgroundColor: isDarkMode ? '#161716' : 'white'}}>
        <Text>Histórico Trilhos</Text>
        {trailsState.historico.map((traill: number, index: number) => (
          <View key={index}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('TrailDetail', {
                  trail: fetchTrailById(traill),
                })
              }>
              <SugestedTrail trail={fetchTrailById(traill)}></SugestedTrail>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
