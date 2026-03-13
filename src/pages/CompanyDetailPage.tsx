import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

import {
  useCompany,
  useCompanyUsers,
  useToggleCompanyStatus,
} from "@/hooks/queries/use-companies.ts";
import { useToggleUserStatus } from "@/hooks/queries/use-users.ts";
import { Header } from "@/components/layout/Header.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { Badge } from "@/components/ui/Badge.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { Spinner } from "@/components/ui/Spinner.tsx";
import { Pagination } from "@/components/ui/Pagination.tsx";
import { formatDate } from "@/lib/utils.ts";

export function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState(1);

  const { data: company, isLoading: loadingCompany } = useCompany(id!);
  const { data: usersData, isLoading: loadingUsers } = useCompanyUsers(id!, {
    pageNumber,
    pageSize: 10,
  });
  const toggleCompany = useToggleCompanyStatus();
  const toggleUser = useToggleUserStatus();

  if (loadingCompany || !company) {
    return (
      <>
        <Header title="Detalle de empresa" />
        <div className="flex items-center justify-center p-12">
          <Spinner className="h-8 w-8" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Detalle de empresa">
        <Button variant="ghost" size="sm" onClick={() => navigate("/companies")}>
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </Header>

      <div className="p-6 space-y-6">
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">{company.businessName}</h3>
              {company.legalName && (
                <p className="text-sm text-muted-foreground">
                  {company.legalName}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={company.isActive ? "success" : "danger"}>
                {company.isActive ? "Activa" : "Inactiva"}
              </Badge>
              <Button
                variant={company.isActive ? "outline" : "primary"}
                size="sm"
                onClick={() => toggleCompany.mutate(company.id)}
                disabled={toggleCompany.isPending}
              >
                {company.isActive ? "Desactivar" : "Activar"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="NIT" value={company.identificationNumber} />
            <InfoItem label="Tipo de negocio" value={company.businessTypeName} />
            <InfoItem label="Email" value={company.email} />
            <InfoItem label="Teléfono" value={company.phone} />
            <InfoItem label="Ciudad" value={company.city} />
            <InfoItem label="País" value={company.country} />
            <InfoItem label="Usuarios" value={String(company.userCount)} />
            <InfoItem
              label="Onboarding"
              value={company.onboardingCompleted ? "Completado" : "Pendiente"}
            />
            <InfoItem label="Creada" value={formatDate(company.createdAt)} />
          </div>
        </Card>

        <Card className="p-0">
          <div className="p-4 border-b border-border">
            <h3 className="text-base font-semibold">Usuarios de la empresa</h3>
          </div>

          {loadingUsers ? (
            <div className="flex items-center justify-center p-8">
              <Spinner className="h-6 w-6" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="p-4 font-medium">Nombre</th>
                      <th className="p-4 font-medium">Email</th>
                      <th className="p-4 font-medium">Rol</th>
                      <th className="p-4 font-medium">Estado</th>
                      <th className="p-4 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData?.data.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="p-4 font-medium">{user.name}</td>
                        <td className="p-4">{user.email}</td>
                        <td className="p-4">
                          <Badge variant="muted">{user.role}</Badge>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={user.isActive ? "success" : "danger"}
                          >
                            {user.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button
                            variant={user.isActive ? "outline" : "primary"}
                            size="sm"
                            onClick={() => toggleUser.mutate(user.id)}
                            disabled={toggleUser.isPending}
                          >
                            {user.isActive ? "Desactivar" : "Activar"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {usersData?.data.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="p-8 text-center text-muted-foreground"
                        >
                          No hay usuarios
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {usersData && (
                <Pagination
                  meta={usersData.meta}
                  onPageChange={setPageNumber}
                />
              )}
            </>
          )}
        </Card>
      </div>
    </>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value ?? "—"}</p>
    </div>
  );
}
