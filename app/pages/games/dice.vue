<script setup lang="ts">
/**
 * Dice Game Page
 * 
 * Interactive dice betting game.
 */

import {
  calculateMultiplier,
  calculateWinProbability,
  placeDiceBet,
  validateBet,
  type DiceBetType,
  type DiceBetResult,
  DEFAULT_DICE_CONFIG,
} from '~/logic/algorithms/dice'
import { useAuthStore } from '~/stores/auth'
import { useBetHistoryStore } from '~/stores/betHistory'

definePageMeta({
  layout: 'default',
})

const authStore = useAuthStore()
const betHistoryStore = useBetHistoryStore()

// Game state
const target = ref(50)
const betType = ref<DiceBetType>('over')
const betAmount = ref(10)
const isRolling = ref(false)
const lastResult = ref<DiceBetResult | null>(null)
const showResult = ref(false)

// Computed values
const multiplier = computed(() => 
  calculateMultiplier(target.value, betType.value)
)

const winProbability = computed(() => 
  calculateWinProbability(target.value, betType.value) * 100
)

const potentialPayout = computed(() => 
  Math.round(betAmount.value * multiplier.value * 100) / 100
)

const validation = computed(() => 
  validateBet(betAmount.value, target.value)
)

const canBet = computed(() => {
  if (!authStore.isAuthenticated) return false
  if (isRolling.value) return false
  if (!validation.value.valid) return false
  if (betAmount.value > authStore.userBalance) return false
  return true
})

// Quick bet buttons
const quickBetAmounts = [10, 50, 100, 500]

function setQuickBet(amount: number) {
  betAmount.value = Math.min(amount, authStore.userBalance)
}

function halfBet() {
  betAmount.value = Math.max(1, Math.floor(betAmount.value / 2))
}

function doubleBet() {
  betAmount.value = Math.min(betAmount.value * 2, authStore.userBalance, DEFAULT_DICE_CONFIG.maxBet)
}

function maxBet() {
  betAmount.value = Math.min(authStore.userBalance, DEFAULT_DICE_CONFIG.maxBet)
}

// Toggle bet type
function toggleBetType() {
  betType.value = betType.value === 'over' ? 'under' : 'over'
}

// Place bet
async function placeBet() {
  if (!canBet.value || !authStore.user) return

  isRolling.value = true
  showResult.value = false

  // Deduct bet amount
  authStore.updateBalance(-betAmount.value)

  // Simulate rolling animation delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  try {
    const result = placeDiceBet(betAmount.value, target.value, betType.value)
    lastResult.value = result

    // Add payout if won
    if (result.won) {
      authStore.updateBalance(result.payout)
    }

    // Record bet in history
    betHistoryStore.addBet(authStore.user.id, {
      gameType: 'dice',
      amount: betAmount.value,
      multiplier: result.multiplier,
      payout: result.payout,
      won: result.won,
      details: {
        roll: result.roll,
        target: result.target,
        betType: result.betType,
      },
    })

    showResult.value = true
  } finally {
    isRolling.value = false
  }
}

// Load bet history on mount
onMounted(() => {
  if (authStore.user) {
    betHistoryStore.loadHistory(authStore.user.id)
  }
})

// Watch for auth changes
watch(() => authStore.user, (user) => {
  if (user) {
    betHistoryStore.loadHistory(user.id)
  }
})
</script>

