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
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {Media, Pin, Trail} from '../model/model';

import {fetchTrails} from '../redux/actions';
import {AppDispatch, RootState} from '../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import Sound from 'react-native-sound';
import Video, {VideoRef} from 'react-native-video';
import {Q} from '@nozbe/watermelondb';
import database from '../model/database';

// SVG
import GoBack from './../assets/goBack.svg';
import StartButton from './../assets/startButton.svg';

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

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Audio Permission',
          message: 'This app needs access to your microphone to play audio.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the audio functionality');
      } else {
        console.log('Audio permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const playSound = async (ficheiro: string) => {
    requestCameraPermission();

    const sound = new Sound(ficheiro, undefined, error => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
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
      const pins: Pin[] = trailsState.pins.filter(
        (pin: {trail: number}) => pin.trail === trailId,
      );
      const pinIds = Array.from(new Set(pins.map(pin => pin.pinId)));

      const media: Media[] = Array.from(
        trailsState.medias.filter((media: {pin: number}) =>
          pinIds.includes(media.pin),
        ),
      );
      const mediaIds = new Set(media.map(media => media.mediaId));

      const uniqueMedia = media.filter((media: {mediaId: number}) => {
        if (mediaIds.has(media.mediaId)) {
          mediaIds.delete(media.mediaId);
          return true;
        } else {
          return false;
        }
      });
      console.log(uniqueMedia);
      return uniqueMedia;
    } catch (error) {
      console.error('Error fetching media from trail:', error);
      return [];
    }
  }

  async function getPinsFromTrail(trailId: number): Promise<Media[]> {
    try {
      const listaIds: number[] = [];
      const pins: Pin[] = trailsState.pins.filter(
        (pin: {trail: number; pinId: number}) => {
          if (pin.trail === trailId) {
            if (listaIds.includes(pin.pinId)) {
              return false;
            } else {
              listaIds.push(pin.pinId);
              return true;
            }
          } else {
            return false;
          }
        },
      );
      return pins;
    } catch (error) {
      console.error('Error fetching pins from trail:', error);
      return [];
    }
  }

  const [media, setMedia] = useState<Media[]>([]);
  const [pins, setPins] = useState<Pin[]>([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const mediaData = await getMediaFromTrail(trail.trailId);
        setMedia(mediaData);
        const pinsData = await getPinsFromTrail(trail.trailId);
        setPins(pinsData);
        console.log(pinsData);
      } catch (error) {
        console.error('Error fetching media:', error);
      }
    };

    fetchMedia();
  }, [trail.id]);

  //console.log(media);
  return (
    <ScrollView>
      <View
        style={{
          backgroundColor: isDarkMode ? '#161716' : 'white',
        }}>
        <View>
          <TouchableOpacity
            style={styles.botaoTopo}
            onPress={() => navigation.navigate('Explore')}>
            <GoBack />
          </TouchableOpacity>
          <ScrollView horizontal={true} style={styles.scrollViewPop}>
            {media.map((mediaItem, index) => (
              <React.Fragment key={index}>
                {mediaItem.mediaType === 'R' ? (
                  <TouchableOpacity
                    onPress={() => playSound(mediaItem.mediaFile)}>
                    <View style={styles.audioRolo}>
                      <Text style={styles.audioText}>Audio</Text>
                      <Text style={styles.audioText}>Premium Only</Text>
                    </View>
                  </TouchableOpacity>
                ) : mediaItem.mediaType === 'I' ? (
                  <View>
                    <Image
                      source={{uri: mediaItem.mediaFile}}
                      style={styles.imagemRolo}
                    />
                  </View>
                ) : mediaItem.mediaType === 'V' ? (
                  <View>
                    <Video
                      source={{uri: mediaItem.mediaFile}}
                      style={styles.videoRolo}
                      controls={true}
                    />
                  </View>
                ) : (
                  <View>
                    <Text onPress={() => playSound(mediaItem.mediaFile)}>
                      Unknown media type
                    </Text>
                  </View>
                )}
              </React.Fragment>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.botaoComecar}>
            <StartButton />
          </TouchableOpacity>
        </View>
        <Text style={[styles.textTitulo, {color: textColor}]}>
          {trail.trailName}
        </Text>
        <Text
          style={[
            styles.textSimple,
            {color: textColor, fontSize: 13, marginBottom: 20},
          ]}>
          Braga, Braga
        </Text>
        <Text style={[styles.textSimple, {color: textColor}]}>
          {trail.trailDesc}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textSimple: {
    marginLeft: 10,
    fontFamily: 'Roboto',
    fontSize: 16,
  },
  textTitulo: {
    marginTop: 20,
    marginLeft: 10,
    fontSize: 28,
    fontFamily: 'Roboto',
    lineHeight: 32,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
  botaoComecar: {
    position: 'absolute',
    bottom: -20,
    right: 20,
    alignItems: 'flex-end',
    zIndex: 2,
  },
  botaoTopo: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 2,
  },
  scrollViewPop: {
    flexDirection: 'row',
    zIndex: 1,
  },
  imagemRolo: {
    height: 190,
    width: 395,
  },
  videoRolo: {
    height: 190,
    width: 395,
  },
  audioRolo: {
    height: 190,
    width: 395,
    backgroundColor: 'grey',
  },
  audioText: {
    fontSize: 20,
    fontFamily: 'Roboto',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 30,
  },
});

export default TrailDetail;
