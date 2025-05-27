// src/types/user.d.ts
// Re-export or extend types from api/types if needed.
export interface User {
  id: string;
  name: string;
  email: string;
  // password?: string; // Should not be in frontend types for fetched user
  token?: string; // Only for client-side use after login
  // You might add roles, address, etc.
  // role?: 'user' | 'admin';
  // address?: string;
}
