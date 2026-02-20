import axios from "axios";

/* ================= AXIOS INSTANCE ================= */

const API = axios.create({
  baseURL: "http://localhost:3003/api", // ✅ FIXED BASE URL
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= ATTACH USER ID ================= */

API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.id) {
      config.headers["x-user-id"] = user.id;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= AUTH ================= */

export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const forgotPassword = (data) =>
  API.post("/auth/forgot-password", data);

/* ================= USERS ================= */

export const getUsers = () => API.get("/admin/users"); // matches backend route

export const updateUser = (id, data) =>
  API.put(`/users/update/${id}`, data);

export const deleteUser = (id) =>
  API.delete(`/users/delete/${id}`);

/* ================= CATEGORIES ================= */

export const getCategories = () => API.get("/categories");
export const addCategory = (data) => API.post("/categories/add", data);
export const updateCategory = (id, data) =>
  API.put(`/categories/update/${id}`, data);
export const deleteCategory = (id) =>
  API.delete(`/categories/delete/${id}`);

/* ================= PRODUCTS ================= */

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

export default API;
