import axios from "axios";
const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api`;

interface PreferencesPayload {
  tracked_countries: string[];
  tracked_cryptos: string[];
}

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (err) {
    console.error('Login error:', err);
    throw err;
  }
};

export const registerUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { email, password });
    return response.data;
  } catch (err) {
    console.error('Registration error:', err);
    throw err;
  }
};

export const getNews = async () => {
  try {
    const response = await axios.get(`${API_URL}/data/news`);
    return response.data;
  } catch (err) {
    console.error('Error Fetching news:', err);
    throw err;
  }
};

export const getCryptos = async () => {
  try {
    const response = await axios.get(`${API_URL}/data/crypto`);
    return response.data;
  } catch (err) {
    console.error('Error Fetching Cryptos:', err);
    throw err;
  }
};

export const getRates = async () => {
  try {
    const response = await axios.get(`${API_URL}/data/rates`);
    return response.data;
  } catch (err) {
    console.error('Error Fetching Rates:', err);
    throw err;
  }
};

export const updateUserName = async (name: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Sorry you are not Authorized');

    const response = await axios.put(`${API_URL}/users/me`, { name }, {
      headers: { 'x-auth-token': token }
    });
    return response.data;
  } catch (err) {
    console.error('Error updating name: ', err);
    throw err;
  }
};

// FIX: Removed extra { preferences: ... } wrapper — backend expects flat { tracked_countries, tracked_cryptos }
export const updateUserPreferences = async (preferences: PreferencesPayload) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Sorry you are not Authorized');

    const response = await axios.put(`${API_URL}/preferences`, preferences, {
      headers: { 'x-auth-token': token }
    });
    return response.data;
  } catch (err) {
    console.error('Error updating preferences: ', err);
    throw err;
  }
};

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authorization token found.');

    const response = await axios.get(`${API_URL}/users/me`, {
      headers: { 'x-auth-token': token }
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching user profile:', err);
    throw err;
  }
};

export const getUserPreferences = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authorization token found.');

    const response = await axios.get(`${API_URL}/preferences`, {
      headers: { 'x-auth-token': token }
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching user preferences:', err);
    throw err;
  }
};