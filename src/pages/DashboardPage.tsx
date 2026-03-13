import { useNavigate } from "react-router";
import { Building2, Users, CheckCircle } from "lucide-react";

import { useDashboard } from "@/hooks/queries/use-dashboard.ts";
import { Header } from "@/components/layout/Header.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { Badge } from "@/components/ui/Badge.tsx";
import { Spinner } from "@/components/ui/Spinner.tsx";
import { formatDate } from "@/lib/utils.ts";

export function DashboardPage() {
  const { data, isLoading } = useDashboard();
  const navigate = useNavigate();

  if (isLoading || !data) {
    return (
      <>
        <Header title="Dashboard" />
        <div className="flex items-center justify-center p-12">
          <Spinner className="h-8 w-8" />
        </div>
      </>
    );
  }

  const stats = [
    {
      label: "Total Empresas",
      value: data.totalCompanies,
      icon: Building2,
      color: "text-blue-600",
      background: "bg-blue-50",
    },
    {
      label: "Empresas Activas",
      value: data.activeCompanies,
      icon: CheckCircle,
      color: "text-green-600",
      background: "bg-green-50",
    },
    {
      label: "Total Usuarios",
      value: data.totalUsers,
      icon: Users,
      color: "text-purple-600",
      background: "bg-purple-50",
    },
    {
      label: "Usuarios Activos",
      value: data.activeUsers,
      icon: CheckCircle,
      color: "text-emerald-600",
      background: "bg-emerald-50",
    },
  ];

  return (
    <>
      <Header title="Dashboard" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.background}`}
                >
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <h3 className="mb-4 text-base font-semibold">Empresas recientes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-3 font-medium">Nombre</th>
                  <th className="pb-3 font-medium">NIT</th>
                  <th className="pb-3 font-medium">Ciudad</th>
                  <th className="pb-3 font-medium">Estado</th>
                  <th className="pb-3 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {data.recentCompanies.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/companies/${company.id}`)}
                  >
                    <td className="py-3 font-medium">
                      {company.businessName}
                    </td>
                    <td className="py-3">{company.identificationNumber}</td>
                    <td className="py-3">{company.city ?? "—"}</td>
                    <td className="py-3">
                      <Badge variant={company.isActive ? "success" : "danger"}>
                        {company.isActive ? "Activa" : "Inactiva"}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {formatDate(company.createdAt)}
                    </td>
                  </tr>
                ))}
                {data.recentCompanies.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No hay empresas registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
