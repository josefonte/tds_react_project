import React, {useEffect, useState} from 'react';
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
  const textColor = isDarkMode ? '#FEFAE0' : 'black';
  const trailsState = useSelector((state: RootState) => state.trails);
  const navigation = useNavigation();

  const fetchTrailById = async (trailId: number): Promise<Trail> => {
    try {
      const trailCollection = database.collections.get<Trail>('trails'); // Get the collection for trails
      const trail = await trailCollection
        .query(Q.where('trail_id', trailId)) // Assuming 'trailId' is the correct field name
        .fetch();

      return trail[0]; // Assuming trailId is unique, so we return the first (and only) item in the array
    } catch (error) {
      throw new Error('Failed to fetch traill');
    }
  };

  const [trailData, setTrailData] = useState<Trail[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trailCollection = database.collections.get<Trail>('trails'); // Get the collection for trails
        const traill = await trailCollection
          .query(Q.where('trail_id', Q.oneOf(trailsState.historico)))
          .fetch();
        setTrailData(traill);
      } catch (error) {
        console.error('Error fetching trails:', error);
      }
    };

    fetchData();
  }, [trailsState.historico]);

  return (
    <View>
      <ScrollView>
        <View
          style={{flex: 1, backgroundColor: isDarkMode ? '#161716' : 'white'}}>
          <Text style={[styles.textTitulo, {color: textColor}]}>
            Histórico Trilhos
          </Text>
          {trailData.map((trail: Trail, index: number) => (
            <View key={index}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('TrailDetail', {trail: trail})
                }>
                <SugestedTrail trail={trail}></SugestedTrail>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  textTitulo: {
    marginLeft: 10,
    fontSize: 26,
    fontFamily: 'Roboto',
    lineHeight: 32,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    marginBottom: 20,
  },
});
