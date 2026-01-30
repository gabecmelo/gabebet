<script setup lang="ts">
/**
 * Default Layout Component
 * 
 * Main application layout with sidebar navigation and header.
 * UI text is in Portuguese (PT-BR).
 */

import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const route = useRoute()

// Initialize auth on mount (client-side only)
onMounted(async () => {
  await authStore.initialize()
})

// Navigation items
const navigationItems = [
  { name: 'Início', icon: 'i-lucide-home', path: '/' },
  { name: 'Dados', icon: 'i-lucide-dice-5', path: '/games/dice' },
  { name: 'Crash', icon: 'i-lucide-trending-up', path: '/games/crash', disabled: true },
  { name: 'Slots', icon: 'i-lucide-cherry', path: '/games/slots', disabled: true },
]

const bottomNavigationItems = [
  { name: 'Histórico', icon: 'i-lucide-history', path: '/history' },
  { name: 'Configurações', icon: 'i-lucide-settings', path: '/settings', disabled: true },
]

// Sidebar state
const isSidebarOpen = ref(true)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function isActiveRoute(path: string): boolean {
  return route.path === path
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white flex">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed left-0 top-0 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 z-40',
        isSidebarOpen ? 'w-64' : 'w-20'
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <span class="text-xl font-bold">G</span>
          </div>
          <span 
            v-if="isSidebarOpen" 
            class="text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent"
          >
            GabeBet
          </span>
        </NuxtLink>
        <button
          v-if="isSidebarOpen"
          class="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Fechar menu"
          @click="toggleSidebar"
        >
          <UIcon name="i-lucide-panel-left-close" class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-2">
        <p 
          v-if="isSidebarOpen" 
          class="text-xs uppercase text-gray-500 font-semibold mb-3 px-3"
        >
          Jogos
        </p>
        
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.path"
          :to="item.disabled ? '#' : item.path"
          :class="[
            'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
            isActiveRoute(item.path)
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'hover:bg-gray-800 text-gray-400 hover:text-white',
            item.disabled && 'opacity-50 cursor-not-allowed'
          ]"
          :aria-disabled="item.disabled"
        >
          <UIcon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span v-if="isSidebarOpen" class="font-medium">{{ item.name }}</span>
          <span
            v-if="isSidebarOpen && item.disabled"
            class="ml-auto text-xs bg-gray-700 px-2 py-0.5 rounded"
          >
            Em breve
          </span>
        </NuxtLink>
      </nav>

      <!-- Bottom Navigation -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <NuxtLink
          v-for="item in bottomNavigationItems"
          :key="item.path"
          :to="item.disabled ? '#' : item.path"
          :class="[
            'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 mb-2',
            isActiveRoute(item.path)
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'hover:bg-gray-800 text-gray-400 hover:text-white',
            item.disabled && 'opacity-50 cursor-not-allowed'
          ]"
        >
          <UIcon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
          <span v-if="isSidebarOpen" class="font-medium">{{ item.name }}</span>
        </NuxtLink>

        <!-- Simulated Session Badge -->
        <div
          v-if="isSidebarOpen"
          class="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl"
        >
          <p class="text-xs text-amber-400 font-medium flex items-center gap-2">
            <UIcon name="i-lucide-info" class="w-4 h-4" />
            Sessão Simulada
          </p>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div 
      :class="[
        'flex-1 transition-all duration-300',
        isSidebarOpen ? 'ml-64' : 'ml-20'
      ]"
    >
      <!-- Header -->
      <header class="h-16 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-30">
        <div class="flex items-center gap-4">
          <button
            v-if="!isSidebarOpen"
            class="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Abrir menu"
            @click="toggleSidebar"
          >
            <UIcon name="i-lucide-panel-left-open" class="w-5 h-5" />
          </button>
        </div>

        <!-- User Section -->
        <div class="flex items-center gap-4">
          <template v-if="authStore.isAuthenticated">
            <!-- Balance Display -->
            <div class="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-xl">
              <UIcon name="i-lucide-wallet" class="w-5 h-5 text-emerald-400" />
              <span class="font-semibold">
                R$ {{ authStore.userBalance.toFixed(2) }}
              </span>
            </div>

            <!-- User Menu -->
            <UDropdownMenu
              :items="[
                [
                  { label: authStore.username, type: 'label' as const },
                ],
                [
                  { label: 'Perfil', icon: 'i-lucide-user', disabled: true },
                  { label: 'Histórico', icon: 'i-lucide-history', to: '/history' },
                ],
                [
                  { label: 'Sair', icon: 'i-lucide-log-out', onSelect: () => authStore.logout() },
                ],
              ]"
            >
              <UButton
                color="neutral"
                variant="ghost"
                class="rounded-xl"
              >
                <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span class="text-sm font-bold">
                    {{ authStore.username.charAt(0).toUpperCase() }}
                  </span>
                </div>
              </UButton>
            </UDropdownMenu>
          </template>

          <template v-else>
            <NuxtLink to="/login">
              <UButton color="neutral" variant="ghost">
                Entrar
              </UButton>
            </NuxtLink>
            <NuxtLink to="/register">
              <UButton color="primary" class="bg-emerald-500 hover:bg-emerald-600">
                Cadastrar
              </UButton>
            </NuxtLink>
          </template>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
