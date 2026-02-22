import api from "./api";

// 1. Stats cards — confirmed / pending / cancelled / rescheduled + % vs last week
export const getDashboardStats = () => api.get("/dashboard/stats");

// 2. Appointment Monitoring table — paginated list with doctor name + initials
export const getDashboardAppointments = (params = {}) =>
    api.get("/dashboard/appointments", { params });

// 3. Weekly trend chart — count per day Mon → Sun
export const getAppointmentTrend = () => api.get("/dashboard/trend");

// 4. Real-time activity feed — recent confirmed / cancelled / rescheduled
export const getRealtimeActivity = (limit = 10) =>
    api.get("/dashboard/activity", { params: { limit } });
