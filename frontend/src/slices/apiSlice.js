import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../constants'

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL })
export const apiSlice = createApi({
  baseQuery: baseQuery,
  tagTypes: ['Product', 'Order', 'User'], // The types of the data that we fetch through API.
  endpoints: (builder) => ({}),
})
