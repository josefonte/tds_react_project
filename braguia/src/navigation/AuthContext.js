import React from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import {fetchUser} from '../redux/actions';
import {useAppDispatch} from '../redux/hooks';

export const AuthContext = React.createContext(); // Add this line to import the 'AuthContext' namespace

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [cookies, setCookies] = React.useState(null);
  const [errorLogin, setErrorLogin] = React.useState(false);
  const [username, setUsername] = React.useState('');

  async function login(username, password) {
    console.log('login', username, password);

    try {
      setErrorLogin(false);
      axios.defaults.headers.common['Cookie'] = '';
      const loginResponse = await axios.post(
        'https://1130-193-137-92-26.ngrok-free.app/login',
        {
          username: username,
          password: password,
        },
      );

      setIsLoading(true);
      const cookiesHeader = loginResponse.headers['set-cookie'];

      console.log('[Login Request] - Cookies : ', cookiesHeader);

      if (cookiesHeader) {
        setCookies(cookiesHeader);
        await EncryptedStorage.setItem('cookies', cookiesHeader[0]);
        setUsername(username);
        await EncryptedStorage.setItem('username', username);
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      setErrorLogin(true);
      console.log('ERROR', error);
      setIsLoading(false);
    }
  }

  async function logout() {
    setIsLoading(true);

    setCookies(null);
    await EncryptedStorage.removeItem('cookies');

    setUsername(null);
    await EncryptedStorage.removeItem('username');

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }

  const isLoggedIn = async () => {
    setIsLoading(true);
    try {
      const cookiesStored = await EncryptedStorage.getItem('cookies');
      const usernameStored = await EncryptedStorage.getItem('username');
      if (cookiesStored && username) {
        console.log('cookiesStored', cookiesStored);
        console.log('usernameStored', usernameStored);
        setCookies(cookiesStored);
        setUsername(usernameStored);

        await fetchUser(cookiesStored);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  React.useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{login, logout, isLoading, cookies, errorLogin, username}}>
      {children}
    </AuthContext.Provider>
  );
};
