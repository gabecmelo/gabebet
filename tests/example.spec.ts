import { expect, test } from '@nuxt/test-utils/playwright'

/**
 * GabeBet E2E Tests
 * 
 * Tests critical user journeys:
 * - Registration
 * - Login
 * - Placing bets
 * - Viewing history
 */

test.describe('Home Page', () => {
  test('should display the home page correctly', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    await expect(page).toHaveTitle(/GabeBet/)
    await expect(page.locator('text=Bem-vindo ao')).toBeVisible()
    await expect(page.locator('text=GabeBet')).toBeVisible()
  })

  test('should show login/register buttons when not authenticated', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    await expect(page.locator('text=Entrar')).toBeVisible()
    await expect(page.locator('text=Cadastrar')).toBeVisible()
  })

  test('should display featured games', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    await expect(page.locator('text=Jogos em Destaque')).toBeVisible()
    await expect(page.locator('text=Dados')).toBeVisible()
  })
})

test.describe('Registration Flow', () => {
  test('should navigate to registration page', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    await page.click('text=Cadastrar')
    await expect(page).toHaveURL(/register/)
    await expect(page.locator('text=Criar Conta')).toBeVisible()
  })

  test('should register a new user successfully', async ({ page, goto }) => {
    await goto('/register', { waitUntil: 'hydration' })
    
    // Fill registration form
    const timestamp = Date.now()
    await page.fill('input[placeholder="jogador123"]', `testuser${timestamp}`)
    await page.fill('input[placeholder="seu@email.com"]', `test${timestamp}@email.com`)
    await page.fill('input[placeholder="••••••••"]', 'password123')
    
    // Find confirm password field (second password input)
    const passwordFields = page.locator('input[type="password"]')
    await passwordFields.nth(1).fill('password123')
    
    // Submit form
    await page.click('button:has-text("Criar Conta")')
    
    // Should redirect to home and show user is logged in
    await expect(page).toHaveURL('/', { timeout: 10000 })
    await expect(page.locator('text=R$')).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Login Flow', () => {
  test('should navigate to login page', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    await page.click('a:has-text("Entrar")')
    await expect(page).toHaveURL(/login/)
    await expect(page.locator('text=Entrar no GabeBet')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page, goto }) => {
    await goto('/login', { waitUntil: 'hydration' })
    
    await page.fill('input[placeholder="seu@email.com"]', 'invalid@email.com')
    await page.fill('input[placeholder="••••••••"]', 'wrongpassword')
    await page.click('button:has-text("Entrar")')
    
    // Should show error message
    await expect(page.locator('text=incorretos')).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Dice Game', () => {
  test('should require login to play', async ({ page, goto }) => {
    await goto('/games/dice', { waitUntil: 'hydration' })
    await expect(page.locator('text=Faça login para jogar')).toBeVisible()
  })

  test('should display game interface for logged in users', async ({ page, goto }) => {
    // First register a user
    await goto('/register', { waitUntil: 'hydration' })
    
    const timestamp = Date.now()
    await page.fill('input[placeholder="jogador123"]', `diceuser${timestamp}`)
    await page.fill('input[placeholder="seu@email.com"]', `dice${timestamp}@email.com`)
    const passwordFields = page.locator('input[type="password"]')
    await passwordFields.nth(0).fill('password123')
    await passwordFields.nth(1).fill('password123')
    await page.click('button:has-text("Criar Conta")')
    
    // Wait for redirect
    await expect(page).toHaveURL('/', { timeout: 10000 })
    
    // Navigate to dice game
    await goto('/games/dice', { waitUntil: 'hydration' })
    
    // Should show game interface
    await expect(page.locator('text=Jogo de Dados')).toBeVisible()
    await expect(page.locator('text=Valor da Aposta')).toBeVisible()
    await expect(page.locator('text=Apostar')).toBeVisible()
  })
})

test.describe('Bet History', () => {
  test('should redirect to login when not authenticated', async ({ page, goto }) => {
    await goto('/history', { waitUntil: 'hydration' })
    // Should redirect to login
    await expect(page).toHaveURL(/login/, { timeout: 5000 })
  })
})

test.describe('Navigation', () => {
  test('should navigate using sidebar', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    
    // Click on Dados in sidebar
    await page.click('nav >> text=Dados')
    await expect(page).toHaveURL(/games\/dice/)
  })

  test('should toggle sidebar', async ({ page, goto }) => {
    await goto('/', { waitUntil: 'hydration' })
    
    // Sidebar should be open initially
    const sidebar = page.locator('aside')
    await expect(sidebar).toHaveClass(/w-64/)
    
    // Click toggle button
    await page.click('button[aria-label="Fechar menu"]')
    
    // Sidebar should be collapsed
    await expect(sidebar).toHaveClass(/w-20/)
  })
})

test.describe('Logout Flow', () => {
  test('should logout and redirect to home page', async ({ page, goto }) => {
    // First register and login a user
    await goto('/register', { waitUntil: 'hydration' })
    
    const timestamp = Date.now()
    await page.fill('input[placeholder="jogador123"]', `logoutuser${timestamp}`)
    await page.fill('input[placeholder="seu@email.com"]', `logout${timestamp}@email.com`)
    const passwordFields = page.locator('input[type="password"]')
    await passwordFields.nth(0).fill('password123')
    await passwordFields.nth(1).fill('password123')
    await page.click('button:has-text("Criar Conta")')
    
    // Wait for redirect to home
    await expect(page).toHaveURL('/', { timeout: 10000 })
    
    // Verify user is logged in (balance is visible)
    await expect(page.locator('text=R$')).toBeVisible({ timeout: 5000 })
    
    // Click on user menu dropdown
    const userMenuButton = page.locator('header').locator('button:has(div.bg-gradient-to-br)')
    await userMenuButton.click()
    
    // Click on "Sair" (logout)
    await page.click('text=Sair')
    
    // Should redirect to home page
    await expect(page).toHaveURL('/', { timeout: 10000 })
    
    // Verify "Entrar" button is visible again (user is logged out)
    await expect(page.locator('header >> text=Entrar')).toBeVisible({ timeout: 5000 })
  })

  test('should logout from mobile menu', async ({ page, goto }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // First register and login a user
    await goto('/register', { waitUntil: 'hydration' })
    
    const timestamp = Date.now()
    await page.fill('input[placeholder="jogador123"]', `mobilelogout${timestamp}`)
    await page.fill('input[placeholder="seu@email.com"]', `mobilelogout${timestamp}@email.com`)
    const passwordFields = page.locator('input[type="password"]')
    await passwordFields.nth(0).fill('password123')
    await passwordFields.nth(1).fill('password123')
    await page.click('button:has-text("Criar Conta")')
    
    // Wait for redirect to home
    await expect(page).toHaveURL('/', { timeout: 10000 })
    
    // Open mobile menu (hamburger)
    await page.click('button[aria-label="Abrir menu"]')
    
    // Click on "Sair" (logout) in mobile menu
    await page.click('button:has-text("Sair")')
    
    // Should redirect to home page
    await expect(page).toHaveURL('/', { timeout: 10000 })
    
    // Open mobile menu again to verify logged out state
    await page.click('button[aria-label="Abrir menu"]')
    
    // Verify "Entrar" button is visible in mobile menu
    await expect(page.locator('text=Entrar')).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Layout Overflow', () => {
  test('should not have horizontal overflow on desktop with sidebar expanded', async ({ page, goto }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 })
    
    await goto('/games/dice', { waitUntil: 'hydration' })
    
    // Wait for layout to render
    await page.waitForTimeout(500)
    
    // Check that main content doesn't exceed viewport
    const mainContent = page.locator('main')
    const mainRect = await mainContent.boundingBox()
    
    expect(mainRect).not.toBeNull()
    if (mainRect) {
      expect(mainRect.x + mainRect.width).toBeLessThanOrEqual(1280)
    }
    
    // Check header doesn't overflow
    const header = page.locator('header').first()
    const headerRect = await header.boundingBox()
    
    if (headerRect) {
      expect(headerRect.x + headerRect.width).toBeLessThanOrEqual(1280)
    }
  })

  test('should not have horizontal overflow on desktop with sidebar collapsed', async ({ page, goto }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    
    await goto('/games/dice', { waitUntil: 'hydration' })
    
    // Collapse sidebar
    await page.click('button[aria-label="Fechar menu"]')
    await page.waitForTimeout(500)
    
    // Check that main content doesn't exceed viewport
    const mainContent = page.locator('main')
    const mainRect = await mainContent.boundingBox()
    
    expect(mainRect).not.toBeNull()
    if (mainRect) {
      expect(mainRect.x + mainRect.width).toBeLessThanOrEqual(1280)
    }
  })

  test('should not have horizontal scrolling on dice game page', async ({ page, goto }) => {
    await page.setViewportSize({ width: 1024, height: 768 })
    
    await goto('/games/dice', { waitUntil: 'hydration' })
    
    // Check for horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    
    expect(hasHorizontalScroll).toBe(false)
  })

  test('should adapt content when sidebar toggles', async ({ page, goto }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    
    await goto('/', { waitUntil: 'hydration' })
    
    // Get initial main content width with sidebar open
    const mainContent = page.locator('main')
    const initialRect = await mainContent.boundingBox()
    
    // Collapse sidebar
    await page.click('button[aria-label="Fechar menu"]')
    await page.waitForTimeout(400)
    
    // Get new main content width
    const collapsedRect = await mainContent.boundingBox()
    
    expect(initialRect).not.toBeNull()
    expect(collapsedRect).not.toBeNull()
    
    if (initialRect && collapsedRect) {
      // Main content should be wider when sidebar is collapsed
      expect(collapsedRect.width).toBeGreaterThan(initialRect.width)
    }
  })

  test('should have centered content on mobile viewport', async ({ page, goto }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await goto('/', { waitUntil: 'hydration' })
    await page.waitForTimeout(500)
    
    // Get the main content inner container (max-w-7xl mx-auto)
    const contentContainer = page.locator('main > div')
    const containerRect = await contentContainer.boundingBox()
    
    expect(containerRect).not.toBeNull()
    if (containerRect) {
      // Check that left margin is approximately equal to right margin (centered)
      const leftMargin = containerRect.x
      const rightMargin = 375 - (containerRect.x + containerRect.width)
      
      // Allow 20px tolerance for padding differences
      expect(Math.abs(leftMargin - rightMargin)).toBeLessThanOrEqual(20)
    }
  })

  test('should have centered login overlay on dice game mobile', async ({ page, goto }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    await goto('/games/dice', { waitUntil: 'hydration' })
    await page.waitForTimeout(500)
    
    // Find the "Faça login para jogar" overlay
    const overlay = page.locator('text=Faça login para jogar').locator('..')
    const overlayRect = await overlay.boundingBox()
    
    expect(overlayRect).not.toBeNull()
    if (overlayRect) {
      // Check centering
      const leftMargin = overlayRect.x
      const rightMargin = 375 - (overlayRect.x + overlayRect.width)
      
      // Should be approximately centered (within 30px)
      expect(Math.abs(leftMargin - rightMargin)).toBeLessThanOrEqual(30)
    }
  })

  test('should have no horizontal overflow on mobile home page', async ({ page, goto }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    await goto('/', { waitUntil: 'hydration' })
    
    // Check for horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    
    expect(hasHorizontalScroll).toBe(false)
  })
})
