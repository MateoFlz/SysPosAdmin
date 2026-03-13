import { apiClient } from "./api-client.ts";
import type { DashboardStats } from "@/types/dashboard.ts";

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiClient.get<DashboardStats>(
    "/api/v1/admin/dashboard",
  );
  return response.data;
}
