import { PRODUCTS_URL } from '../constants'
import { apiSlice } from './apiSlice'

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: PRODUCTS_URL,
      }),
      providesTags: ['Products'],
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: `${PRODUCTS_URL}/new`,
        method: 'POST',
      }),
      invalidatesTags: ['Product'], // it stopping it from catching. So we have fresh data and we don't have to reload the page.
    }),
    updateProduct: builder.mutation({
      query: (data) => {
        return {
          url: `${PRODUCTS_URL}/${data.productId}`,
          method: 'PUT',
          body: data,
        }
      },
      invalidatesTags: ['Products'],
    }),
  }),
})

// The convention is to use preffix word "use" and postfix write a "query" if it is query or write mutation it is mutation.
export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
} = productsApiSlice
