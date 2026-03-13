export interface Company {
  id: string;
  businessName: string;
  legalName: string | null;
  identificationNumber: string;
  phone: string | null;
  email: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  logoUrl: string | null;
  onboardingCompleted: boolean;
  isActive: boolean;
  createdAt: string;
  tenantId: string;
  businessTypeName: string;
}

export interface CompanyDetail extends Company {
  userCount: number;
}
