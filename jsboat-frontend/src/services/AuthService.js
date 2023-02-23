// utils
import axios from '../utils/axios';

const login = async (email, password) => {
  const response = await axios.post('/login', {
    email,
    password,
  });
  return response;
};

const register = async (userData) => {
  const response = await axios.post('/register', { ...userData });
  return response;
};

const AuthService = {
  login,
  register
};

export default AuthService;
