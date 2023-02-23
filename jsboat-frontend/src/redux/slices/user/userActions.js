// service
import AuthService from '../../../services/AuthService';
// store
import { dispatch } from '../../store';
// hooks
import { setSession } from '../../../utils/jwt';
import {
  startLoading,
  stopLoading,
  hasError,
  loginSuccess,
  registerSuccess,
  logout
} from './userSlice';

export function loginAction(data, callback){
  return async () => {
    dispatch(startLoading());
    try {
      const response = await AuthService.login(data.email, data.password);
      setSession(response.data.token);
      window.localStorage.setItem('email', response.data.data.email);
      dispatch(loginSuccess(response.data.data));
      callback();
    } catch (error) {
      dispatch(hasError(error));
      callback(error);
    }
  };
}

export function registerAction(data, callback){
  return async () => {
    dispatch(startLoading());
    try {
      await AuthService.register(data);
      callback();
    } catch (error) {
      dispatch(hasError(error));
      callback(error);
    } finally {
      dispatch(stopLoading());
    }
  };
}

export function logoutAction() {
  return () => {
    setSession(null);
    window.localStorage.removeItem('email');
    dispatch(logout());
  }
};