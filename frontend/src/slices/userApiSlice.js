import { USERS_URL } from '../constants'
import { apiSlice } from './apiSlice'

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: data,
      }),
    }),
    registere: builder.mutation({
      query: (data) => ({ url: `${USERS_URL}/`, method: 'POST', body: data }),
    }),
    logout: builder.mutation({
      query: () => ({ url: `${USERS_URL}/logout`, method: 'POST' }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

// The convention is to use preffix word "use" and postfix write a "query" if it is query or write mutation it is mutation.
export const {
  useLoginMutation,
  useLogoutMutation,
  useRegistereMutation,
  useProfileMutation,
} = usersApiSlice
