import React, { useEffect } from 'react';
import { PermissionsAndroid, Alert, AppState, AppStateStatus } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import BackgroundTimer from 'react-native-background-timer';

const requestBackgroundLocation = async (): Promise<boolean> => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
                title: 'Track Background Location Permission',
                message: 'We need to get background location',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Tracking background location...');
            return true;
        } else {
            console.log('Background location permission denied');
            return false;
        }
    } catch (err) {
        console.warn(err);
        return false;
    }
};

const requestFineLocation = async (): Promise<boolean> => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Track Fine Location Permission',
                message: 'We need to get fine location',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Tracking fine location...');
            return true;
        } else {
            console.log('Fine location permission denied');
            return false;
        }
    } catch (err) {
        console.warn(err);
        return false;
    }
};

const startLocationUpdates = async () => {
    const permissionGranted = await requestFineLocation(); // Change to requestBackgroundLocation if needed
    const permissionGranted2 = await requestBackgroundLocation();

    if (permissionGranted && permissionGranted2) {
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
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        };

        // Start background timer to fetch location every 5 minutes
        BackgroundTimer.runBackgroundTimer(() => {
            getLocation();
        }, 5 * 1000); // 5 minutes in milliseconds
    } else {
        Alert.alert('Permission not granted', 'Unable to fetch location in background.');
    }
};

export default startLocationUpdates;