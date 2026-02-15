import api from "./api";

export const getStaff = async () => {
  const response = await api.get("/staff");
  return response.data;
}; 
export const createStaff = (payload) => api.post("/staff/create", payload);
export const updateStaff = async (id, data) => {
  const response = await api.put(`/staff/${id}`, data);
  return response.data;
};

export const deleteStaff = (id) => api.delete(`/staff/delete/${id}`);
