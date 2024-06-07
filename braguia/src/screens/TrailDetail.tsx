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
import {Media, Pin, Trail} from '../model/model';

import {fetchTrails} from '../redux/actions';
import {AppDispatch, RootState} from '../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import Sound from 'react-native-sound';

import GoBack from './../assets/goBack.svg';
import {Q} from '@nozbe/watermelondb';
import database from '../model/database';

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
  const trailsState = useSelector((state: RootState) => state.trails);
  // Dar audio
  useEffect(() => {
    Sound.setCategory('Playback');
  }, []);
  console.log('MEDIAS');
  console.log(trailsState.medias);
  console.log('EDGES');
  console.log(trailsState.edges);
  console.log('PINS');
  console.log(trailsState.pins);
  const playSound = (ficheiro: string) => {
    const sound = new Sound(ficheiro, undefined, error => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      // Play the sound
      sound.play(success => {
        if (success) {
          console.log('Tocar áudio');
        } else {
          console.log('Erro ao tocar o áudio...');
        }
      });
    });
  };

  // Ir buscar toda a Media de um Trail
  async function getMediaFromTrail(trailId: number): Promise<Media[]> {
    try {
      // Query pins table to get all pins with trail_id equal to trailId
      const pins = await database.collections.get<Pin>('edges').query().fetch();
      console.log(pins);

      // Extract pin IDs from pins
      const pinIds = pins.map(pin => pin.id);

      // Query media table to get all media associated with the retrieved pins
      const media = await database.collections
        .get<Media>('media')
        .query(Q.where('pin_id', Q.oneOf(pinIds)))
        .fetch();

      return media;
    } catch (error) {
      console.error('Error fetching media from trail:', error);
      return [];
    }
  }

  const [media, setMedia] = useState<Media[]>([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        console.log(trail.trailId);
        const mediaData = await getMediaFromTrail(trail.trailId); // Assuming trail object has an 'id' property
        setMedia(mediaData);
      } catch (error) {
        console.error('Error fetching media:', error);
      }
    };

    fetchMedia();
  }, [trail.id]);

  //console.log(media);
  return (
    <ScrollView>
      <View style={{backgroundColor: isDarkMode ? '#161716' : 'white'}}>
        <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
          <GoBack style={styles.botaoTopo} />
        </TouchableOpacity>
        <Text>{trailsState.edges[0].edgeDesc}</Text>
        {media.map((mediaItem, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => playSound(mediaItem.mediaFile)}>
            <Text>{mediaItem.mediaType}</Text>
            {/* Example: Display media file path */}
          </TouchableOpacity>
        ))}
        <Text>{trail.trailName}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  botaoTopo: {
    marginTop: 10,
  },
});

export default TrailDetail;
