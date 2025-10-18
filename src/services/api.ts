// src/services/api.ts
import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKEND_URL;
// Create a configured instance of axios
const apiClient = axios.create({
  baseURL: `${apiUrl}/api`, // Replace with your actual API URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// You can also add interceptors here for handling auth tokens automatically
// apiClient.interceptors.request.use(config => { ... });

export default apiClient;
