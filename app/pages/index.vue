<script setup lang="ts">
/**
 * Home Page - Main landing page
 * 
 * Shows featured games and quick actions.
 */

import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'default',
})

const authStore = useAuthStore()

const featuredGames = [
  {
    id: 'dice',
    name: 'Dados',
    description: 'Aposte se o resultado será maior ou menor que o alvo.',
    icon: 'i-lucide-dice-5',
    path: '/games/dice',
    available: true,
    color: 'emerald',
  },
  {
    id: 'crash',
    name: 'Crash',
    description: 'O multiplicador sobe... até explodir! Retire a tempo.',
    icon: 'i-lucide-trending-up',
    path: '/games/crash',
    available: false,
    color: 'orange',
  },
  {
    id: 'slots',
    name: 'Caça-níqueis',
    description: 'Gire os rolos e tente combinar os símbolos.',
    icon: 'i-lucide-cherry',
    path: '/games/slots',
    available: false,
    color: 'purple',
  },
]
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <!-- Hero Section -->
    <section class="mb-12">
      <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700 relative overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-5">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-500 to-transparent" />
        </div>

        <div class="relative z-10">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">
            Bem-vindo ao
            <span class="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              GabeBet
            </span>
          </h1>
          <p class="text-xl text-gray-400 mb-6 max-w-2xl">
            Experimente a emoção das apostas em um ambiente seguro e simulado.
            Jogue com responsabilidade!
          </p>

          <div v-if="!authStore.isAuthenticated" class="flex flex-wrap gap-4">
            <NuxtLink to="/register">
              <UButton size="lg" class="bg-emerald-500 hover:bg-emerald-600">
                <UIcon name="i-lucide-rocket" class="w-5 h-5 mr-2" />
                Começar Agora
              </UButton>
            </NuxtLink>
            <NuxtLink to="/login">
              <UButton size="lg" color="neutral" variant="outline">
                Já tenho conta
              </UButton>
            </NuxtLink>
          </div>

          <div v-else class="flex flex-wrap gap-4">
            <NuxtLink to="/games/dice">
              <UButton size="lg" class="bg-emerald-500 hover:bg-emerald-600">
                <UIcon name="i-lucide-play" class="w-5 h-5 mr-2" />
                Jogar Dados
              </UButton>
            </NuxtLink>
            <div class="flex items-center gap-3 bg-gray-800/50 px-4 py-2 rounded-xl">
              <UIcon name="i-lucide-wallet" class="w-5 h-5 text-emerald-400" />
              <span class="text-lg">
                Saldo: <strong>R$ {{ authStore.userBalance.toFixed(2) }}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Games -->
    <section>
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-3">
        <UIcon name="i-lucide-gamepad-2" class="w-7 h-7 text-emerald-400" />
        Jogos em Destaque
      </h2>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="game in featuredGames"
          :key="game.id"
          :class="[
            'group relative bg-gray-900 rounded-2xl border transition-all duration-300',
            game.available
              ? 'border-gray-700 hover:border-emerald-500/50 cursor-pointer'
              : 'border-gray-800 opacity-60'
          ]"
        >
          <NuxtLink
            :to="game.available ? game.path : '#'"
            :class="{ 'pointer-events-none': !game.available }"
            class="block p-6"
          >
            <!-- Icon -->
            <div
              :class="[
                'w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110',
                game.color === 'emerald' && 'bg-emerald-500/20',
                game.color === 'orange' && 'bg-orange-500/20',
                game.color === 'purple' && 'bg-purple-500/20',
              ]"
            >
              <UIcon
                :name="game.icon"
                :class="[
                  'w-8 h-8',
                  game.color === 'emerald' && 'text-emerald-400',
                  game.color === 'orange' && 'text-orange-400',
                  game.color === 'purple' && 'text-purple-400',
                ]"
              />
            </div>

            <!-- Content -->
            <h3 class="text-xl font-bold mb-2">{{ game.name }}</h3>
            <p class="text-gray-400 text-sm">{{ game.description }}</p>

            <!-- Badge -->
            <div class="mt-4">
              <span
                v-if="game.available"
                class="inline-flex items-center gap-1 text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full"
              >
                <UIcon name="i-lucide-check-circle" class="w-3 h-3" />
                Disponível
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded-full"
              >
                <UIcon name="i-lucide-clock" class="w-3 h-3" />
                Em breve
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Info Cards -->
    <section class="mt-12 grid md:grid-cols-3 gap-6">
      <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <UIcon name="i-lucide-shield-check" class="w-8 h-8 text-emerald-400 mb-4" />
        <h3 class="font-bold mb-2">Ambiente Seguro</h3>
        <p class="text-sm text-gray-400">
          Todas as apostas são simuladas. Nenhum dinheiro real envolvido.
        </p>
      </div>

      <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <UIcon name="i-lucide-zap" class="w-8 h-8 text-yellow-400 mb-4" />
        <h3 class="font-bold mb-2">Resultados Instantâneos</h3>
        <p class="text-sm text-gray-400">
          Veja o resultado das suas apostas imediatamente.
        </p>
      </div>

      <div class="bg-gray-900 rounded-xl p-6 border border-gray-800">
        <UIcon name="i-lucide-history" class="w-8 h-8 text-blue-400 mb-4" />
        <h3 class="font-bold mb-2">Histórico Completo</h3>
        <p class="text-sm text-gray-400">
          Acompanhe todas as suas apostas e estatísticas.
        </p>
      </div>
    </section>

    <!-- Disclaimer -->
    <section class="mt-12 p-6 bg-amber-500/10 border border-amber-500/30 rounded-xl">
      <div class="flex items-start gap-4">
        <UIcon name="i-lucide-alert-triangle" class="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 class="font-bold text-amber-400 mb-2">Aviso Importante</h3>
          <p class="text-sm text-gray-300">
            Este é um <strong>protótipo de demonstração</strong>. Os algoritmos de jogo são simplificados
            e executados no cliente. O backend real, com algoritmos proprietários e arquitetura de
            microsserviços, está em desenvolvimento para garantir segurança e justiça nos resultados.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
