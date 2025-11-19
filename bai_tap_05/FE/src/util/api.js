import axios from "./axios.customize";

const createUserApi = (name, email, password) => {
  const URL_API = "/v1/api/register";
  const data = {
    name,
    email,
    password,
  };
  return axios.post(URL_API, data);
};

const loginApi = (email, password) => {
  const URL_API = "/v1/api/login";
  const data = {
    email,
    password,
  };
  return axios.post(URL_API, data);
};

const getUserApi = () => {
  const URL_API = "/v1/api/user";
  return axios.get(URL_API);
};

const forgotPasswordApi = (email) => {
  const URL_API = "/v1/api/forgot-password";
  const data = { email };
  return axios.post(URL_API, data);
};

const getProductsApi = (category, page = 1, limit = 12, cursor = null) => {
  let url = `/v1/api/products?limit=${limit}&page=${page}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;
  if (cursor) url += `&cursor=${cursor}`;
  return axios.get(url);
};

const getProductDetailApi = (id) => {
  const URL_API = `/v1/api/products/${id}`;
  return axios.get(URL_API);
};

export { createUserApi, forgotPasswordApi, getUserApi, loginApi, getProductsApi, getProductDetailApi };
