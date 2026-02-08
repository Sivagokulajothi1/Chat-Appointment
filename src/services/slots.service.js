import api from "./api";

export const generateSlots = (payload) => api.post("/slots/generate", payload);
export const regenerateSlots = (payload) => api.post("/slots/regenerate", payload);

export const getAvailableSlots = ({ doctorId, date }) =>
  api.get("/slots/available", { params: { doctorId, date } });
