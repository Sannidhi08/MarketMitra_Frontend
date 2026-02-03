import axios from "axios";

/*
  This file handles all API requests.
*/

const API = axios.create({
  baseURL: "http://localhost:3003", // backend base
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= AUTH APIs ================= */

export const loginUser = (data) => {
  return API.post("/auth/login", data);
};

export const registerUser = (data) => {
  return API.post("/auth/register", data);
};

/* ================= ADMIN APIs ================= */

export const getCategories = () => {
  return API.get("/admin/categories");
};

export const addCategory = (data) => {
  return API.post("/admin/category/add", data);
};

export const getUsers = () => {
  return API.get("/admin/users");
};

export const addArticle = (data) => {
  return API.post("/admin/article/add", data);
};

/* ================= FARMER APIs ================= */

export const addProduct = (data) => {
  return API.post("/farmer/product/add", data);
};

export const getFarmerOrders = () => {
  return API.get("/farmer/orders");
};

export const addJobPost = (data) => {
  return API.post("/farmer/job/add", data);
};

/* ================= USER APIs ================= */

export const getProducts = () => {
  return API.get("/user/products");
};

export const placeOrder = (data) => {
  return API.post("/user/order/add", data);
};

export const getUserOrders = () => {
  return API.get("/user/orders");
};
