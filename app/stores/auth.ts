/**
 * Auth Store - Pinia Store for Authentication State
 * 
 * Manages user authentication state using the mock auth service.
 * NOTE: This uses localStorage for simulation. Real auth will use backend APIs.
 */

import { defineStore } from 'pinia'
import type { AuthState, LoginCredentials, RegisterData, User } from '~/types/auth'
import * as authService from '~/services/mockAuth'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }),

  getters: {
    currentUser: (state): User | null => state.user,
    userBalance: (state): number => state.user?.balance ?? 0,
    username: (state): string => state.user?.username ?? '',
    isLoggedIn: (state): boolean => state.isAuthenticated,
  },

  actions: {
    /**
     * Initializes auth state from localStorage
     */
    async initialize() {
      this.isLoading = true
      try {
        const storedUser = authService.getStoredSession()
        if (storedUser) {
          this.user = storedUser
          this.isAuthenticated = true
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Registers a new user
     */
    async register(data: RegisterData) {
      this.isLoading = true
      this.error = null

      try {
        const response = await authService.register(data)

        if (response.success && response.user) {
          this.user = response.user
          this.isAuthenticated = true
          return { success: true }
        }

        this.error = response.error ?? 'Erro ao criar conta'
        return { success: false, error: this.error }
      } catch (error) {
        this.error = 'Erro inesperado ao criar conta'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Logs in a user
     */
    async login(credentials: LoginCredentials) {
      this.isLoading = true
      this.error = null

      try {
        const response = await authService.login(credentials)

        if (response.success && response.user) {
          this.user = response.user
          this.isAuthenticated = true
          return { success: true }
        }

        this.error = response.error ?? 'Erro ao fazer login'
        return { success: false, error: this.error }
      } catch (error) {
        this.error = 'Erro inesperado ao fazer login'
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Logs out the current user
     */
    async logout() {
      this.isLoading = true

      try {
        await authService.logout()
        this.user = null
        this.isAuthenticated = false
        this.error = null
      } catch (error) {
        console.error('Failed to logout:', error)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Updates user balance (for betting)
     */
    updateBalance(amount: number) {
      if (!this.user) return false

      const newBalance = this.user.balance + amount
      if (newBalance < 0) {
        this.error = 'Saldo insuficiente'
        return false
      }

      const updatedUser = authService.updateBalance(this.user.id, newBalance)
      if (updatedUser) {
        this.user = updatedUser
        return true
      }

      return false
    },

    /**
     * Clears any error messages
     */
    clearError() {
      this.error = null
    },
  },
})
