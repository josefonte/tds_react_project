import React, {useEffect, useRef, useState} from 'react';
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
import {Linking} from 'react-native';
import {aViajar} from './../redux/actions';

// SVG
import GoBack from './../assets/goBack.svg';
import StartButton from './../assets/startButton.svg';

// COMPONENTES
import MapScreen from '../components/mapScreen';

const PontoDeInteresseDetail = ({
  route,
}: {
  route: RouteProp<
    {PontoDeInteresseDetail: {pin: Pin}},
    'PontoDeInteresseDetail'
  >;
}) => {
  console.log('Entrei num ponto específico');
  const {pin} = route.params;
  const isDarkMode = useColorScheme() === 'dark';
  const textColor = isDarkMode ? '#FEFAE0' : 'black';
  const navigation = useNavigation();
  const trailsState = useSelector((state: RootState) => state.trails);
  const dispatch = useDispatch();

  // Abrir Maps
  const navigateToLocation = (latitude: number, longitude: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    dispatch(aViajar());
    Linking.openURL(url);
  };

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
  async function getMediaFromPin(pinId: number): Promise<Media[]> {
    try {
      const media: Media[] = Array.from(
        trailsState.medias.filter(
          (media: {pin: number}) => pinId === media.pin,
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

  const [media, setMedia] = useState<Media[]>([]);

  const prevPinIdRef = useRef<number | null>(null); // Ref to store the previous pin id

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const mediaData = await getMediaFromPin(pin.pinId);
        setMedia(mediaData);
      } catch (error) {
        console.error('Error fetching media:', error);
      }
    };

    // Check if pin id has changed before fetching media
    if (pin.pinId !== prevPinIdRef.current) {
      fetchMedia();
      prevPinIdRef.current = pin.pinId; // Update the previous pin id
    }
  }, [pin.pinId]);

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

          {trailsState.viajar === false ? (
            <TouchableOpacity
              style={styles.botaoComecar}
              onPress={() => navigateToLocation(pin.pinLat, pin.pinLng)}>
              <StartButton />
            </TouchableOpacity>
          ) : // Alternative component or null if the condition is not met
          null}
        </View>
        <Text style={[styles.textTitulo, {color: textColor}]}>
          {pin.pinName}
        </Text>
        <Text
          style={[
            styles.textSimple,
            {color: textColor, fontSize: 13, marginBottom: 20},
          ]}>
          Braga, Braga
        </Text>
        <Text style={[styles.textSimple, {color: textColor}]}>
          {pin.pinDesc}
        </Text>
        <Text style={[styles.textTitulo, {color: textColor, fontSize: 22}]}>
          Outros Pontos de Interesse
        </Text>
      </View>

      <View style={[styles.containerMapa]}>
        <MapScreen localizacoes={[[pin.pinLat, pin.pinLng]]} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerMapa: {
    marginTop: 20,
    height: 700,
  },
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

export default PontoDeInteresseDetail;
