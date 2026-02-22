import api from "./api";


// Doctor weekly schedule
export const getDoctorSchedule = (doctorId) =>
  doctorId ? api.get(`/slots/${doctorId}`) : api.get('/slots');

export const createDoctorSchedule = (doctor_id) =>
  api.post('/slots', { doctor_id });

export const saveWeekSchedule = (doctorId, week) =>
  api.put(`/slots/${doctorId}/week`, { week });
