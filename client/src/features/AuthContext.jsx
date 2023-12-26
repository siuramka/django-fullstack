import { createContext, useState } from "react";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveTokensToLocalStorage,
  saveUserToLocalStorage,
} from "./AuthContextHelper";

export const AuthContext = createContext();

const initialUserAuth = { user: null, isAuthenticated: false };

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const user = getUserFromLocalStorage();
  const newUserAuth = user ? { user, isAuthenticated: true } : initialUserAuth;

  const [userAuth, setUserAuth] = useState(newUserAuth);

  const setLogin = (username, email, accessToken, refreshToken) => {
    const newUser = {
      username,
      email,
    };

    saveUserToLocalStorage(newUser);
    saveTokensToLocalStorage(accessToken, refreshToken);

    setUserAuth({
      user: newUser,
      isAuthenticated: true,
    });
  };

  const setLogout = () => {
    setUserAuth(initialUserAuth);
    removeUserFromLocalStorage();
  };

  const value = {
    userAuth,
    setLogin,
    setLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
