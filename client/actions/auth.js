import axios from 'axios';
import { isTokenExpired, decodeToken } from '../utils/auth';

import * as constants from '../constants';

export function logout() {
  return (dispatch) => {
    localStorage.removeItem('logs-to-google-cloud:apiToken');
    sessionStorage.removeItem('logs-to-google-cloud:apiToken');

    window.location = window.config.AUTH0_MANAGE_URL;

    dispatch({
      type: constants.LOGOUT_SUCCESS
    });
  };
}

export function loadCredentials() {
  return (dispatch) => {
    const apiToken = sessionStorage.getItem('logs-to-google-cloud:apiToken');
    if (apiToken) {
      const decodedToken = decodeToken(apiToken);

      if (isTokenExpired(decodedToken)) {
        return;
      }

      axios.defaults.headers.common.Authorization = `Bearer ${apiToken}`;
      sessionStorage.setItem('logs-to-google-cloud:apiToken', apiToken);

      dispatch({
        type: constants.RECIEVED_TOKEN,
        payload: {
          token: apiToken
        }
      });

      dispatch({
        type: constants.LOGIN_SUCCESS,
        payload: {
          token: apiToken,
          decodedToken,
          user: decodedToken
        }
      });

      return;
    }
  };
}
