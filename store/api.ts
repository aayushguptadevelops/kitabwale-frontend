import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const API_URLS = {
  // User related
  REGISTER: `${BASE_URL}/auth/register`,
  LOGIN: `${BASE_URL}/auth/login`,
  VERIFY_EMAIL: (token: string) => `${BASE_URL}/auth/verify-email/${token}`,
  FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: (token: string) => `${BASE_URL}/auth/reset-password/${token}`,
  VERIFY_AUTH: `${BASE_URL}/auth/verify-auth`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  UPDATE_USER_PROFILE: (userId: string) =>
    `${BASE_URL}/user/profile/update/${userId}`,

  // Product related
  PRODUCTS: `${BASE_URL}/product`,
  PRODUCT_BY_ID: (productId: string) => `${BASE_URL}/product/${productId}`,
  GET_PRODUCT_BY_SELLER_ID: (sellerId: string) =>
    `${BASE_URL}/product/seller/${sellerId}`,
  DELETE_PRODUCT_BY_PRODUCT_ID: (productId: string) =>
    `${BASE_URL}/product/seller/${productId}`,

  // Cart related
  CART: (userId: string) => `${BASE_URL}/cart/${userId}`,
  ADD_TO_CART: `${BASE_URL}/cart/add`,
  REMOVE_FROM_CART: (productId: string) =>
    `${BASE_URL}/cart/remove/${productId}`,

  // Wishlist related
  WISHLIST: (userId: string) => `${BASE_URL}/wishlist/${userId}`,
  ADD_TO_WISHLIST: `${BASE_URL}/wishlist/add`,
  REMOVE_FROM_WISHLIST: (productId: string) =>
    `${BASE_URL}/wishlist/remove/${productId}`,

  // Order related
  ORDERS: `${BASE_URL}/order`,
  ORDER_BY_ID: (orderId: string) => `${BASE_URL}/order/${orderId}`,
  CREATE_RAZORPAY_PAYMENT: `${BASE_URL}/order/payment-razorpay`,

  // Address related
  GET_ADDRESS: `${BASE_URL}/user/address`,
  ADD_OR_UPDATE_ADDRESS: `${BASE_URL}/user/address/create-or-update`,
};

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  tagTypes: ["User", "Product", "Cart", "Wishlist", "Order", "Address"],
  endpoints: (builder) => ({
    // User endpoints
    register: builder.mutation({
      query: (userData) => ({
        url: API_URLS.REGISTER,
        method: "POST",
        body: userData,
      }),
    }),

    login: builder.mutation({
      query: (userData) => ({
        url: API_URLS.LOGIN,
        method: "POST",
        body: userData,
      }),
    }),

    verifyEmail: builder.mutation({
      query: (token) => ({
        url: API_URLS.VERIFY_EMAIL(token),
        method: "GET",
      }),
    }),

    forgotPassword: builder.mutation({
      query: (email) => ({
        url: API_URLS.FORGOT_PASSWORD,
        method: "POST",
        body: email,
      }),
    }),

    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: API_URLS.RESET_PASSWORD(token),
        method: "POST",
        body: { newPassword },
      }),
    }),

    verifyAuth: builder.mutation({
      query: () => ({
        url: API_URLS.VERIFY_AUTH,
        method: "GET",
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: API_URLS.LOGOUT,
        method: "GET",
      }),
    }),

    updateUser: builder.mutation({
      query: ({ userId, userData }) => ({
        url: API_URLS.UPDATE_USER_PROFILE(userId),
        method: "PUT",
        body: userData,
      }),
    }),

    // Products related
    addProducts: builder.mutation({
      query: (productData) => ({
        url: API_URLS.PRODUCTS,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    getProducts: builder.query({
      query: () => API_URLS.PRODUCTS,
      providesTags: ["Product"],
    }),

    getProductById: builder.query({
      query: (id) => API_URLS.PRODUCT_BY_ID(id),
      providesTags: ["Product"],
    }),

    getProductBySellerId: builder.query({
      query: (sellerId) => API_URLS.GET_PRODUCT_BY_SELLER_ID(sellerId),
      providesTags: ["Product"],
    }),

    deleteProductById: builder.mutation({
      query: (productId) => ({
        url: API_URLS.DELETE_PRODUCT_BY_PRODUCT_ID(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    // Cart related
    addToCart: builder.mutation({
      query: (productData) => ({
        url: API_URLS.ADD_TO_CART,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: API_URLS.REMOVE_FROM_CART(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    getCart: builder.query({
      query: (userId) => API_URLS.CART(userId),
      providesTags: ["Cart"],
    }),

    // Wishlist
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: API_URLS.ADD_TO_WISHLIST,
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Wishlist"],
    }),

    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: API_URLS.REMOVE_FROM_WISHLIST(productId),
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    getWishlist: builder.query({
      query: (userId) => API_URLS.WISHLIST(userId),
      providesTags: ["Wishlist"],
    }),

    // Order
    getUserOrders: builder.query({
      query: () => API_URLS.ORDERS,
      providesTags: ["Order"],
    }),

    getOrderById: builder.query({
      query: (orderId) => API_URLS.ORDER_BY_ID(orderId),
      providesTags: ["Order"],
    }),

    createOrUpdateOrder: builder.mutation({
      query: ({ orderId, orderData }) => ({
        url: API_URLS.ORDERS,
        method: orderId ? "PATCH" : "POST",
        body: orderData,
      }),
      invalidatesTags: ["Order"],
    }),

    createRazorpayPayment: builder.mutation({
      query: (orderId) => ({
        url: API_URLS.CREATE_RAZORPAY_PAYMENT,
        method: "POST",
        body: { orderId },
      }),
    }),

    // Address
    getAddress: builder.query<any[], void>({
      query: () => API_URLS.GET_ADDRESS,
      providesTags: ["Address"],
    }),

    addOrUpdateAddress: builder.mutation<any, any>({
      query: (address) => ({
        url: API_URLS.ADD_OR_UPDATE_ADDRESS,
        method: "POST",
        body: address,
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyAuthMutation,
  useLogoutMutation,
  useUpdateUserMutation,
  useAddProductsMutation,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySellerIdQuery,
  useDeleteProductByIdMutation,
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrUpdateOrderMutation,
  useCreateRazorpayPaymentMutation,
  useAddOrUpdateAddressMutation,
  useGetAddressQuery,
} = api;
