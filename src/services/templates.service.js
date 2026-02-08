import api from "./api";

export const getTemplates = () => api.get("/templates");
export const createTemplate = (payload) => api.post("/templates", payload);
export const updateTemplate = (id, payload) => api.put(`/templates/${id}`, payload);
export const deleteTemplate = (id) => api.delete(`/templates/${id}`);
