import { useState } from "react";
import { useNavigate } from "react-router";

import {
  useCompanies,
  useToggleCompanyStatus,
} from "@/hooks/queries/use-companies.ts";
import { Header } from "@/components/layout/Header.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { Badge } from "@/components/ui/Badge.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { Spinner } from "@/components/ui/Spinner.tsx";
import { Pagination } from "@/components/ui/Pagination.tsx";
import { SearchInput } from "@/components/ui/SearchInput.tsx";
import { formatDate } from "@/lib/utils.ts";

export function CompaniesPage() {
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useCompanies({
    pageNumber,
    pageSize: 10,
    search: search || undefined,
  });
  const toggleStatus = useToggleCompanyStatus();

  function handleSearch(value: string) {
    setSearch(value);
    setPageNumber(1);
  }

  return (
    <>
      <Header title="Empresas" />

      <div className="p-6 space-y-4">
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="Buscar por nombre, NIT o ciudad..."
          className="max-w-sm"
        />

        <Card className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Spinner className="h-6 w-6" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="p-4 font-medium">Nombre</th>
                      <th className="p-4 font-medium">NIT</th>
                      <th className="p-4 font-medium hidden md:table-cell">Ciudad</th>
                      <th className="p-4 font-medium hidden md:table-cell">Tipo</th>
                      <th className="p-4 font-medium">Estado</th>
                      <th className="p-4 font-medium hidden md:table-cell">Creada</th>
                      <th className="p-4 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data.map((company) => (
                      <tr
                        key={company.id}
                        className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/companies/${company.id}`)}
                      >
                        <td className="p-4 font-medium">
                          {company.businessName}
                        </td>
                        <td className="p-4">
                          {company.identificationNumber}
                        </td>
                        <td className="p-4 hidden md:table-cell">{company.city ?? "—"}</td>
                        <td className="p-4 hidden md:table-cell">{company.businessTypeName}</td>
                        <td className="p-4">
                          <Badge
                            variant={company.isActive ? "success" : "danger"}
                          >
                            {company.isActive ? "Activa" : "Inactiva"}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">
                          {formatDate(company.createdAt)}
                        </td>
                        <td className="p-4">
                          <Button
                            variant={company.isActive ? "outline" : "primary"}
                            size="sm"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleStatus.mutate(company.id);
                            }}
                            disabled={toggleStatus.isPending}
                          >
                            {company.isActive ? "Desactivar" : "Activar"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {data?.data.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-8 text-center text-muted-foreground"
                        >
                          No se encontraron empresas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {data && (
                <Pagination meta={data.meta} onPageChange={setPageNumber} />
              )}
            </>
          )}
        </Card>
      </div>
    </>
  );
}
