import {Platform} from 'react-native';

export const API_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';
export const SOCKET_URL =
  Platform.OS === 'android'
    ? 'ws://10.0.2.2:3001/match'
    : 'ws://localhost:3001/match';
