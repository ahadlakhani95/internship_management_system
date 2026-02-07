// api.js
import axios from "axios";

// Base URL of your backend
const API_BASE_URL = "https://internship-management-system-e8s1.onrender.com//api"; // change if deployed

// Create an axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token to headers if it exists in localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // store token in localStorage after login
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// ------------------ Auth API ------------------

// Register
export const registerUser = async (userData) => {
    return api.post("/auth/register", userData);
};

// Login
export const loginUser = async (credentials) => {
    return api.post("/auth/login", credentials);
};
// ------------------ Internship API ------------------

// Create a new internship (Company only)
export const createInternship = async (internshipData) => {
    return api.post("/internships", internshipData);
};
// Get all open internships (for students)
export const getAllInternships = async () => {
    return api.get("/internships");
};

// Get internships posted by logged-in company
export const getCompanyInternships = async () => {
    return api.get("/internships/company");
};

// Close an internship (Company only)
export const closeInternship = async (internshipId) => {
    return api.put(`/internships/${internshipId}/close`);
};


export default api;
