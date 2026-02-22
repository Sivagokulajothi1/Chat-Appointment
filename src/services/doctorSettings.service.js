import api from "./api";

/**
 * 1) Get DOCTOR only from staff table (for dropdown)
 * GET /api/doctor-settings/doctors
 */
export const getDoctorsOnly = () => api.get("/doctor-settings/doctors");

/**
 * 2) List doctor management table (join staff + settings)
 * GET /api/doctor-settings
 */
export const getDoctorSettingsList = () => api.get("/doctor-settings");

/**
 * 3) Create doctor settings
 * POST /api/doctor-settings
 */
export const createDoctorSettings = (payload) =>
    api.post("/doctor-settings", payload);

/**
 * 4) Update doctor settings
 * PUT /api/doctor-settings/:id
 */
export const updateDoctorSettings = (id, payload) =>
    api.put(`/doctor-settings/${id}`, payload);

/**
 * 5) Delete doctor settings
 * DELETE /api/doctor-settings/:id
 */
export const deleteDoctorSettings = (id) =>
    api.delete(`/doctor-settings/${id}`);