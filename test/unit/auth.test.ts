import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../app/stores/auth'
import * as authService from '../../app/services/mockAuth'

// Mock the auth service
vi.mock('../../app/services/mockAuth', () => ({
  getStoredSession: vi.fn(),
  register: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  updateBalance: vi.fn(),
}))

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('logout', () => {
    it('should clear user data and set isAuthenticated to false', async () => {
      // Setup: Create store with authenticated user
      const store = useAuthStore()
      store.user = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        balance: 1000,
        createdAt: new Date(),
      }
      store.isAuthenticated = true

      // Mock logout service
      vi.mocked(authService.logout).mockResolvedValue()

      // Act
      await store.logout()

      // Assert
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.error).toBeNull()
      expect(authService.logout).toHaveBeenCalled()
    })

    it('should return success true when logout is successful', async () => {
      const store = useAuthStore()
      store.user = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        balance: 1000,
        createdAt: new Date(),
      }
      store.isAuthenticated = true

      vi.mocked(authService.logout).mockResolvedValue()

      const result = await store.logout()

      expect(result).toEqual({ success: true })
    })

    it('should handle logout errors gracefully', async () => {
      const store = useAuthStore()
      store.user = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        balance: 1000,
        createdAt: new Date(),
      }
      store.isAuthenticated = true

      // Mock logout to throw error
      vi.mocked(authService.logout).mockRejectedValue(new Error('Network error'))

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await store.logout()

      // Should not throw, just log error and return failure
      expect(consoleSpy).toHaveBeenCalled()
      expect(result).toEqual({ success: false })
      consoleSpy.mockRestore()
    })

    it('should set isLoading to false after logout completes', async () => {
      const store = useAuthStore()
      store.user = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        balance: 1000,
        createdAt: new Date(),
      }
      store.isAuthenticated = true

      vi.mocked(authService.logout).mockResolvedValue()

      await store.logout()

      expect(store.isLoading).toBe(false)
    })
  })

  describe('getters', () => {
    it('isLoggedIn should return false when user is not authenticated', () => {
      const store = useAuthStore()
      expect(store.isLoggedIn).toBe(false)
    })

    it('isLoggedIn should return true when user is authenticated', () => {
      const store = useAuthStore()
      store.isAuthenticated = true
      expect(store.isLoggedIn).toBe(true)
    })

    it('userBalance should return 0 when no user', () => {
      const store = useAuthStore()
      expect(store.userBalance).toBe(0)
    })

    it('userBalance should return user balance when authenticated', () => {
      const store = useAuthStore()
      store.user = {
        id: 'test-user-id',
        username: 'testuser',
        email: 'test@example.com',
        balance: 500,
        createdAt: new Date(),
      }
      expect(store.userBalance).toBe(500)
    })
  })
})
