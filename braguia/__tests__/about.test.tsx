import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import About from '../src/screens/About'; // Adjust the import path accordingly
import { useNavigation } from '@react-navigation/native';
import database from '../../src/model/database';
import { Q } from '@nozbe/watermelondb';
import PushNotification from 'react-native-push-notification';
import * as themes from '../src/utils/themes';
import Linking from 'react-native/Libraries/Linking/Linking';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

// Mock database
jest.mock('../../model/database', () => ({
  collections: {
    get: jest.fn().mockReturnValue({
      query: jest.fn().mockReturnValue({
        fetch: jest.fn(),
      }),
    }),
  },
}));

// Mock assets
jest.mock('../../assets/logo.svg', () => 'AppLogo');
jest.mock('../../assets/facebook.svg', () => 'FacebookLogo');
jest.mock('../../assets/umlogo.svg', () => 'UmLogo');

// Mock PushNotification
jest.mock('react-native-push-notification', () => ({
  configure: jest.fn(),
}));

// Mock Linking
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));

describe('About Component', () => {
  const navigation = { navigate: jest.fn() };
  useNavigation.mockReturnValue(navigation);

  const mockAppData = [
    { appName: 'Test App', appDesc: 'App Description', appLanding: 'Landing Text' },
  ];
  const mockSocialsData = [
    { socialUrl: 'https://facebook.com/test' },
  ];
  const mockPartnersData = [
    { partnerName: 'Partner 1', partnerUrl: 'https://partner1.com', partnerMail: 'partner1@mail.com', partnerPhone: '1234567890' },
  ];

  beforeEach(() => {
    database.collections.get = jest.fn((model: string) => ({
      query: jest.fn().mockReturnValue({
        fetch: jest.fn().mockResolvedValue(
          model === 'app' ? mockAppData :
          model === 'socials' ? mockSocialsData :
          mockPartnersData
        ),
      }),
    }));
  });
  

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with fetched data', async () => {
    const { getByText } = render(<About />);
    
    await waitFor(() => {
      expect(getByText('Test App')).toBeTruthy();
      expect(getByText('App Description')).toBeTruthy();
      expect(getByText('Landing Text')).toBeTruthy();
    });
  });

  it('retries fetching data on failure', async () => {
    const errorMock = jest.fn().mockRejectedValueOnce(new Error('Network Error')).mockResolvedValueOnce(mockAppData);
    database.collections.get.mockReturnValue({
      query: jest.fn().mockReturnValue({
        fetch: errorMock,
      }),
    });

    const { getByText } = render(<About />);

    await waitFor(() => {
      expect(errorMock).toHaveBeenCalledTimes(2);
      expect(getByText('Test App')).toBeTruthy();
    });
  });

  it('handles social link press', async () => {
    const { getByText } = render(<About />);

    await waitFor(() => {
      const socialLink = getByText('Segue-nos em:');
      fireEvent.press(socialLink);
      expect(Linking.openURL).toHaveBeenCalledWith('https://facebook.com/test');
    });
  });

  it('handles partner link press', async () => {
    const { getByText } = render(<About />);

    await waitFor(() => {
      const partnerLink = getByText('Partner 1');
      fireEvent.press(partnerLink);
      expect(Linking.openURL).toHaveBeenCalledWith('https://partner1.com');
    });
  });

  it('navigates on push notification action', async () => {
    const notification = { action: 'View', message: 'message 1' };
    PushNotification.configure.mockImplementation((config) => {
      config.onNotification(notification);
    });

    render(<About />);

    await waitFor(() => {
      expect(navigation.navigate).toHaveBeenCalledWith('PontoDeInteresseDetail', { pin: expect.any(Object) });
    });
  });
});