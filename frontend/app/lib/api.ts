import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState, store } from "./store";
import { setToken } from "./features/authSlice";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
    responseHandler: async (response) => {
      const newToken = response.headers.get("new-access-token");
      if (newToken) {
        store.dispatch(setToken(newToken));
      }
      return response.json();
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getExchangeRates: builder.query({
      query: () => "exchange-rates",
    }),
    convert: builder.mutation({
      query: (conversion) => ({
        url: "convert",
        method: "POST",
        body: conversion,
      }),
    }),
    getTransactions: builder.query({
      query: () => "user/transactions",
    }),
  }),
});

export const {
  useLoginMutation,
  useGetExchangeRatesQuery,
  useConvertMutation,
  useGetTransactionsQuery,
} = api;
