/**
 * User and Authentication Types
 */

export interface User {
  id: string
  email: string
  username: string
  balance: number
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}
