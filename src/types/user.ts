export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: string;
  tenantId: string;
  companyName: string | null;
}

export interface CreateUserInput {
  name: string;
  email: string;
  phone: string;
  role: "Admin" | "Cashier";
  tenantId: string;
}

export interface CreatedUser extends User {
  temporaryPassword: string;
}
