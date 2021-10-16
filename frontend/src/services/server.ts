import axios from 'axios';
import { API_URL } from '../shared/variables';

const server = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default server;
