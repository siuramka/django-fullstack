import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { baseURL } from "../api/api";
/**
 * Get user email, username from JWT token
 */
export const getUserDataFromJWT = (jwt_token) => {
  const decoded = jwtDecode(jwt_token);

  return decoded.username && decoded.username
    ? {
        username: decoded.username,
        email: decoded.email,
      }
    : null;
};

export const Login = async (username, password) => {
  try {
    const response = await axios.post(baseURL + "auth/login", {
      username,
      password,
    });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error();
    }
  } catch (error) {
    //Console.Error(error)
  }
};

export const Register = async (username, email, password, password2) => {
  try {
    const response = await axios.post(baseURL + "auth/register", {
      username,
      email,
      password,
      password2,
    });
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error();
    }
  } catch (error) {
    //Console.Error(error)
  }
};

export const Refresh = async (refresh) => {
  try {
    const response = await axios.post(baseURL + "auth/refresh", { refresh });
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error();
    }
  } catch (error) {
    //Console.Error(error)
  }
};
