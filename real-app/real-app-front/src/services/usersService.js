// import httpService from "./httpService";
// import { jwtDecode } from "jwt-decode";

// const TOKEN_KEY = "token";

// refreshToken();

// function createUser(user) {
//   return httpService.post("/users", user);
// }

// async function login(credentials) {
//   const response = await httpService.post("/auth", credentials);

//   setToken(response.data.token);

//   return response;
// }

// function getMe() {
//   return httpService.get("/users/me");
// }

// function logout() {
//   setToken(null);
// }

// function setToken(token) {
//   localStorage.setItem(TOKEN_KEY, token);
//   refreshToken();
// }

// function refreshToken() {
//   httpService.setDefaultCommonHeaders("x-auth-token", getJWT());
// }

// function getJWT() {
//   return localStorage.getItem(TOKEN_KEY);
// }

// function getUser() {
//   try {
//     const token = getJWT();
//     return jwtDecode(token);
//   } catch {
//     return null;
//   }
// }

// const usersService = {
//   createUser,
//   login,
//   logout,
//   getMe,
//   getJWT,
//   getUser,
// };

// export default usersService;

import httpService from "./httpService";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

refreshToken();

function createUser(user) {
  // Register a new user
  return httpService.post("/users", user);
}

// async function login(credentials) {
//   // Login a user
//   const response = await httpService.post("/users/login", credentials);

//   setToken(response.data.token);

//   return response;
// }

async function login(credentials) {
  const response = await httpService.post("/users/login", credentials);
  const token = response.data; // The token is the plain response body
  console.log("Token from response body:", token); // Debugging

  setToken(token); // Store the token in localStorage
  return response;
}

function getMe() {
  // Get the current user's details
  return httpService.get("/users/me");
}

function logout() {
  setToken(null);
}

// function setToken(token) {
//   localStorage.setItem(TOKEN_KEY, token);
//   refreshToken();
// }

function setToken(token) {
  if (!token) {
    console.log("Removing token from localStorage."); // Debugging
    localStorage.removeItem(TOKEN_KEY); // Remove the token from localStorage
    refreshToken();
    return;
  }
  console.log("Setting token:", token); // Debugging
  localStorage.setItem(TOKEN_KEY, token);
  refreshToken();
}

function refreshToken() {
  httpService.setDefaultCommonHeaders("x-auth-token", getJWT());
}

// function getJWT() {
//   return localStorage.getItem(TOKEN_KEY);
// }

function getJWT() {
  const token = localStorage.getItem(TOKEN_KEY);
  console.log("Retrieved token from localStorage:", token); // Debugging
  return token;
}

// function getUser() {
//   try {
//     const token = getJWT();
//     return jwtDecode(token);
//   } catch {
//     return null;
//   }
// }

function getUser() {
  try {
    const token = getJWT();
    if (!token) {
      console.log("No token found in localStorage."); // Debugging
      return null;
    }
    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded); // Debugging
    return decoded; // Use the token as-is, including isBusiness
  } catch (error) {
    console.error("Error decoding token:", error); // Debugging
    return null;
  }
}

const usersService = {
  createUser,
  login,
  logout,
  getMe,
  getJWT,
  getUser,
};

export default usersService;
