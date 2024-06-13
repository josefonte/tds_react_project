import React from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import {json} from '@nozbe/watermelondb/decorators';

export const AuthContext = React.createContext(); // Add this line to import the 'AuthContext' namespace

export const AuthProvider = ({children}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [cookies, setCookies] = React.useState(null);

  async function login(username, password) {
    setIsLoading(true);
    console.log('login', username, password);
    axios
      .post('https://39b6-193-137-92-72.ngrok-free.app/login', {
        username: username,
        password: password,
      })
      .then(response => {
        console.log('RESPONSE');
        const setCookieHeader = response.headers['set-cookie'];
        console.log('setCookieHeader', setCookieHeader);
      })
      .catch(error => {
        console.log('ERROR', error);
      });

    const cookiesFAKE =
      'csrftoken=hxygFE1vlBxdqN4DcuuZ6T561yvijWTwoAKbTjB5ppMKrrcH7hIksKyIdJZ6HnNT; Path=/; Expires=Thu, 12 Jun 2025 19:34:14 GMT;sessionid=g7ote3gntpnrt1x101bjlsei5a4m8kwt; Path=/; Expires=Thu, 27 Jun 2024 19:34:14 GMT';

    axios
      .get('https://39b6-193-137-92-72.ngrok-free.app/user', {
        headers: {
          Cookie: cookiesFAKE,
        },
      })
      .then(response => {
        console.log('Response:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    setCookies(cookiesFAKE);
    await EncryptedStorage.setItem('cookies', JSON.stringify(cookiesFAKE));

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }

  async function logout() {
    setIsLoading(true);
    setCookies(null);
    await EncryptedStorage.removeItem('cookies');
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }

  const isLoggedIn = async () => {
    setIsLoading(true);
    try {
      const cookiesStored = await EncryptedStorage.getItem('cookies');
      if (cookiesStored) {
        console.log('cookiesStored', cookiesStored);
        setCookies(JSON.parse(cookiesStored));
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
    <AuthContext.Provider value={{login, logout, isLoading, cookies}}>
      {children}
    </AuthContext.Provider>
  );
};
