import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getCompanies,
  getCompany,
  toggleCompanyStatus,
  getCompanyUsers,
} from "@/services/companies.service.ts";
import type { PaginationParams } from "@/types/pagination.ts";

export function useCompanies(params: PaginationParams) {
  return useQuery({
    queryKey: ["companies", params],
    queryFn: () => getCompanies(params),
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: ["company", id],
    queryFn: () => getCompany(id),
    enabled: !!id,
  });
}

export function useCompanyUsers(companyId: string, params: PaginationParams) {
  return useQuery({
    queryKey: ["company-users", companyId, params],
    queryFn: () => getCompanyUsers(companyId, params),
    enabled: !!companyId,
  });
}

export function useToggleCompanyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleCompanyStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      queryClient.invalidateQueries({ queryKey: ["company"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
