import api from "./api";

// ADMIN signup + OTP
export const adminSignup = (payload) => api.post("/auth/signup", payload);
export const verifyOtp = (payload) => api.post("/auth/verify-otp", payload);

// ADMIN login
export const adminLogin = (payload) => api.post("/auth/login", payload);

// STAFF login
export const staffLogin = (payload) => api.post("/staff-auth/login", payload);

// GET current user
export const getMe = () => api.get("/auth/me");
