import { createContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
// services
import UserService from '../services/UserService';
// Redux
import { useDispatch } from '../redux/store';
import { initializeData } from '../redux/slices/user/userSlice';

// ----------------------------------------------------------------------

const AuthContext = createContext({
  method: 'jwt',
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        const email = window.localStorage.getItem('email');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          window.localStorage.setItem('email', email);

          const response = await UserService.getUserProfile(email);
          
          const userData = omit(response.data.data, ['access_token']);
          
          // dispatch({
          //   type: 'INITIALIZE',
          //   payload: {
          //     isAuthenticated: true,
          //     user: userData,
          //   },
          // });
          dispatch(initializeData({
            isAuthenticated: true,
            user: userData,
          }));
        } else {
          // dispatch({
          //   type: 'INITIALIZE',
          //   payload: {
          //     isAuthenticated: false,
          //     user: null,
          //   },
          // });
          dispatch(initializeData({
            isAuthenticated: false,
            user: null,
          }));
        }
      } catch (err) {
        console.error(err);
        // dispatch({
        //   type: 'INITIALIZE',
        //   payload: {
        //     isAuthenticated: false,
        //     user: null,
        //   },
        // });
        dispatch(initializeData({
          isAuthenticated: false,
          user: null,
        }));
      }
    };

    initialize();
  }, []);

  // const login = async (email, password) => {
  //   const response = await AuthService.login(email, password);
  //   const { data } = response.data;

  //   setSession(data.access_token);
  //   window.localStorage.setItem('email', email);
  //   dispatch({
  //     type: 'LOGIN',
  //     payload: {
  //       user: omit(data, ['access_token']),
  //     },
  //   });
  // };

  const register = async (email, password, name) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      name
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    window.localStorage.removeItem('email');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        // ...state,
        method: 'jwt',
        // login,
        // logout,
        // register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
