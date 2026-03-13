import { apiClient } from "./api-client.ts";
import type { User, CreateUserInput, CreatedUser } from "@/types/user.ts";
import type { PagedResponse, PaginationParams } from "@/types/pagination.ts";

export async function getUsers(
  params: PaginationParams,
): Promise<PagedResponse<User>> {
  const response = await apiClient.get<PagedResponse<User>>(
    "/api/v1/admin/users",
    { params },
  );
  return response.data;
}

export async function createUser(
  input: CreateUserInput,
): Promise<CreatedUser> {
  const response = await apiClient.post<CreatedUser>(
    "/api/v1/admin/users",
    input,
  );
  return response.data;
}

export async function toggleUserStatus(id: string): Promise<void> {
  await apiClient.patch(`/api/v1/admin/users/${id}/toggle-status`);
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/admin/users/${id}`);
}
