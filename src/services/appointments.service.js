import api from "./api";

export const bookAppointment = (payload) => api.post("/appointments/book", payload);

export const confirmAppointment = (id) => api.post(`/appointments/${id}/confirm`);
export const cancelAppointment = (id, payload) => api.post(`/appointments/${id}/cancel`, payload);
export const rescheduleAppointment = (id, payload) =>
  api.post(`/appointments/${id}/reschedule`, payload);

export const getAppointments = (filters) => api.get("/appointments", { params: filters });
export const getAppointmentById = (id) => api.get(`/appointments/${id}`);
