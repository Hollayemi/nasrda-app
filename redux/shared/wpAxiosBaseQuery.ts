import { server } from '@/config/server';
import toaster from '@/config/toaster';
import NetInfo from '@react-native-community/netinfo';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { router } from 'expo-router';

export type AxiosBaseQueryArgs = {
  url: string;
  method: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: Record<string, string>;
  skipErrorHandling?: boolean;
};

interface CustomError {
  status: number | string;
  data: any;
  originalStatus?: number;
}

export const wpAxiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, CustomError> =>
  async ({
    url,
    method,
    data,
    params,
    headers = {},
    skipErrorHandling = false,
  }) => {
    try {
      // Check network connectivity first
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        if (!skipErrorHandling) {
          toaster({ type: 'error', message: 'No internet connection.' });
        }
        return { error: { status: 'NETWORK_ERROR', data: { message: 'No internet connection' } } };
      }

      // Construct full URL for WordPress REST API
      // Example: /posts => https://central.nasrda.gov.ng/wp-json/wp/v2/posts
      const fullUrl = `${server}/v2${url}`;

      const response = await axios({
        url: fullUrl,
        method,
        data,
        params,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...headers,
        },
        timeout: 30000, // Increased timeout for WordPress
      });

      return { data: response.data };
    } catch (err) {
      const axiosErr = err as AxiosError;
      const status = axiosErr.response?.status ?? 'NETWORK_ERROR';
      const errorData = axiosErr.response?.data ?? { message: axiosErr.message };
      const originalStatus = axiosErr.response?.status;

      // Handle different error types
      if (!skipErrorHandling) {
        // Network errors (no response)
        if (!axiosErr.response) {
          toaster({ 
            type: 'error', 
            message: 'Connection failed. Please check your internet.' 
          });
          return { error: { status, data: errorData, originalStatus } };
        }

        // WordPress specific error messages
        let errorMessage = 'An error occurred';
        
        if (originalStatus === 401) {
          errorMessage = 'Unauthorized. Please login again.';
          // Optionally redirect to login
          // router.replace('/login');
        } 
        else if (originalStatus === 403) {
          errorMessage = 'You don\'t have permission to perform this action.';
        }
        else if (originalStatus === 404) {
          errorMessage = 'The requested resource was not found.';
        }
        else if (originalStatus === 429) {
          errorMessage = 'Too many requests. Please try again later.';
        }
        else if (originalStatus && originalStatus >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        // else if (errorData?.message) {
        //   errorMessage = errorData.message;
        // }
        // else if (errorData?.data?.message) {
        //   errorMessage = errorData.data.message;
        // }

        toaster({ type: 'error', message: errorMessage });
      }

      return { error: { status, data: errorData, originalStatus } };
    }
  };