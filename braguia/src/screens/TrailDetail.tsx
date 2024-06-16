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
  Linking,
  Dimensions,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import RNFetchBlob from 'rn-fetch-blob';
import {downloadFile, getDownloadPermissionAndroid} from './../auxFuncs/index';

import {Media, Pin, Trail} from '../model/model';

import GoBack from '../assets/goBack.svg';

import {
  acabeiViajar,
  addFavoriteUser,
  addHistorico,
  addHistoricoUser,
  removeFavoriteUser,
} from '../redux/actions';
import {AppDispatch, RootState} from '../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import Sound from 'react-native-sound';
import Video, {VideoRef} from 'react-native-video';
import {Q} from '@nozbe/watermelondb';
import database from '../model/database';
// SVG
import StartButton from '../assets/startButton.svg';
import EndButton from '../assets/acabarButton.svg';

// COMPONENTES
import MapScreen from '../components/mapScreen';
import {darkModeTheme, lightModeTheme} from '../utils/themes';
import { ScreenWidth } from '@rneui/themed/dist/config';

const TrailDetail = ({
  route,
}: {
  route: RouteProp<{TrailDetail: {trail: Trail}}, 'TrailDetail'>;
}) => {
  console.log('Entrei num trail específico');
  const {trail} = route.params;
  const isDarkMode = useColorScheme() === 'dark';

  const theme = useColorScheme() === 'dark' ? darkModeTheme : lightModeTheme;

  const backgroundColor = theme.background_color;
  const titleColor = theme.text;
  const textColor = theme.text2;
  const colorDiviver = theme.color8;
  const redButtonText = theme.redButtontitle;
  const redButtonPressed = theme.redButtonPressed;
  const redButton = theme.redButton;

  const navigation = useNavigation();
  const trailsState = useSelector((state: RootState) => state.trails);
  const dispatch = useDispatch();

  const [favoriteButton, setFavoriteButton] = useState<boolean>(false);

  const clickFavorite = () => {
    !favoriteButton ? addFavoriteUser(trail) : removeFavoriteUser(trail);
    setFavoriteButton(!favoriteButton);
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
  async function getMediaFromTrail(trailId: number): Promise<Media[]> {
    try {
      // Fetch pins from the database that belong to the specified trail
      const pinCollection = database.collections.get<Pin>('pins');
      const pins = await pinCollection
        .query(Q.where('pin_trail', trailId))
        .fetch();

      const pinIds = Array.from(new Set(pins.map(pin => pin.pinId)));

      // Fetch media from the database that belong to the pins of the specified trail
      const mediaCollection = database.collections.get<Media>('media');
      const media = await mediaCollection
        .query(Q.where('media_pin', Q.oneOf(pinIds)))
        .fetch();

      const mediaIds = new Set(media.map(m => m.mediaId));

      // Filter out unique media items
      const uniqueMedia = media.filter((m: {mediaId: number}) => {
        if (mediaIds.has(m.mediaId)) {
          mediaIds.delete(m.mediaId);
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

  async function getPinsFromTrail(trailId: number): Promise<Pin[]> {
    try {
      const pinCollection = database.collections.get<Pin>('pins');
      const pins = await pinCollection
        .query(Q.where('pin_trail', trailId))
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

      return uniquePins;
    } catch (error) {
      console.error('Error fetching pins from trail:', error);
      return [];
    }
  }

  const [media, setMedia] = useState<Media[]>([]);
  const [pins, setPins] = useState<Pin[]>([]);
  const [locs, setLocs] = useState<[number, number][]>([]);
  const [flag, setFlag] = useState<number>(0);
  const [flag2, setFlag2] = useState<number>(0);
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const mediaData = await getMediaFromTrail(trail.trailId);
        setMedia(mediaData);
        const pinsData = await getPinsFromTrail(trail.trailId);
        await setPins(pinsData);
        await setLocs(pinsData.map(pin => [pin.pinLat, pin.pinLng]));
        console.log(pinsData);
      } catch (error) {
        console.error('Error fetching media:', error);
      }
    };

    fetchMedia();
  }, [trail.id]);

  useEffect(() => {
    console.log(pins);
    if (pins.length > 0) {
      setFlag2(1);
    }
  }, [pins]);

  useEffect(() => {
    console.log(locs);
    if (locs.length > 0) {
      setFlag(1);
    }
  }, [locs]);

  // GOOGLE MAPS
  const openGoogleMapsDirections = (locations: [number, number][]) => {
    const destinationString = locations
      .map(([latitude, longitude]) => `${latitude},${longitude}`)
      .join('/');
    const url = `https://www.google.com/maps/dir/${destinationString}`;

    addHistoricoUser(trail)
      .then(() => {
        console.log('Adicionado ao historico | trailId : ', trail.trailId);
      })
      .catch(error => {
        throw error;
      });

    console.log(url);
    Linking.openURL(url).catch(err =>
      console.error('Error opening Google Maps:', err),
    );
  };

  const [numerodePins, setNumeroPins] = useState(0);
  const [distancia, setDistancia] = useState(0);

  const getPinsFromTrail2 = async (): Promise<void> => {
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
        await getPinsFromTrail2();
        await getDistanceFromTrail();
      } catch (error) {
        console.error('Error fetching pins:', error);
        // Handle error if needed
      }
    };

    fetchData(); // Call fetchData when the component mounts
  }, []);

  
