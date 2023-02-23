// utils
import axios from '../utils/axios';

const getPlacesData = async (filterData = {}) => {
  const response = await axios.get('/get/places', { params: { ...filterData } });
  console.log('response', response);
  return response;
};

const likePlace = async (like, placeId) => {
  const response = await axios.post('/like/count', { like, place_id: placeId });
  return response;
};

const PlaceService = {
  getPlacesData,
  likePlace,
};

export default PlaceService;
