import axios from "axios";
const API_URL = "http://localhost:3000/api";

interface PreferencesPayload {
  tracked_countries: string[];
  tracked_cryptos: string[];
}


export const getNews = async () =>{
    try{
    const response  = await axios.get(`${API_URL}/data/news`);
    
    return response.data;
    } catch(err) {
       console.error('Error Fetching news:',  err);
       throw err;
    }
    
}

export const getCryptos = async () =>{
    try{
    const response  = await axios.get(`${API_URL}/data/crypto`);
    
    return response.data;
    } catch(err) {
       console.error('Error Fetching Cryptosß:',  err);
       throw err;
    }
    
}

export const getRates = async () =>{
    try{
    const response  = await axios.get(`${API_URL}/data/rates`);
    
    return response.data;
    } catch(err) {
       console.error('Error Fetching Rates:',  err);
       throw err;
    }
    
}


export const updateUserName = async(name: string) => {
    try{
        
        const token = localStorage.getItem('token');
       if(!token){
        throw new Error('Sorry you are not Authorized');
       }


        const response = await axios.put(`${API_URL}/users/me`, {name}, {
            headers: {
                'x-auth-token': token
            }
        });
        return response.data;

    } catch (err) {
            console.error('Error getting authenticated: ', err);
            throw err;
    }
}

export const updateUserPreferences = async(preferences: PreferencesPayload ) => {
    try{
        
        const token = localStorage.getItem('token');
       if(!token){
        throw new Error('Sorry you are not Authorized');
       }


        const response = await axios.put(`${API_URL}/preferences`, {preferences}, {
            headers: {
                'x-auth-token': token
            }
        });
        return response.data;

    } catch (err) {
            console.error('Error getting authenticated: ', err);
            throw err;
    }
}

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authorization token found.');
    }

    // We use axios.get() and pass the config object as the second argument
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: {
        'x-auth-token': token
      }
    });

    return response.data;

  } catch (err) {
    console.error('Error fetching user profile:', err);
    throw err;
  }
};

// --- NEW: Get the current user's preferences ---
export const getUserPreferences = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authorization token found.');
    }

    // We use axios.get() to fetch the preferences
    const response = await axios.get(`${API_URL}/preferences`, {
      headers: {
        'x-auth-token': token
      }
    });

    return response.data;

  } catch (err) {
    console.error('Error fetching user preferences:', err);
    throw err;
  }
};