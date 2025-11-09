export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  preferences?: {
    language: string;
    notifications: boolean;
  };
}

export interface MeSummary {
  user: User;
  stats?: {
    totalOrders?: number;
    totalDeliveries?: number;
    totalRentals?: number;
    balance?: number;
  };
}
