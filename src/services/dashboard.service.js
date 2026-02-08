import api from "./api";

export const getDashboardSummary = (params) =>
  api.get("/dashboard/summary", { params });
