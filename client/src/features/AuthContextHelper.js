export const getUserFromLocalStorage = () => {
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  return username && email && accessToken && refreshToken
    ? { username, email, accessToken, refreshToken }
    : null;
};

export const saveUserToLocalStorage = (user) => {
  localStorage.setItem("username", user.username);
  localStorage.setItem("email", user.email);
};

export const saveTokensToLocalStorage = (access, refresh) => {
  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);
};

export const saveAccessTokenToLocalStorage = (access) => {
  localStorage.setItem("accessToken", access);
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const getAccessTokenFromLocalStorage = () =>
  localStorage.getItem("accessToken");
