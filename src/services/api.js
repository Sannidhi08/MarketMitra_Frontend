import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3003",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= AUTH ================= */

export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

/* ================= CATEGORIES ================= */

export const getCategories = () => API.get("/categories");
export const addCategory = (data) => API.post("/categories/add", data);
export const updateCategory = (id, data) =>
  API.put(`/categories/update/${id}`, data);
export const deleteCategory = (id) =>
  API.delete(`/categories/delete/${id}`);

/* ================= USERS (ADMIN) ================= */

export const getUsers = () => API.get("/users");
export const updateUser = (id, data) =>
  API.put(`/users/update/${id}`, data);
export const deleteUser = (id) =>
  API.delete(`/users/delete/${id}`);

/* ================= PRODUCTS (FARMER) ================= */

export const addProduct = (data) => API.post("/products/add", data);
export const getProducts = () => API.get("/products");
export const deleteProduct = (id) =>
  API.delete(`/products/delete/${id}`);

/* ================= ORDERS ================= */

export const placeOrder = (data) => API.post("/orders/add", data);
export const getOrders = () => API.get("/orders");

/* ================= ARTICLES ================= */

export const addArticle = (data) => API.post("/articles/add", data);
export const getArticles = () => API.get("/articles");

/* ================= JOBS ================= */

export const addJobPost = (data) => API.post("/jobs/add", data);
export const getJobs = () => API.get("/jobs");
