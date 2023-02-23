import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  error: null,
  isInitialized: false,
  isAuthenticated: false,
  user: {},
  message: '',
  responseStatus: '',
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    // STOP LOADING
    stopLoading(state) {
      state.isLoading = false;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    initializeData(state, action) {
      state.isLoading = false;
      state.isInitialized = true;
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    // Login success
    loginSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload;
      state.isInitialized = true;
      state.isAuthenticated = true;
      state.error = null;
    },
    // Set User data
    setUserData(state, action) {
      state.user = action.payload;
    },
    // Login success
    registerSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload;
      state.isInitialized = true;
      state.isAuthenticated = true;
      state.error = null;
    },
    // Logout
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    // Get User details
    getUserDataSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload.data;
      state.isAuthenticated = true;
    },
    // Update User details
    updateUserSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload.data;
      state.responseStatus = action.payload.status;
      state.message = action.payload.message;
    },
    // Clear response status and message
    clearMessages(state) {
      state.responseStatus = '';
      state.message = '';
    },
    // Clear error
    clearErrorMessage(state) {
      state.error = null;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  startLoading,
  stopLoading,
  hasError,
  loginSuccess,
  registerSuccess,
  logout,
  getUserDataSuccess,
  updateUserSuccess,
  clearMessages,
  clearErrorMessage,
  initializeData,
  setUserData,
} = slice.actions;
