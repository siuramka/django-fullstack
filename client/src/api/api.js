import axios from "axios";
import { AuthContext } from "../features/AuthContext";
import React from "react";
import {
  getAccessTokenFromLocalStorage,
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveAccessTokenToLocalStorage,
  saveTokensToLocalStorage,
} from "../features/AuthContextHelper";
import { Refresh } from "../services/AuthService";

export const baseURL = "/api/";

const api = axios.create({
  baseURL,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status == 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const user = getUserFromLocalStorage();
      if (user) {
        const newToken = await Refresh(user.refreshToken);

        if (newToken.access) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          saveAccessTokenToLocalStorage(newToken.access);
        } else {
          removeUserFromLocalStorage();
        }
      }
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    const token = getAccessTokenFromLocalStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
