import api from "./api";

export const setWorkingHours = (payload) => api.post("/working-hours/set", payload);
export const getWorkingHours = (doctorId) => api.get(`/working-hours/${doctorId}`);
