import React, {useState} from 'react';
import {SearchBar} from '@rneui/themed';
import {View, Text, StyleSheet, ViewStyle, Image} from 'react-native';
import {Trail} from '../model/model';
import LinearGradient from 'react-native-linear-gradient';

import TrailInfo from './../assets/trailInfo';
interface PopularTrailProps {
  trail: Trail;
}

const PopularTrail: React.FunctionComponent<PopularTrailProps> = ({trail}) => {
  console.log('Carreguei imagem popular');
  return (
    <View style={[styles.view]}>
      <View>
        <Image source={{uri: trail.trailImg}} style={styles.popular} />
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
              {trail.trailDuration}
            </Text>
            <Text style={[styles.textoPop2, {marginLeft: 130}]}>
              {trail.trailDuration}
            </Text>
            <Text style={[styles.textoPop2, {marginLeft: 170}]}>
              {trail.trailDuration}
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
  popular: {
    width: 300,
    height: 300,
    borderRadius: 8,
  },
  view: {
    marginLeft: 10,
    marginBottom: 20,
  },
  gradient: {
    position: 'absolute',
    height: 300,
    width: 300,
    borderRadius: 8,
  },
});

export default PopularTrail;
