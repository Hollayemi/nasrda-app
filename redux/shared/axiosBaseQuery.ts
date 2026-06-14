// import { server } from '@/config/server';
// import toaster from '@/config/toaster';
// import storage from '@/lib/storage';
// import NetInfo from '@react-native-community/netinfo';
// import type { BaseQueryFn } from '@reduxjs/toolkit/query';
// import axios, { AxiosError, AxiosRequestConfig } from 'axios';
// import { router } from 'expo-router';

// const TOKEN_KEY = 'auth_token';

// // ─── Token Helpers ─────────────────────────────────────────────────────────────

// export const getStoredToken = async (): Promise<string | null> => {
//   return storage.getItem(TOKEN_KEY);
// };

// export const clearStoredTokens = async (): Promise<void> => {
//   await storage.removeItem('auth_token');
//   await storage.removeItem('auth_refresh_token');
//   await storage.removeItem('auth_user_data');
// };

// // ─── Types ─────────────────────────────────────────────────────────────────────

// export type AxiosBaseQueryArgs = {
//   url: string;
//   method: AxiosRequestConfig['method'];
//   data?: AxiosRequestConfig['data'];
//   params?: AxiosRequestConfig['params'];
//   headers?: Record<string, string>;
//   /** When true, suppress global error toast / redirect handling */
//   skipErrorHandling?: boolean;
// };

// interface CustomError {
//   status: number | string;
//   data: any;
// }

// // ─── Base Query ────────────────────────────────────────────────────────────────

// export const axiosBaseQuery =
//   (): BaseQueryFn<AxiosBaseQueryArgs, unknown, CustomError> =>
//   async ({
//     url,
//     method,
//     data,
//     params,
//     headers = {},
//     skipErrorHandling = false,
//   }) => {
//     try {
//       const token = await getStoredToken();
//       const authHeader: Record<string, string> = token
//         ? { Authorization: `Bearer ${token}` }
//         : {};

//       const response = await axios({
//         url: `${server}/api/v1${url}`,
//         method,
//         data,
//         params,
//         headers: {
//           'Content-Type': 'application/json',
//           ...authHeader,
//           ...headers,
//         },
//         timeout: 15_000,
//       });

//       return { data: response.data };
//     } catch (err) {
//       const axiosErr = err as AxiosError;
//       const status = axiosErr.response?.status ?? 'NETWORK_ERROR';
//       const errorData = axiosErr.response?.data ?? { message: axiosErr.message };

//       if (!skipErrorHandling) {
//         // Network offline
//         if (!axiosErr.response) {
//           const net = await NetInfo.fetch();
//           if (!net.isConnected) {
//             toaster({ type: 'error', message: 'No internet connection.' });
//             return { error: { status, data: errorData } };
//           }
//         }

//         // Unauthorised — clear session and redirect
//         if (status === 401 || status === 403) {
//           await clearStoredTokens();
//           router.replace('/sign-in');
//           return { error: { status, data: errorData } };
//         }

//         // Server error
//         if (typeof status === 'number' && status >= 500) {
//           toaster({ type: 'error', message: 'Server error. Please try again.' });
//         }
//       }

//       return { error: { status, data: errorData } };
//     }
//   };
