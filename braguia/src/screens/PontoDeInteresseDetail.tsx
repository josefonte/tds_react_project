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
import {Media, Pin, Trail} from '../model/model';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {fetchTrails} from '../redux/actions';
import {AppDispatch, RootState} from '../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import Sound from 'react-native-sound';
import Video, {VideoRef} from 'react-native-video';
import {Q} from '@nozbe/watermelondb';
import database from '../model/database';
import {aViajar, acabeiViajar} from './../redux/actions';

// SVG
import GoBack from '../assets/goBack.svg';
import StartButton from '../assets/startButton.svg';
import EndButton from '../assets/acabarButton.svg';

// COMPONENTES
import MapScreen from '../components/mapScreen';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import {darkModeTheme, lightModeTheme} from '../utils/themes';
import { ScreenHeight, ScreenWidth } from '@rneui/themed/dist/config';
import EncryptedStorage from 'react-native-encrypted-storage';
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

  const theme = useColorScheme() === 'dark' ? darkModeTheme : lightModeTheme;

  const backgroundColor = theme.background_color;
  const titleColor = theme.text;
  const textColor = theme.text2;
  const colorDiviver = theme.color8;
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

  async function getMediaFromPin(pinId: number): Promise<Media[]> {
    try {
      const mediaCollection = database.collections.get<Media>('media');
      const media = await mediaCollection
        .query(Q.where('media_pin', pinId))
        .fetch();

      const mediaIds = new Set(media.map(m => m.mediaId));

      const uniqueMedia = media.filter((m: {mediaId: number}) => {
        if (mediaIds.has(m.mediaId)) {
          mediaIds.delete(m.mediaId);
          return true;
        } else {
          return false;
        }
      });

      return uniqueMedia;
    } catch (error) {
      console.error('Error fetching media from database:', error);
      return [];
    }
  }

  const [media, setMedia] = useState<Media[]>([]);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const prevPinIdRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const mediaData = await getMediaFromPin(pin.pinId);
        
        const localMediaData = await Promise.all(
          mediaData.map(async (mediaItem) => {
            const downloadDir = RNFS.DownloadDirectoryPath;
            const filePath = `${downloadDir}/${mediaItem.mediaFile.split('/').pop()}`;
            console.log("O ficheiro se estiver downloaded está com este caminho:",filePath);
            const fileExists = await RNFS.exists(filePath);

            if (fileExists) {
              console.log("Entrei na condição se existe o ficheiro existe nos downloads");
              const updatedMediaItem = {...mediaItem, DownloadedMediaFile: `${filePath}`, mediaType: mediaItem.mediaType};
              return updatedMediaItem;
            }
            return mediaItem;
          })
        );

        console.log('Local media data:', localMediaData); // Log the local media data

        setMedia(localMediaData);
        
        const tipo = await EncryptedStorage.getItem('userType');
        if (tipo === "Premium"){
          console.log("[TIPO USER] SET PREMIUM");
          setIsPremium(true);
        }

      } catch (error) {
        console.error('Error fetching media:', error);
      }
    };

    if (pin.pinId !== prevPinIdRef.current) {
      fetchMedia();
      prevPinIdRef.current = pin.pinId;
    }
  }, [pin.pinId]);

  useEffect(() => {
    console.log("O estado media foi atualizado:", media);
    media.map((mediaItem) => {
      console.log("cccc", mediaItem.mediaType);
      console.log("aaaa", mediaItem.mediaFile);
      console.log("bbbb", mediaItem.DownloadedMediaFile);
    });

  }, [media]);


 
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

    try {
      const res = await RNFetchBlob.config(configOptions || {}).fetch('GET', fileUrl, {});
  
      console.log('Download concluído');
  
      let downloadedFilePath;

      if (Platform.OS === 'ios') {
        await RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
        downloadedFilePath = configfb.path;
        RNFetchBlob.ios.previewDocument(configfb.path);
      } else if (Platform.OS === 'android') {
        console.log('Arquivo baixado');
        downloadedFilePath = res.path(); // Obter o caminho do arquivo baixado no Android
      }

      console.log('Caminho do arquivo baixado:', downloadedFilePath);

    } catch (e) {
      console.log('Falha no download', e);
    }

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
            {media.length === 0 || isPremium === false ? (
              <View style={[styles.emptyImagens]}>
                <Text>Media for Premium Only</Text>
              </View>
            ) : (
              media.map((mediaItem, index) => (
                <View key={index} style={{ flexDirection: 'column', alignItems: 'center' }}>
                  {mediaItem.mediaType === 'R' ? (
                    <TouchableOpacity onPress={() => playSound(mediaItem.DownloadedMediaFile || mediaItem.mediaFile)}>
                      <View style={styles.audioRolo}>
                        <Text style={styles.audioText}>Áudio</Text>
                        <Text style={styles.audioText}>Apenas Premium</Text>
                        {mediaItem.DownloadedMediaFile && (
                          <Text style={styles.textSimple}>Arquivo baixado</Text>
                          )}
                      </View>
                    </TouchableOpacity>
                  ) : mediaItem.mediaType === 'I' ? (
                    <View>
                      <Image
                        source={{ uri: mediaItem.DownloadedMediaFile ? `file://${mediaItem.DownloadedMediaFile}` : mediaItem.mediaFile }}
                        style={styles.imagemRolo}
                      />
                      {mediaItem.DownloadedMediaFile && (
                        <Text style={styles.textSimple}>Arquivo baixado</Text>
                      )}
                    </View>
                  ) : mediaItem.mediaType === 'V' ? (
                    <View>
                      <Video
                        source={{ uri: mediaItem.DownloadedMediaFile || mediaItem.mediaFile }}
                        style={styles.videoRolo}
                        controls={true}
                      />
                      {mediaItem.DownloadedMediaFile && (
                        <Text style={styles.downloadedText}>Arquivo baixado</Text>
                      )}
                    </View>
                  ) : (
                    <View style={styles.imagemRolo}>
                      <Text onPress={() => playSound(mediaItem.mediaFile)}>
                        <Text style={styles.unknown}>
                          Tipo de mídia desconhecido
                        </Text>
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
  
          {trailsState.viajar === false ? (
            <TouchableOpacity
            style={styles.botaoComecar}
            onPress={() => navigateToLocation(pin.pinLat, pin.pinLng)}>
              <StartButton />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
            style={styles.botaoComecar}
            onPress={() => dispatch(acabeiViajar())}>
              <EndButton />
            </TouchableOpacity>
          )}
          </View>

          <Text style={[styles.textTitulo, { color: textColor }]}>
            {pin.pinName}
          </Text>
          <Text
            style={[
              styles.textSimple,
              { color: textColor, fontSize: 13, marginBottom: 20 },
            ]}>
            Braga, Braga
          </Text>
          <Text style={[styles.textSimple, { color: textColor }]}>
            {pin.pinDesc}
          </Text>
          <Text
            style={[
              styles.textTitulo,
              { color: textColor, fontSize: 22, marginBottom: 10 },
            ]}>
            Mapa
          </Text>
        </View>
  
        <View style={[styles.containerMapa]}>
          <MapScreen localizacoes={[[pin.pinLat, pin.pinLng]]} />
        </View>
      </ScrollView>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyImagens: {
    marginTop: 100,
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
  mediaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative', // Adicionado para permitir o posicionamento absoluto do botão de download
    marginVertical: 0,
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
  unknown:{
    fontFamily: 'Roboto',
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 50,
  },
});

export default PontoDeInteresseDetail;
