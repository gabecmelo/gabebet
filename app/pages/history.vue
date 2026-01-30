<script setup lang="ts">
/**
 * Bet History Page
 * 
 * Shows user's betting history and statistics.
 */

import { useAuthStore } from '~/stores/auth'
import { useBetHistoryStore } from '~/stores/betHistory'

definePageMeta({
  layout: 'default',
})

const authStore = useAuthStore()
const betHistoryStore = useBetHistoryStore()
const router = useRouter()

// Load history on mount
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  if (authStore.user) {
    betHistoryStore.loadHistory(authStore.user.id)
  }
})

// Format date helper
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Game type labels
const gameTypeLabels: Record<string, string> = {
  dice: 'Dados',
  crash: 'Crash',
  slots: 'Slots',
}

// Game type icons
const gameTypeIcons: Record<string, string> = {
  dice: 'i-lucide-dice-5',
  crash: 'i-lucide-trending-up',
  slots: 'i-lucide-cherry',
}
</script>

<template>
  <div class="max-w-6xl mx-auto w-full">
    <!-- Header -->
    <div class="mb-6 md:mb-8">
      <h1 class="text-2xl md:text-3xl font-bold flex items-center gap-3">
        <div class="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
          <UIcon name="i-lucide-history" class="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
        </div>
        Histórico de Apostas
      </h1>
      <p class="text-gray-400 mt-2 text-sm md:text-base">
        Veja todas as suas apostas e estatísticas.
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
      <!-- Total Bets -->
      <div class="bg-gray-900 rounded-xl border border-gray-800 p-4 md:p-6">
        <div class="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
          <div class="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-hash" class="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
          </div>
          <span class="text-xs md:text-sm text-gray-400">Total</span>
        </div>
        <p class="text-2xl md:text-3xl font-bold">{{ betHistoryStore.totalBets }}</p>
      </div>

      <!-- Wins -->
      <div class="bg-gray-900 rounded-xl border border-gray-800 p-4 md:p-6">
        <div class="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
          <div class="w-8 h-8 md:w-10 md:h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-trophy" class="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
          </div>
          <span class="text-xs md:text-sm text-gray-400">Vitórias</span>
        </div>
        <p class="text-2xl md:text-3xl font-bold text-emerald-400">{{ betHistoryStore.totalWon }}</p>
      </div>

      <!-- Losses -->
      <div class="bg-gray-900 rounded-xl border border-gray-800 p-4 md:p-6">
        <div class="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
          <div class="w-8 h-8 md:w-10 md:h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-x-circle" class="w-4 h-4 md:w-5 md:h-5 text-red-400" />
          </div>
          <span class="text-sm text-gray-400">Derrotas</span>
        </div>
        <p class="text-3xl font-bold text-red-400">{{ betHistoryStore.totalLost }}</p>
      </div>

      <!-- Win Rate -->
      <div class="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-percent" class="w-5 h-5 text-yellow-400" />
          </div>
          <span class="text-sm text-gray-400">Taxa de Vitória</span>
        </div>
        <p class="text-3xl font-bold text-yellow-400">{{ betHistoryStore.winRate.toFixed(1) }}%</p>
      </div>
    </div>

    <!-- Net Profit Banner -->
    <div
      :class="[
        'rounded-xl border p-6 mb-8',
        betHistoryStore.netProfit >= 0
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-red-500/10 border-red-500/30'
      ]"
    >
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-400 mb-1">Lucro/Prejuízo Total</p>
          <p
            :class="[
              'text-4xl font-bold',
              betHistoryStore.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
            ]"
          >
            {{ betHistoryStore.netProfit >= 0 ? '+' : '' }}R$ {{ betHistoryStore.netProfit.toFixed(2) }}
          </p>
        </div>
        <UIcon
          :name="betHistoryStore.netProfit >= 0 ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
          :class="[
            'w-16 h-16 opacity-50',
            betHistoryStore.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
          ]"
        />
      </div>
    </div>

    <!-- Bet List -->
    <div class="bg-gray-900 rounded-2xl border border-gray-800">
      <div class="p-6 border-b border-gray-800">
        <h2 class="text-lg font-bold">Todas as Apostas</h2>
      </div>

      <div v-if="betHistoryStore.bets.length === 0" class="p-12 text-center">
        <UIcon name="i-lucide-inbox" class="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 class="text-xl font-bold mb-2">Nenhuma aposta ainda</h3>
        <p class="text-gray-400 mb-6">
          Comece a jogar para ver seu histórico aqui.
        </p>
        <NuxtLink to="/games/dice">
          <UButton class="bg-emerald-500 hover:bg-emerald-600">
            <UIcon name="i-lucide-dice-5" class="w-5 h-5 mr-2" />
            Jogar Dados
          </UButton>
        </NuxtLink>
      </div>

      <div v-else class="divide-y divide-gray-800">
        <div
          v-for="bet in betHistoryStore.bets"
          :key="bet.id"
          class="p-4 hover:bg-gray-800/50 transition-colors"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <!-- Game Icon -->
              <div
                :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  bet.won ? 'bg-emerald-500/20' : 'bg-red-500/20'
                ]"
              >
                <UIcon
                  :name="gameTypeIcons[bet.gameType] || 'i-lucide-gamepad-2'"
                  :class="[
                    'w-6 h-6',
                    bet.won ? 'text-emerald-400' : 'text-red-400'
                  ]"
                />
              </div>

              <!-- Bet Details -->
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-bold">{{ gameTypeLabels[bet.gameType] || bet.gameType }}</span>
                  <span
                    :class="[
                      'text-xs px-2 py-0.5 rounded-full',
                      bet.won
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-red-500/20 text-red-400'
                    ]"
                  >
                    {{ bet.won ? 'Vitória' : 'Derrota' }}
                  </span>
                </div>
                <p class="text-sm text-gray-400 mt-1">
                  Aposta: R$ {{ bet.amount.toFixed(2) }} × {{ bet.multiplier }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  {{ formatDate(bet.createdAt) }}
                </p>
              </div>
            </div>

            <!-- Result -->
            <div class="text-right">
              <p
                :class="[
                  'text-xl font-bold',
                  bet.won ? 'text-emerald-400' : 'text-red-400'
                ]"
              >
                {{ bet.won ? '+' : '-' }}R$ {{ bet.won ? bet.payout.toFixed(2) : bet.amount.toFixed(2) }}
              </p>
              <p v-if="bet.gameType === 'dice'" class="text-sm text-gray-500">
                Resultado: {{ (bet.details as any)?.roll }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