//------------------- Download ---------------------------- 

const requestStoragePermission = async () => {
  try{
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Permissão para download',
        message: 'O BraGuia precisa de permissão para realizar o Download.',
        buttonNeutral: 'Pergunte-me depois',
        buttonNegative: 'Cancelar',
        buttonPositive: 'OK',
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Storage permission granted');
      return true;
    } else {
      console.log('Storage permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
};

  const downloadFile =async(fileUrl) => {
    const granted = await requestStoragePermission();
    if(!granted) return;
    
    console.log(`Iniciando download do arquivo: ${fileUrl}`);
    const { dirs } = RNFetchBlob.fs;
    const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const fileName = fileUrl.split('/').pop();
    
    const configfb = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: fileName,
        path: `${dirToSave}/${fileName}`,
        mime: 'application/octet-stream', // Fallback MIME type
        description: 'Downloading file.'
      },
      path: `${dirToSave}/${fileName}`,
      mime: 'application/octet-stream'
    };

    const configOptions = Platform.select({
      ios: configfb,
      android: configfb,
    });

    RNFetchBlob.config(configOptions || {})
      .fetch('GET', fileUrl, {})
      .then(res => {
        console.log('Download concluído');
        if (Platform.OS === 'ios') {
          RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
          RNFetchBlob.ios.previewDocument(configfb.path);
        }
        if (Platform.OS === 'android') {
          console.log("Arquivo baixado");
        }
      })
      .catch(e => {
        console.log('Falha no download', e);
      });

  }




  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#161716' : 'white' }]}>
      <ScrollView>
        <View>
        <View style={{ backgroundColor: isDarkMode ? '#161716' : 'white' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <TouchableOpacity style={styles.botaoTopo} onPress={() => navigation.goBack()}>
              <GoBack />
            </TouchableOpacity>
          </View>
  
          <ScrollView horizontal={true} style={styles.scrollViewPop}>
            {media.length === 0 ? (
              <View style={[styles.emptyImagens]}></View>
            ) : (
              media.map((mediaItem, index) => (
                <View key={index} style={{ flexDirection: 'column', alignItems: 'center'}}>
                  {mediaItem.mediaType === 'R' ? (
                    <TouchableOpacity onPress={() => playSound(mediaItem.mediaFile)}>
                      <View style={styles.audioRolo}>
                        <Text style={styles.audioText}>Audio</Text>
                        <Text style={styles.audioText}>Premium Only</Text>
                      </View>
                    </TouchableOpacity>
                  ) : mediaItem.mediaType === 'I' ? (
                    <Image
                      source={{ uri: mediaItem.mediaFile }}
                      style={styles.imagemRolo}
                      />
                  ) : mediaItem.mediaType === 'V' ? (
                    <Video
                    source={{ uri: mediaItem.mediaFile }}
                      style={styles.videoRolo}
                      controls={true}
                    />
                  ) : (
                    <View>
                      <Text onPress={() => playSound(mediaItem.mediaFile)}>
                        Unknown media type
                      </Text>
                    </View>
                  )}
                  <View style={styles.botaoDownload}>
                    <TouchableOpacity onPress={() => downloadFile(mediaItem.mediaFile)} >
                      <View
                        style={{
                          backgroundColor: backgroundColor,
                          borderColor: colorDiviver,
                          borderWidth: 2,
                          height: 50,
                          width: 50,
                          alignItems: 'center',
                          borderRadius: 100,
                          justifyContent: 'center',
                        }}>
                        <Feather
                          name={'download'}
                          size={25}
                          color={colorDiviver}
                          style={{ paddingHorizontal: 10 }}
                          />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
            

            <View style={styles.botaoComecar}>
              <TouchableOpacity onPress={clickFavorite}>
                <View
                  style={{
                    backgroundColor: favoriteButton
                      ? titleColor
                      : backgroundColor,
                    borderColor: favoriteButton ? titleColor : colorDiviver,
                    borderWidth: 2,
                    height: 50,
                    width: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 100,
                  }}>
                  <Feather
                    name={'heart'}
                    size={25}
                    color={favoriteButton ? backgroundColor : colorDiviver}
                    style={{paddingHorizontal: 10}}
                  />
                </View>
              </TouchableOpacity>
              {trailsState.viajar === false ? (
                flag === 0 ? (
                  <TouchableOpacity>
                    <StartButton />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => openGoogleMapsDirections(locs)}>
                    <StartButton />
                  </TouchableOpacity>
                )
              ) : (
                <TouchableOpacity onPress={() => dispatch(acabeiViajar())}>
                  <EndButton />
                </TouchableOpacity>
              )}
            </View>
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
          <Text
            style={[
              styles.textTitulo,
              {color: textColor, fontSize: 22, marginBottom: 10},
            ]}>
            Informação Geral
          </Text>
          <View style={styles.gridContainer}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>Comprimento do Roteiro</Text>
              <Text style={styles.itemValue}>{distancia}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>Tempo Médio</Text>
              <Text style={styles.itemValue}>{trail.trailDuration}</Text>
            </View>
          </View>

          <View style={styles.gridContainer}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>Pontos de Interesse</Text>
              <Text style={styles.itemValue}>{numerodePins}</Text>
            </View>
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>Tipo de Roteiro</Text>
              <Text style={styles.itemValue}>oi</Text>
            </View>
          </View>

          <Text
            style={[
              styles.textTitulo,
              {color: textColor, fontSize: 22, marginBottom: 10},
            ]}>
            Pontos de Interesse
          </Text>
          <View style={[styles.horizontalLine, styles.pinspins]} />
          <View style={[styles.pinspins]}>
            {flag2 === 0 ? (
              <Text>Loading...</Text>
            ) : (
              pins.map((pin, index) => (
                <View key={index}>
                  <TouchableOpacity
                    key={index}
                    onPress={() =>
                      navigation.navigate('PontoDeInteresseDetail', {
                        pin: pin,
                      })
                    }
                    style={[styles.itemPontoInteresse]}>
                    <Text key={index}>{pin.pinName}</Text>
                  </TouchableOpacity>
                  <View style={styles.horizontalLine} />
                </View>
              ))
            )}
          </View>
          <Text
            style={[
              styles.textTitulo,
              {color: textColor, fontSize: 22, marginBottom: 10},
            ]}>
            Mapa
          </Text>
        </View>

        {flag === 0 ? (
          <Text>Loading...</Text>
        ) : (
          <View style={[styles.containerMapa]}>
            <MapScreen localizacoes={locs} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemContainer: {
    width: '45%', // Adjust width as needed
    marginBottom: 10,
    borderWidth: 0,
    borderColor: 'black',
    padding: 10,
  },
  itemText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemValue: {
    textAlign: 'center',
    fontSize: 16,
  },
  horizontalLine: {
    height: 1,
    width: '100%',
    backgroundColor: 'black',
    marginVertical: 10,
  },
  linha: {
    width: 50,
  },
  itemPontoInteresse: {
    marginTop: 4,
  },
  pinspins: {
    marginLeft: 20,
  },
  containerMapa: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    position: 'absolute',
    bottom: -20,
    right: 20,
    zIndex: 2,
  },
  botaoTopo: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 2,
  },
  botaoDownload: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    padding: 10,
  },
  scrollViewPop: {
    flexDirection: 'row',
    zIndex: 1,
  },
  imagemRolo: {
    height: 225,
    width: ScreenWidth,
  },
  videoRolo: {
    height: 225,
    width: ScreenWidth,
  },
  audioRolo: {
    height: 225,
    width: ScreenWidth,
    backgroundColor: 'grey',
  },
  audioText: {
    fontSize: 20,
    fontFamily: 'Roboto',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 30,
  },
  downloadButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 2,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 10,
  },
});

export default TrailDetail;
