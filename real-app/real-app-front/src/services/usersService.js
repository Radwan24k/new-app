import httpService, { setAuthTokenHeader } from "./httpService";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

function createUser(user) {
  // Register a new user
  return httpService.post("/users", user);
}

async function login(credentials) {
  // Login a user
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
  setToken(null); // Pass null to explicitly remove the token
}

function setToken(token) {
  if (!token) {
    // Check if token is null, undefined, or empty string
    console.log("Removing token from localStorage."); // Debugging
    localStorage.removeItem(TOKEN_KEY); // Remove the token from localStorage
    refreshTokenHeader(); // *** FIX: Call the correct function ***
    return;
  }
  console.log("Setting token:", token); // Debugging
  localStorage.setItem(TOKEN_KEY, token);
  refreshTokenHeader(); // *** FIX: Call the correct function ***
}

// Renamed function to avoid conflict and use imported function
function refreshTokenHeader() {
  // Use the imported function
  setAuthTokenHeader(getJWT());
}

// Make getJWT exportable if needed elsewhere, or keep local if only used here
export function getJWT() {
  const token = localStorage.getItem(TOKEN_KEY);
  // console.log("Retrieved token from localStorage:", token); // Debugging
  return token;
}

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

// Add function to get all users (requires admin privileges on backend)
export async function getAllUsers() {
  httpService.setJWT(getJWT()); // Ensure JWT is set for the request
  return await httpService.get("/users"); // Assuming '/users' is the correct endpoint
}

// Function to delete a user (requires admin privileges)
export async function deleteUserById(userId) {
  httpService.setJWT(getJWT());
  return await httpService.delete(`/users/${userId}`); // Assuming '/users/:id' for deletion
}

// Function to change user's business status (requires admin privileges)
export async function updateUserBusinessStatus(userId, isBusiness) {
  httpService.setJWT(getJWT());
  // Assuming PATCH /users/:id endpoint to update user details
  return await httpService.patch(`/users/${userId}`, { isBusiness });
}

const usersService = {
  createUser,
  login,
  logout,
  getMe,
  getJWT, // Export getJWT
  getUser,
  // Add new functions to the export
  getAllUsers,
  deleteUserById,
  updateUserBusinessStatus,
};

// Call once after everything is defined to set initial header
refreshTokenHeader();

export default usersService;
