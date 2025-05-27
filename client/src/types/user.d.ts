export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Should not be sent from backend, but included for fake API
  token?: string; // JWT token
}
