import axios from "axios";
import config from "../config.json";

axios.defaults.baseURL = config.apiUrl;

export function setAuthTokenHeader(token) {
  // Explicitly check for null or undefined as well
  if (token) {
    console.log("Setting x-auth-token header"); // Add log
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    console.log("Deleting x-auth-token header"); // Add log
    delete axios.defaults.headers.common["x-auth-token"];
  }
}

const httpService = {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete,
};

export default httpService;
