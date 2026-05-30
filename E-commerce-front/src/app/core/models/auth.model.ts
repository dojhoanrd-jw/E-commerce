export type UserRole = 'Admin' | 'Seller' | 'Buyer';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface CurrentUser {
  name: string;
  email: string;
  role: UserRole;
}
