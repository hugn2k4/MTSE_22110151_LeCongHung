import axios from "axios";

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Alter defaults after instance has been created
// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // ensure no Authorization header is set when there's no token
      delete config.headers.Authorization;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response && response.data) return response.data;
    return response;
  },
  function (error) {
    // Any status codes that falls outside of the range of 2xx cause this function to trigger
    // Do something with response error
    // Prefer rejecting the error so callers can handle it with try/catch
    if (error?.response?.data) return Promise.reject(error.response.data);
    return Promise.reject(error);
  }
);

export default instance;
