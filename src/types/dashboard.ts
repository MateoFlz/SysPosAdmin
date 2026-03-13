export interface RecentCompany {
  id: string;
  businessName: string;
  identificationNumber: string;
  city: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalCompanies: number;
  activeCompanies: number;
  inactiveCompanies: number;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  recentCompanies: RecentCompany[];
}
