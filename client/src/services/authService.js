const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

export const login = (username, password) => {

  if (
    username === ADMIN_USERNAME &&
    password === ADMIN_PASSWORD
  ) {
    localStorage.setItem("isLoggedIn", "true");
    return true;
  }

  return false;
};

export const logout = () => {
  localStorage.removeItem("isLoggedIn");
};

export const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};