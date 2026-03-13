import { apiClient } from "./api-client.ts";
import type { Company, CompanyDetail } from "@/types/company.ts";
import type { User } from "@/types/user.ts";
import type { PagedResponse, PaginationParams } from "@/types/pagination.ts";

export async function getCompanies(
  params: PaginationParams,
): Promise<PagedResponse<Company>> {
  const response = await apiClient.get<PagedResponse<Company>>(
    "/api/v1/admin/companies",
    { params },
  );
  return response.data;
}

export async function getCompany(id: string): Promise<CompanyDetail> {
  const response = await apiClient.get<CompanyDetail>(
    `/api/v1/admin/companies/${id}`,
  );
  return response.data;
}

export async function toggleCompanyStatus(id: string): Promise<void> {
  await apiClient.patch(`/api/v1/admin/companies/${id}/toggle-status`);
}

export async function getCompanyUsers(
  companyId: string,
  params: PaginationParams,
): Promise<PagedResponse<User>> {
  const response = await apiClient.get<PagedResponse<User>>(
    `/api/v1/admin/companies/${companyId}/users`,
    { params },
  );
  return response.data;
}
