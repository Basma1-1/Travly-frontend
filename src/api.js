import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000', // ton backend
});

export const searchVoyages = async (destination, date) => {
  const response = await API.get('/voyages/search', {
    params: { destination, date }
  });
  return response.data;
};

export const getVoyageDetails = async (id, token = null) => {
  try {
    const response = await API.get(`/voyages/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data;
  } catch (err) {
    throw err.response.data;
  }
};