<template>
  <div class="max-w-6xl mx-auto w-full">
    <!-- Header -->
    <div class="mb-6 md:mb-8">
      <h1 class="text-2xl md:text-3xl font-bold flex items-center gap-3">
        <div class="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
          <UIcon name="i-lucide-dice-5" class="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
        </div>
        Jogo de Dados
      </h1>
      <p class="text-gray-400 mt-2 text-sm md:text-base">
        Escolha um alvo e aposte se o resultado será maior ou menor.
      </p>
    </div>

    <!-- Auth Required Message -->
    <div
      v-if="!authStore.isAuthenticated"
      class="bg-gray-900 rounded-2xl border border-gray-800 p-6 md:p-8 text-center"
    >
      <UIcon name="i-lucide-lock" class="w-12 h-12 md:w-16 md:h-16 text-gray-600 mx-auto mb-4" />
      <h2 class="text-lg md:text-xl font-bold mb-2">Faça login para jogar</h2>
      <p class="text-gray-400 mb-6 text-sm md:text-base">
        Você precisa estar logado para fazer apostas.
      </p>
      <div class="flex flex-col sm:flex-row justify-center gap-3">
        <NuxtLink to="/login" class="w-full sm:w-auto">
          <UButton color="neutral" variant="outline" class="w-full">Entrar</UButton>
        </NuxtLink>
        <NuxtLink to="/register" class="w-full sm:w-auto">
          <UButton class="bg-emerald-500 hover:bg-emerald-600 w-full">Cadastrar</UButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Game Interface -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      <!-- Betting Panel -->
      <div class="lg:col-span-1 space-y-4 md:space-y-6 order-2 lg:order-1">
        <!-- Bet Amount -->
        <div class="bg-gray-900 rounded-2xl border border-gray-800 p-4 md:p-6">
          <label class="block text-sm font-medium text-gray-400 mb-3">
            Valor da Aposta
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
            <input
              v-model.number="betAmount"
              type="number"
              :min="DEFAULT_DICE_CONFIG.minBet"
              :max="Math.min(authStore.userBalance, DEFAULT_DICE_CONFIG.maxBet)"
              class="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-lg font-semibold focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <!-- Quick Bet Buttons -->
          <div class="grid grid-cols-4 gap-2 mt-3">
            <button
              v-for="amount in quickBetAmounts"
              :key="amount"
              class="py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              @click="setQuickBet(amount)"
            >
              {{ amount }}
            </button>
          </div>

          <div class="grid grid-cols-3 gap-2 mt-2">
            <button
              class="py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              @click="halfBet"
            >
              ½
            </button>
            <button
              class="py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              @click="doubleBet"
            >
              2×
            </button>
            <button
              class="py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              @click="maxBet"
            >
              MAX
            </button>
          </div>

          <!-- Balance Warning -->
          <div
            v-if="betAmount > authStore.userBalance"
            class="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg"
          >
            <p class="text-xs text-red-400 text-center">Saldo insuficiente</p>
          </div>
        </div>

        <!-- Target Selection -->
        <div class="bg-gray-900 rounded-2xl border border-gray-800 p-4 md:p-6">
          <label class="block text-sm font-medium text-gray-400 mb-3">
            Alvo: <span class="text-white font-bold">{{ target }}</span>
          </label>
          <input
            v-model.number="target"
            type="range"
            min="2"
            max="98"
            class="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div class="flex justify-between text-xs text-gray-500 mt-2">
            <span>2</span>
            <span>50</span>
            <span>98</span>
          </div>
        </div>

        <!-- Bet Type -->
        <div class="bg-gray-900 rounded-2xl border border-gray-800 p-4 md:p-6">
          <label class="block text-sm font-medium text-gray-400 mb-3">
            Apostar em
          </label>
          <div class="grid grid-cols-2 gap-2 md:gap-3">
            <button
              :class="[
                'py-3 md:py-4 rounded-xl font-bold transition-all text-sm md:text-base',
                betType === 'under'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              ]"
              @click="betType = 'under'"
            >
              <UIcon name="i-lucide-arrow-down" class="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1" />
              Menor que {{ target }}
            </button>
            <button
              :class="[
                'py-3 md:py-4 rounded-xl font-bold transition-all text-sm md:text-base',
                betType === 'over'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              ]"
              @click="betType = 'over'"
            >
              <UIcon name="i-lucide-arrow-up" class="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1" />
              Maior que {{ target }}
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="bg-gray-900 rounded-2xl border border-gray-800 p-4 md:p-6">
          <div class="grid grid-cols-2 gap-4 text-center">
            <div>
              <p class="text-xs md:text-sm text-gray-400">Multiplicador</p>
              <p class="text-xl md:text-2xl font-bold text-emerald-400">{{ multiplier }}×</p>
            </div>
            <div>
              <p class="text-xs md:text-sm text-gray-400">Chance</p>
              <p class="text-xl md:text-2xl font-bold">{{ winProbability.toFixed(1) }}%</p>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-700 text-center">
            <p class="text-xs md:text-sm text-gray-400">Ganho Potencial</p>
            <p class="text-xl md:text-2xl font-bold text-yellow-400">
              R$ {{ potentialPayout.toFixed(2) }}
            </p>
          </div>
        </div>

        <!-- Bet Button -->
        <UButton
          size="xl"
          class="w-full py-4 md:py-6 text-base md:text-lg font-bold"
          :class="canBet ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-700 cursor-not-allowed'"
          :disabled="!canBet"
          :loading="isRolling"
          @click="placeBet"
        >
          <template v-if="isRolling">
            Rolando...
          </template>
          <template v-else>
            <UIcon name="i-lucide-dice-5" class="w-5 h-5 md:w-6 md:h-6 mr-2" />
            Apostar R$ {{ betAmount.toFixed(2) }}
          </template>
        </UButton>
      </div>

      <!-- Game Display -->
      <div class="lg:col-span-2 order-1 lg:order-2">
        <!-- Result Display -->
        <div class="bg-gray-900 rounded-2xl border border-gray-800 p-6 md:p-8 min-h-[280px] md:min-h-[400px] flex items-center justify-center">
          <div v-if="isRolling" class="text-center">
            <div class="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center animate-bounce">
              <UIcon name="i-lucide-dice-5" class="w-12 h-12 md:w-16 md:h-16 animate-spin" />
            </div>
            <p class="text-lg md:text-xl text-gray-400">Rolando os dados...</p>
          </div>

          <div v-else-if="showResult && lastResult" class="text-center">
            <!-- Result Number -->
            <div
              :class="[
                'w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 md:mb-6 rounded-3xl flex items-center justify-center text-4xl md:text-5xl font-black',
                lastResult.won
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                  : 'bg-gradient-to-br from-red-500 to-red-600'
              ]"
            >
              {{ lastResult.roll }}
            </div>

            <!-- Result Text -->
            <div
              :class="[
                'text-3xl font-bold mb-4',
                lastResult.won ? 'text-emerald-400' : 'text-red-400'
              ]"
            >
              {{ lastResult.won ? 'VOCÊ GANHOU!' : 'VOCÊ PERDEU' }}
            </div>

            <p class="text-gray-400 mb-4">
              Resultado: <span class="font-bold text-white">{{ lastResult.roll }}</span>
              {{ lastResult.betType === 'over' ? '>' : '<' }}
              <span class="font-bold text-white">{{ lastResult.target }}</span>
            </p>

            <div v-if="lastResult.won" class="text-2xl font-bold text-yellow-400">
              + R$ {{ lastResult.payout.toFixed(2) }}
            </div>
            <div v-else class="text-2xl font-bold text-red-400">
              - R$ {{ lastResult.betAmount.toFixed(2) }}
            </div>
          </div>

          <div v-else class="text-center">
            <div class="w-32 h-32 mx-auto mb-6 bg-gray-800 rounded-3xl flex items-center justify-center">
              <UIcon name="i-lucide-dice-5" class="w-16 h-16 text-gray-600" />
            </div>
            <p class="text-xl text-gray-400">Faça sua aposta para começar</p>
            <p class="text-sm text-gray-500 mt-2">
              Escolha o valor, alvo e tipo de aposta
            </p>
          </div>
        </div>

        <!-- Recent Bets -->
        <div class="mt-6 bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
            <UIcon name="i-lucide-history" class="w-5 h-5 text-gray-400" />
            Apostas Recentes
          </h3>

          <div v-if="betHistoryStore.recentBets.length === 0" class="text-center py-8 text-gray-500">
            <UIcon name="i-lucide-inbox" class="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma aposta ainda</p>
          </div>

          <div v-else class="space-y-2">
            <div
              v-for="bet in betHistoryStore.recentBets.slice(0, 5)"
              :key="bet.id"
              :class="[
                'flex items-center justify-between p-3 rounded-xl',
                bet.won ? 'bg-emerald-500/10' : 'bg-red-500/10'
              ]"
            >
              <div class="flex items-center gap-3">
                <div
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center font-bold',
                    bet.won ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  ]"
                >
                  {{ (bet.details as any)?.roll ?? '?' }}
                </div>
                <div>
                  <p class="text-sm">
                    {{ (bet.details as any)?.betType === 'over' ? 'Maior' : 'Menor' }} que {{ (bet.details as any)?.target }}
                  </p>
                  <p class="text-xs text-gray-500">
                    R$ {{ bet.amount.toFixed(2) }} × {{ bet.multiplier }}
                  </p>
                </div>
              </div>
              <div :class="bet.won ? 'text-emerald-400' : 'text-red-400'" class="font-bold">
                {{ bet.won ? '+' : '-' }} R$ {{ bet.won ? bet.payout.toFixed(2) : bet.amount.toFixed(2) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
