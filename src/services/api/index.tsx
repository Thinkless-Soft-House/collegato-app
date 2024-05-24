import axios, { AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENVIROMENT_CONFIG } from '../../../environmentConfiguration';

export async function configurarApiBase() {
    let configApiBase: AxiosRequestConfig = {};
    let token = await AsyncStorage.getItem('Token');
    let baseUrl: string = "";

    if (ENVIROMENT_CONFIG.isProduction)
      baseUrl = ENVIROMENT_CONFIG.apiProductionEndpoint;
    else
      baseUrl = ENVIROMENT_CONFIG.apiDevelopmentEndpoint;

    if (token !== null) {
      configApiBase = {
        baseURL: baseUrl,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    }
    else {
      configApiBase = {
        baseURL: baseUrl,
      }
    }

    return axios.create(configApiBase);
  }

