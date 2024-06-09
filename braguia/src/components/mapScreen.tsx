import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

interface MapProps {
  localizacoes: [number, number][];
}

const MapScreen: React.FunctionComponent<MapProps> = ({localizacoes}) => {
  if (!localizacoes) {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 41.5595, // Latitude da Universidade do Minho
            longitude: -8.396, // Longitude da Universidade do Minho
            latitudeDelta: 0.91,
            longitudeDelta: 0.91,
          }}></MapView>
      </View>
    );
  } else if (localizacoes.length == 1) {
    return (
      <View style={styles.container2}>
        <MapView
          style={styles.map2}
          initialRegion={{
            latitude: localizacoes[0][0],
            longitude: localizacoes[0][1],
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          <Marker
            coordinate={{
              latitude: localizacoes[0][0],
              longitude: localizacoes[0][1],
            }}
          />
        </MapView>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: localizacoes[0][0],
            longitude: localizacoes[0][1],
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}>
          {localizacoes.map(([latitude, longitude], index) => (
            <MapView.Marker key={index} coordinate={{latitude, longitude}} />
          ))}
        </MapView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  container2: {
    height: '30%',
    width: '100%',
    justifyContent: 'center',
    borderRadius: 20,
  },
  map2: {
    flex: 1,
    borderRadius: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;
