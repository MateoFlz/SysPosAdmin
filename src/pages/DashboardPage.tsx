import { useNavigate } from "react-router";
import {
  Building2,
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

import { useDashboard } from "@/hooks/queries/use-dashboard.ts";
import { Header } from "@/components/layout/Header.tsx";
import { Card } from "@/components/ui/Card.tsx";
import { Badge } from "@/components/ui/Badge.tsx";
import { Spinner } from "@/components/ui/Spinner.tsx";
import { formatDate } from "@/lib/utils.ts";
import { cn } from "@/lib/utils.ts";

function ProgressBar({
  value,
  max,
  className,
}: {
  value: number;
  max: number;
  className?: string;
}) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className={cn("h-2 w-full rounded-full bg-muted", className)}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

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

  const companyPercent =
    data.totalCompanies > 0
      ? Math.round((data.activeCompanies / data.totalCompanies) * 100)
      : 0;
  const userPercent =
    data.totalUsers > 0
      ? Math.round((data.activeUsers / data.totalUsers) * 100)
      : 0;

  return (
    <>
      <Header title="Dashboard" />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Empresas
                </p>
                <p className="mt-1 text-3xl font-bold tracking-tight">
                  {data.totalCompanies}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              <span>
                <strong className="text-foreground">
                  {data.activeCompanies}
                </strong>{" "}
                activas
              </span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Empresas Activas
                </p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-green-600">
                  {companyPercent}%
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-3">
              <ProgressBar
                value={data.activeCompanies}
                max={data.totalCompanies}
                className="[&>div]:bg-green-500"
              />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Usuarios
                </p>
                <p className="mt-1 text-3xl font-bold tracking-tight">
                  {data.totalUsers}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              <span>
                <strong className="text-foreground">{data.activeUsers}</strong>{" "}
                activos
              </span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Usuarios Activos
                </p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-emerald-600">
                  {userPercent}%
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3">
              <ProgressBar
                value={data.activeUsers}
                max={data.totalUsers}
                className="[&>div]:bg-emerald-500"
              />
            </div>
          </Card>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Status breakdown */}
          <Card className="lg:col-span-2">
            <h3 className="text-base font-semibold mb-4">
              Resumen de estado
            </h3>
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm">Empresas activas</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {data.activeCompanies}
                  </span>
                </div>
                <ProgressBar
                  value={data.activeCompanies}
                  max={data.totalCompanies}
                  className="[&>div]:bg-green-500"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="text-sm">Empresas inactivas</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {data.inactiveCompanies}
                  </span>
                </div>
                <ProgressBar
                  value={data.inactiveCompanies}
                  max={data.totalCompanies}
                  className="[&>div]:bg-red-400"
                />
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-sm">Usuarios activos</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {data.activeUsers}
                  </span>
                </div>
                <ProgressBar
                  value={data.activeUsers}
                  max={data.totalUsers}
                  className="[&>div]:bg-emerald-500"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-orange-400" />
                    <span className="text-sm">Usuarios inactivos</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {data.inactiveUsers}
                  </span>
                </div>
                <ProgressBar
                  value={data.inactiveUsers}
                  max={data.totalUsers}
                  className="[&>div]:bg-orange-400"
                />
              </div>
            </div>
          </Card>

          {/* Recent companies */}
          <Card className="lg:col-span-3 p-0">
            <div className="flex items-center justify-between p-4 pb-0">
              <h3 className="text-base font-semibold">Empresas recientes</h3>
              <button
                onClick={() => navigate("/companies")}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline cursor-pointer"
              >
                Ver todas <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Nombre</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">
                      NIT
                    </th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">
                      Ciudad
                    </th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentCompanies.map((company) => (
                    <tr
                      key={company.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/companies/${company.id}`)}
                    >
                      <td className="px-4 py-3 font-medium">
                        {company.businessName}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {company.identificationNumber}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {company.city ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={company.isActive ? "success" : "danger"}
                        >
                          {company.isActive ? "Activa" : "Inactiva"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
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
      </div>
    </>
  );
}
