// apiService.ts

import axios from 'axios';

export async function fetchDataFromAPI() {
  try {
    const response = await axios.get('https://39b6-193-137-92-72.ngrok-free.app/trails');
    return response.data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error;
  }
}
