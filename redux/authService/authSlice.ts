// import storage from '@/lib/storage';
// import { createApi } from '@reduxjs/toolkit/query/react'; // ← /react gives hooks
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { router } from 'expo-router';
// import { axiosBaseQuery } from '@/redux/shared/axiosBaseQuery';

// // ─── Storage Keys ──────────────────────────────────────────────────────────────

// const STORAGE_KEYS = {
//   TOKEN: 'auth_token',
//   REFRESH_TOKEN: 'auth_refresh_token',
//   USER_DATA: 'auth_user_data',
// } as const;

// // ─── Types ─────────────────────────────────────────────────────────────────────

// export interface AuthUser {
//   _id: string;
//   phone: string;
//   fullName: string;
//   role: any;
//   isActive: boolean;
//   lastLogin?: string;
// }

// export interface AuthState {
//   token: string | null;
//   refreshToken: string | null;
//   isAuthenticated: boolean;
//   user: AuthUser | null;
//   isLoading: boolean;
//   error: string | null;
// }

// interface ApiEnvelope<T> {
//   success: boolean;
//   type: 'success' | 'error';
//   message: string;
//   data: T;
// }

// interface SendOtpResponse {
//   phoneNumber: string;
//   message: string;
//   expiresIn: number;
// }

// interface VerifyOtpResponse {
//   accessToken: string;
//   refreshToken: string;
//   user: AuthUser;
// }

// // ─── RTK Query API ─────────────────────────────────────────────────────────────

// export const authApi = createApi({
//   reducerPath: 'authApi',
//   baseQuery: axiosBaseQuery(),
//   tagTypes: ['Auth', 'Profile'],
//   endpoints: (builder) => ({
//     sendOtp: builder.mutation<
//       ApiEnvelope<SendOtpResponse>,
//       { phone: string }
//     >({
//       query: ({ phone }) => ({
//         url: '/auth/send-otp',
//         method: 'POST',
//         data: { phone },
//         skipErrorHandling: true,
//       }),
//     }),

//     verifyOtp: builder.mutation<
//       ApiEnvelope<VerifyOtpResponse>,
//       { phone: string; otp: string }
//     >({
//       query: ({ phone, otp }) => ({
//         url: '/auth/verify-otp',
//         method: 'POST',
//         data: { phone, otp },
//         skipErrorHandling: true,
//       }),
//       invalidatesTags: ['Auth'],
//       async onQueryStarted(_args, { dispatch, queryFulfilled }) {
//         try {
//           const { data } = await queryFulfilled;
//           console.log('OTP verification successful, received data:', data);
//           const { accessToken, refreshToken, user } = data.data;
//           dispatch(setCredentials({ token: accessToken, refreshToken, user }));
//         } catch {
//           // component handles via .unwrap()
//         }
//       },
//     }),

//     resendOtp: builder.mutation<
//       ApiEnvelope<{ message: string }>,
//       { phone: string }
//     >({
//       query: ({ phone }) => ({
//         url: '/auth/resend-otp',
//         method: 'POST',
//         data: { phone },
//         skipErrorHandling: true,
//       }),
//     }),

//     getMe: builder.query<ApiEnvelope<AuthUser>, void>({
//       query: () => ({
//         url: '/auth/me',
//         method: 'GET',
//       }),
//       providesTags: ['Profile'],
//       async onQueryStarted(_args, { dispatch, queryFulfilled }) {
//         try {
//           const { data } = await queryFulfilled;
//           dispatch(updateUser(data.data));
//         } catch {
//           // silent fail
//         }
//       },
//     }),

//     logout: builder.mutation<ApiEnvelope<null>, void>({
//       query: () => ({
//         url: '/auth/logout',
//         method: 'POST',
//       }),
//       async onQueryStarted(_args, { dispatch, queryFulfilled }) {
//         dispatch(clearAuth());
//         try {
//           await queryFulfilled;
//         } catch {
//           // already cleared
//         }
//       },
//     }),
//   }),
// });

// // ─── Initial State ─────────────────────────────────────────────────────────────

// const initialState: AuthState = {
//   token: null,
//   refreshToken: null,
//   isAuthenticated: false,
//   user: null,
//   isLoading: false,
//   error: null,
// };

// // ─── Slice ─────────────────────────────────────────────────────────────────────

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setCredentials: (
//       state,
//       action: PayloadAction<{
//         token: string;
//         refreshToken: string;
//         user: AuthUser;
//       }>
//     ) => {
//       const { token, refreshToken, user } = action.payload;
//       state.token = token;
//       state.refreshToken = refreshToken;
//       state.user = user;
//       state.isAuthenticated = true;
//       state.error = null;

//       console.log('Storing auth data:', { token, refreshToken, user });

//       storage.setItem(STORAGE_KEYS.TOKEN, token);
//       storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
//       storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
//     },

//     updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
//       if (state.user) {
//         state.user = { ...state.user, ...action.payload };
//         storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(state.user));
//       }
//     },

//     clearAuth: (state) => {
//       state.token = null;
//       state.refreshToken = null;
//       state.user = null;
//       state.isAuthenticated = false;
//       state.error = null;
//       state.isLoading = false;

//       storage.multiRemove([
//         STORAGE_KEYS.TOKEN,
//         STORAGE_KEYS.REFRESH_TOKEN,
//         STORAGE_KEYS.USER_DATA,
//       ]);

//       router.replace('/sign-in');
//     },

//     initializeAuth: (
//       state,
//       action: PayloadAction<Partial<AuthState>>
//     ) => {
//       Object.assign(state, action.payload);
//     },

//     setError: (state, action: PayloadAction<string>) => {
//       state.error = action.payload;
//     },

//     setLoading: (state, action: PayloadAction<boolean>) => {
//       state.isLoading = action.payload;
//     },
//   },
// });

// export const {
//   setCredentials,
//   updateUser,
//   clearAuth,
//   initializeAuth,
//   setError,
//   setLoading,
// } = authSlice.actions;

// export default authSlice.reducer;

// // ─── Thunk: hydrate auth on app start ─────────────────────────────────────────

// export const hydrateAuth = () => async (dispatch: any) => {
//   try {
//     const [token, refreshToken, rawUser] = await storage.multiGet([
//       STORAGE_KEYS.TOKEN,
//       STORAGE_KEYS.REFRESH_TOKEN,
//       STORAGE_KEYS.USER_DATA,
//     ]);

//     const tokenValue = token[1];
//     const refreshValue = refreshToken[1];
//     const userValue = rawUser[1];

//     if (tokenValue && userValue) {
//       dispatch(
//         initializeAuth({
//           token: tokenValue,
//           refreshToken: refreshValue ?? null,
//           user: JSON.parse(userValue),
//           isAuthenticated: true,
//         })
//       );
//     }
//   } catch {
//     // stay unauthenticated
//   }
// };

// // ─── Exported Hooks ────────────────────────────────────────────────────────────

// export const {
//   useSendOtpMutation,
//   useVerifyOtpMutation,
//   useResendOtpMutation,
//   useGetMeQuery,
//   useLogoutMutation,
// } = authApi;

// export const selectToken = (s: { auth: AuthState }) => s.auth.token;
// export const selectUser = (s: { auth: AuthState }) => s.auth.user;
// export const selectIsAuthenticated = (s: { auth: AuthState }) => s.auth.isAuthenticated;
// export const selectUserRole = (s: { auth: AuthState }) => s.auth.user?.role ?? null;
// export const selectIsAdmin = (s: { auth: AuthState }) => s.auth.user?.role === "government";
