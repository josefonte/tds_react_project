import React, {useEffect, useState} from 'react';
import {SearchBar} from '@rneui/themed';
import {View, Text, StyleSheet, ViewStyle, Image} from 'react-native';
import {Pin, Trail} from '../model/model';
import LinearGradient from 'react-native-linear-gradient';

import TrailInfo from './../assets/trailInfo';
import database from '../model/database';
import {Q} from '@nozbe/watermelondb';
interface PopularTrailProps {
  trail: Trail;
}

const PopularTrail: React.FunctionComponent<PopularTrailProps> = ({trail}) => {
  console.log('Carreguei imagem sugerida');

  const changeDifficulty = (dificuldade: string) => {
    if (dificuldade === 'E') {
      return 'Fácil';
    }
    if (dificuldade === 'D') {
      return 'Fácil';
    }
    if (dificuldade === 'C') {
      return 'Médio';
    }
    if (dificuldade === 'B') {
      return 'Difícil';
    }
    if (dificuldade === 'A') {
      return 'Mt. Difícil';
    }
  };

  const [numerodePins, setNumeroPins] = useState(0);
  const [distancia, setDistancia] = useState(0);

  const getPinsFromTrail = async (): Promise<void> => {
    try {
      const pinCollection = database.collections.get<Pin>('pins');

      const pins = await pinCollection
        .query(Q.where('pin_trail', trail.trailId))
        .fetch();

      const listaIds: number[] = [];
      const uniquePins = pins.filter(pin => {
        if (listaIds.includes(pin.pinId)) {
          return false;
        } else {
          listaIds.push(pin.pinId);
          return true;
        }
      });

      setNumeroPins(uniquePins.length);
    } catch (error) {
      console.error('Error fetching pins from trail:', error);
    }
  };

  const getDistanceFromTrail = async (): Promise<void> => {
    try {
      const pinCollection = database.collections.get<Pin>('pins');
      const pins = await pinCollection
        .query(Q.where('pin_trail', trail.trailId))
        .fetch();
      const listaIds: number[] = [];
      const uniquePins = pins.filter(pin => {
        if (listaIds.includes(pin.pinId)) {
          return false;
        } else {
          listaIds.push(pin.pinId);
          return true;
        }
      });

      // Calculate total distance between pins
      let totalDistance = 0;
      for (let i = 0; i < uniquePins.length - 1; i++) {
        const pin1 = uniquePins[i];
        const pin2 = uniquePins[i + 1];
        const distance = calculateDistance(
          pin1.pinLat,
          pin1.pinLng,
          pin2.pinLat,
          pin2.pinLng,
        );
        totalDistance += distance;
      }

      setDistancia(parseFloat(totalDistance.toFixed(2)));
    } catch (error) {
      console.error('Error fetching pins from trail:', error);
    }
  };

  // Function to calculate distance between two points using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getPinsFromTrail();
        await getDistanceFromTrail();
      } catch (error) {
        console.error('Error fetching pins:', error);
        // Handle error if needed
      }
    };

    fetchData(); // Call fetchData when the component mounts
  }, []);

  return (
    <View style={[styles.view]}>
      <View>
        <Image source={{uri: trail.trailImg}} style={styles.sugest} />
        <LinearGradient
          colors={['#00000000', '#000000']}
          style={styles.gradient}
        />
        <View style={[styles.viewTextoPop]}>
          <Text style={[styles.textoPop]}>{trail.trailName}</Text>
          <View style={styles.trailInfoContainer}>
            <Text style={[styles.textoPop2, {marginLeft: 30}]}>
              {trail.trailDuration}
            </Text>
            <Text style={[styles.textoPop2, {marginLeft: 85}]}>
              {distancia}
            </Text>

            <Text style={[styles.textoPop2, {marginLeft: 135}]}>
              {numerodePins}
            </Text>
            <Text style={[styles.textoPop2, {marginLeft: 170}]}>
              {changeDifficulty(trail.trailDifficulty)}
            </Text>

            <TrailInfo height={18} width={200} marginTop={10} marginLeft={10} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewTextoPop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    padding: 10,
    marginBottom: 10,
  },
  textoPop: {
    fontSize: 20,
    marginLeft: 10,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: '#FEFAE0',
  },
  trailInfoContainer: {
    flexDirection: 'row', // To ensure the text and TrailInfo SVG are aligned horizontally
  },
  textoPop2: {
    position: 'absolute',
    fontSize: 12,
    color: 'black',
    marginTop: 10,
    fontWeight: 'bold',
    zIndex: 1, // Ensure the text appears on top of the SVG
  },
  sugest: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  view: {
    marginBottom: 20,
  },
  gradient: {
    position: 'absolute',
    height: 150,
    width: '100%',
    borderRadius: 8,
  },
});

export default PopularTrail;
