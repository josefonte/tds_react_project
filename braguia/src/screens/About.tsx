import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  useColorScheme,
  TouchableOpacity,
  Linking,
  Pressable,
} from 'react-native';

import {fetchTrails, fetchApp} from '../redux/actions';
import database from '../model/database';
import {App, Partners, Socials} from '../model/model';
import {useAppDispatch} from '../redux/hooks';

const MAX_RETRY_COUNT = 5;
// Assets
import AppLogo from '../assets/logo.svg';
import FacebookLogo from './../assets/facebook.svg';
import UmLogo from '../assets/umlogo.svg';

// GEOFENCING
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import BackgroundTimer from 'react-native-background-timer';

export default function About() {
  const isDarkMode = useColorScheme() === 'dark';
  const textColor = isDarkMode ? '#FEFAE0' : 'black';



  const [appData, setAppData] = useState<App[]>([]);
  const [socialsData, setSocialsData] = useState<Socials[]>([]);
  const [partnersData, setPartnersData] = useState<Partners[]>([]);
  const [retryCount, setRetryCount] = useState<number>(0);

  var flag=false;
  useEffect(() => {
    const fetchData = async () => {
      if (retryCount >= MAX_RETRY_COUNT && flag === true) {
        console.log('Max retry count reached. Stopping retries.');
        return;
      }


      try {
        const appCollection = database.collections.get<App>('app');
        const socialsCollection = database.collections.get<Socials>('socials');
        const partnersCollection =
          database.collections.get<Partners>('partners');

        const app = await appCollection.query().fetch();
        const socials = await socialsCollection.query().fetch();
        const partners = await partnersCollection.query().fetch();

        setAppData(app);
        setSocialsData(socials);
        setPartnersData(partners);

        
        if (app.length !== 0 && socials.length !== 0 && partners.length !== 0) {
          flag = true;
        }

        console.log('App Data:', app);
        console.log('Socials Data:', socials);
        console.log('Partners Data:', partners);

      } catch (error) {
        console.error('Error fetching data:', error);
        console.log('Retrying - attempt2: ', retryCount);
        setRetryCount((prevCount) => prevCount + 1);
      }
      
      if(!flag){
        console.log('Retrying - attempt: ', retryCount);
        setRetryCount((prevCount) => prevCount + 1);
      }
      
    };

    fetchData();
  }, [retryCount]);


  const handlePress = (url: string) => {
    Linking.openURL(url).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };

  // GEOFENCING

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        ]);
  
        if (
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_BACKGROUND_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Location permission granted');
          return true;
        } else {
          console.log('Location permission denied');
          return false;
        }
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
    return false;
  };
  
  const startLocationUpdates = async () => {
    const permissionGranted = await requestLocationPermission();
  
    if (permissionGranted) {
      // Configure location updates
      Geolocation.setRNConfiguration({ skipPermissionRequests: false, authorizationLevel: 'auto' });
  
      // Function to get location
      const getLocation = () => {
        Geolocation.getCurrentPosition(
          (position) => {
            console.log('Position:', position.coords);
            // Handle your location data here
          },
          (error) => {
            console.error('Error getting location', error);
          },
          { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
        );
      };
  
      
      BackgroundTimer.runBackgroundTimer(() => {
        getLocation();
      }, 5 * 1000);
    } else {
      console.log('Permission not granted', 'Unable to fetch location in background.');
    }
  };
  

    useEffect(() => {
      startLocationUpdates(); // Start location updates when component mounts
  
      return () => {
        // Clean up (stop background updates if necessary)
        BackgroundTimer.stopBackgroundTimer();
      };
    }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      backgroundColor: isDarkMode ? '#161716' : '#FEFAE0',
      alignItems: 'center',
    },
    appNameText: {
      fontSize: 50,
      fontFamily: 'Roboto',
      fontWeight: 'bold',
      color: isDarkMode ? '#FEFAE0' : 'black',
      marginTop: 10,
      marginBottom: 40,
    },
    appDescText: {
      fontSize: 20,
      fontFamily: 'Roboto',
      color: isDarkMode ? '#FEFAE0' : 'black',
      marginBottom: 30,
    },
    appLandingText: {
      fontSize: 14,
      fontFamily: 'Roboto',
      color: isDarkMode ? '#FEFAE0' : 'black',
      marginBottom: 40,
      alignSelf: 'center',
      alignItems: 'center',
      alignContent: 'center',
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
      width: '80%',
    },
    infoText: {
      fontSize: 15,
      fontFamily: 'Roboto',
      color: isDarkMode ? '#FEFAE0' : 'black',
      marginBottom: 20,
    },
    imageButton: {
      marginHorizontal: 5,
      alignItems: 'center',
      alignSelf: 'center',
    },
    image: {
      width: 100,
      height: 100,
      resizeMode: 'cover',
      alignSelf: 'center',
    },
    partnerText: {
      fontSize: 10,
      fontFamily: 'Roboto',
      color: isDarkMode ? '#FEFAE0' : 'black',
      marginBottom: 5,
      alignSelf: 'center',
      alignItems: 'center',
      alignContent: 'center',
    }
  });

  return (
    <View style={styles.container}>
      <AppLogo height={200} width={200} marginTop={'5%'} />

      {appData.length > 0 && (
        <>
          <Text style={styles.appNameText}>{appData[0].appName}</Text>
          <Text style={styles.appDescText}>{appData[0].appDesc}</Text>
          <Text style={styles.appLandingText}>{appData[0].appLanding}</Text>
        </>
      )}

      <View style={styles.rowContainer}>
        <Text style={styles.infoText}>Segue-nos em:</Text>
        <Text style={styles.infoText}>Os nossos parceiros:</Text>
      </View>

      <View style={styles.rowContainer}>
        {socialsData.map((social, index) => (
          <TouchableOpacity
            key={index}
            style={styles.imageButton}
            onPress={() => handlePress(social.socialUrl)}>
            <FacebookLogo height={100} width={100} />
          </TouchableOpacity>
        ))}

{partnersData.map((partner, index) => {
        console.log('Rendering partner:', partner); // Debugging log
        return (
          <View key={index} style={styles.container}>
            <Text style={styles.infoText}>{partner.partnerName}</Text>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => handlePress(partner.partnerUrl)}>
              <UmLogo height={100} width={150} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL(`mailto:${partner.partnerMail}`)}
              style={styles.partnerText}>
              <Text style={styles.partnerText}>{partner.partnerMail}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${partner.partnerPhone}`)}
              style={styles.partnerText}>
              <Text style={styles.partnerText}>{partner.partnerPhone}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
      </View>
    </View>
  );
}

