import React, {useEffect, useState} from 'react';
import {SearchBar} from '@rneui/themed';
import {View, Text, StyleSheet, ViewStyle, Image} from 'react-native';
import {Trail} from '../model/model';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
interface PontoDeInteresseProps {
  trail: Pin;
}

const PontoDeInteresse: React.FunctionComponent<PontoDeInteresseProps> = ({
  pin,
}) => {
  console.log('Carreguei ponto de interesse popular');
  const trailsState = useSelector((state: RootState) => state.trails);
  const [media, setMedia] = useState<Media[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const mediaData = await getMediaFromPin(pin.pinId);
      setMedia(mediaData);
    };

    if (pin.pinId !== null) {
      fetchData();
    }
  }, [pin.pinId]);

  function getMediaFromPin(pinId: number): Promise<Media[]> {
    try {
      const listaCheck: number[] = [];
      const media: Media[] = Array.from(
        trailsState.medias.filter((media: {pin: number}) => {
          if (media.pin === pinId) {
            if (listaCheck.includes(media.mediaId)) {
              return false;
            } else {
              listaCheck.push(media.mediaId);
              return true;
            }
          } else {
            return false;
          }
        }),
      );
      return media;
    } catch (error) {
      console.error('Error fetching media from trail:', error);
      return [];
    }
  }

  function checkImagemMedia(listaMedia: Media[]): string {
    if (listaMedia === []) return '';
    for (const media of listaMedia) {
      if (media.mediaType == 'I') {
        return media.mediaFile;
      }
    }
    return '';
  }

  const temMediaImagem = checkImagemMedia(media);
  if (temMediaImagem === '') return null;
  else {
    return (
      <View style={[styles.view]}>
        <View>
          <Image source={{uri: temMediaImagem}} style={styles.popular} />
          <LinearGradient
            colors={['#00000000', '#000000']}
            style={styles.gradient}
          />
          <View style={[styles.viewTextoPop]}>
            <Text style={[styles.textoPop]}>{pin.pinName}</Text>
          </View>
        </View>
      </View>
    );
  }
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
    marginBottom: 4,
  },
  textoPop: {
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: '#FEFAE0',
  },
  trailInfoContainer: {
    flexDirection: 'row', // To ensure the text and TrailInfo SVG are aligned horizontally
  },
  popular: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  view: {
    marginLeft: 10,
    marginBottom: 20,
  },
  gradient: {
    position: 'absolute',
    height: 100,
    width: 100,
    borderRadius: 8,
  },
});

export default PontoDeInteresse;
