import axios from 'axios';
// import { env } from '../constants/enviroments';

let defaultHeaders: { [key: string]: string } = {
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};

// Only if the app is in development mode, attach token and session id to the request manually
// if (env.DEV) {
//   defaultHeaders = {
//     ...defaultHeaders,
//     Token: env.VITE_APP_USER_TOKEN,
//     'Session-id': env.VITE_APP_USER_SESSION,
//   };
// }

const Api = axios.create({
  // baseURL: env.VITE_APP_BASE_URL,
  headers: defaultHeaders,
  responseType: 'json',
  withCredentials: true,
});

export default Api;
