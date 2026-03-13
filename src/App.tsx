import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "@/context/AuthContext.tsx";
import { AuthGuard } from "@/components/guards/AuthGuard.tsx";
import { AppLayout } from "@/components/layout/AppLayout.tsx";
import { LoginPage } from "@/pages/LoginPage.tsx";
import { DashboardPage } from "@/pages/DashboardPage.tsx";
import { CompaniesPage } from "@/pages/CompaniesPage.tsx";
import { CompanyDetailPage } from "@/pages/CompanyDetailPage.tsx";
import { UsersPage } from "@/pages/UsersPage.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              element={
                <AuthGuard>
                  <AppLayout />
                </AuthGuard>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="companies" element={<CompaniesPage />} />
              <Route path="companies/:id" element={<CompanyDetailPage />} />
              <Route path="users" element={<UsersPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
