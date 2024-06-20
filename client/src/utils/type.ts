// User type
export interface User {
  id: string;
  name: string;
  email: string;
  token: string; // JWT token
}

// Login request type
export interface LoginRequest {
  email: string;
  password: string;
}

// Login response type
export interface LoginResponse {
  user: User;
  token: string;
}
