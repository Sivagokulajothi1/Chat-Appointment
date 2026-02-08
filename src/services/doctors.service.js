import api from "./api";

export const getDoctors = () => api.get("/doctors");
export const createDoctor = (payload) => api.post("/doctors", payload);
export const updateDoctor = (id, payload) => api.put(`/doctors/${id}`, payload);
export const deleteDoctor = (id) => api.delete(`/doctors/${id}`);
