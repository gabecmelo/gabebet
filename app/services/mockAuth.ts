/**
 * Mock Authentication Service
 * 
 * This service simulates authentication using localStorage.
 * NOTE: This is for UI/UX demonstration only. Real authentication
 * will be handled by the backend.
 */

import type { User, LoginCredentials, RegisterData, AuthResponse } from '~/types/auth'

const STORAGE_KEY = 'gabebet_users'
const SESSION_KEY = 'gabebet_session'
const INITIAL_BALANCE = 1000 // R$ 1000 de saldo inicial

/**
 * Generates a unique ID
 */
function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Gets all users from localStorage
 */
function getStoredUsers(): Map<string, User & { password: string }> {
  if (typeof window === 'undefined') return new Map()
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return new Map()
    return new Map(JSON.parse(data))
  } catch {
    return new Map()
  }
}

/**
 * Saves users to localStorage
 */
function saveUsers(users: Map<string, User & { password: string }>): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...users]))
}

/**
 * Gets current session from localStorage
 */
export function getStoredSession(): User | null {
  if (typeof window === 'undefined') return null
  
  try {
    const data = localStorage.getItem(SESSION_KEY)
    if (!data) return null
    return JSON.parse(data)
  } catch {
    return null
  }
}

/**
 * Saves session to localStorage
 */
function saveSession(user: User | null): void {
  if (typeof window === 'undefined') return
  
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates password strength
 */
function isValidPassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 6) {
    return { valid: false, error: 'A senha deve ter pelo menos 6 caracteres' }
  }
  return { valid: true }
}

/**
 * Registers a new user
 */
export async function register(data: RegisterData): Promise<AuthResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const { email, username, password, confirmPassword } = data

  // Validate email
  if (!isValidEmail(email)) {
    return { success: false, error: 'E-mail inválido' }
  }

  // Validate username
  if (username.length < 3) {
    return { success: false, error: 'O nome de usuário deve ter pelo menos 3 caracteres' }
  }

  // Validate password
  const passwordValidation = isValidPassword(password)
  if (!passwordValidation.valid) {
    return { success: false, error: passwordValidation.error }
  }

  // Check password confirmation
  if (password !== confirmPassword) {
    return { success: false, error: 'As senhas não coincidem' }
  }

  const users = getStoredUsers()

  // Check if email already exists
  for (const [, user] of users) {
    if (user.email === email) {
      return { success: false, error: 'Este e-mail já está cadastrado' }
    }
    if (user.username === username) {
      return { success: false, error: 'Este nome de usuário já existe' }
    }
  }

  // Create new user
  const newUser: User & { password: string } = {
    id: generateId(),
    email,
    username,
    password, // In production, this would be hashed
    balance: INITIAL_BALANCE,
    createdAt: new Date().toISOString(),
  }

  users.set(newUser.id, newUser)
  saveUsers(users)

  // Create user without password for session
  const { password: _, ...userWithoutPassword } = newUser
  saveSession(userWithoutPassword)

  return { success: true, user: userWithoutPassword }
}

/**
 * Logs in a user
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const { email, password } = credentials

  if (!email || !password) {
    return { success: false, error: 'E-mail e senha são obrigatórios' }
  }

  const users = getStoredUsers()

  for (const [, user] of users) {
    if (user.email === email && user.password === password) {
      const { password: _, ...userWithoutPassword } = user
      saveSession(userWithoutPassword)
      return { success: true, user: userWithoutPassword }
    }
  }

  return { success: false, error: 'E-mail ou senha incorretos' }
}

/**
 * Logs out the current user
 */
export async function logout(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200))
  saveSession(null)
}

/**
 * Updates user balance
 */
export function updateBalance(userId: string, newBalance: number): User | null {
  const users = getStoredUsers()
  const user = users.get(userId)

  if (!user) return null

  user.balance = Math.max(0, Math.round(newBalance * 100) / 100)
  users.set(userId, user)
  saveUsers(users)

  const { password: _, ...userWithoutPassword } = user
  saveSession(userWithoutPassword)

  return userWithoutPassword
}

/**
 * Gets user by ID
 */
export function getUserById(userId: string): User | null {
  const users = getStoredUsers()
  const user = users.get(userId)

  if (!user) return null

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}
