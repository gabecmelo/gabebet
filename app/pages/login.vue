<script setup lang="ts">
/**
 * Login Page
 * 
 * User authentication form.
 */
import type { FormSubmitEvent } from '@nuxt/ui'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'default',
})

const authStore = useAuthStore()
const router = useRouter()

const formState = reactive({
  email: '',
  password: '',
})

const isSubmitting = ref(false)

async function onSubmit(event: FormSubmitEvent<typeof formState>) {
  isSubmitting.value = true
  authStore.clearError()

  try {
    const result = await authStore.login({
      email: event.data.email,
      password: event.data.password,
    })

    if (result.success) {
      router.push('/')
    }
  } finally {
    isSubmitting.value = false
  }
}

// Redirect if already logged in
watch(
  () => authStore.isAuthenticated,
  (isAuth) => {
    if (isAuth) {
      router.push('/')
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <div class="w-full max-w-md">
      <!-- Card -->
      <div class="bg-gray-900 rounded-2xl border border-gray-800 p-8">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl font-bold">G</span>
          </div>
          <h1 class="text-2xl font-bold mb-2">Entrar no GabeBet</h1>
          <p class="text-gray-400">Acesse sua conta para começar a jogar</p>
        </div>

        <!-- Error Alert -->
        <div
          v-if="authStore.error"
          class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
        >
          <UIcon name="i-lucide-alert-circle" class="w-5 h-5 text-red-400" />
          <p class="text-sm text-red-400">{{ authStore.error }}</p>
        </div>

        <!-- Login Form -->
        <UForm :state="formState" class="space-y-6" @submit="onSubmit">
          <UFormField label="E-mail" name="email" required>
            <UInput
              v-model="formState.email"
              type="email"
              placeholder="seu@email.com"
              icon="i-lucide-mail"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Senha" name="password" required>
            <UInput
              v-model="formState.password"
              type="password"
              placeholder="••••••••"
              icon="i-lucide-lock"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UButton
            type="submit"
            size="lg"
            class="w-full bg-emerald-500 hover:bg-emerald-600"
            :loading="isSubmitting"
          >
            <UIcon v-if="!isSubmitting" name="i-lucide-log-in" class="w-5 h-5 mr-2" />
            Entrar
          </UButton>
        </UForm>

        <!-- Divider -->
        <div class="my-8 flex items-center">
          <div class="flex-1 border-t border-gray-700" />
          <span class="px-4 text-sm text-gray-500">ou</span>
          <div class="flex-1 border-t border-gray-700" />
        </div>

        <!-- Register Link -->
        <p class="text-center text-gray-400">
          Não tem uma conta?
          <NuxtLink to="/register" class="text-emerald-400 hover:text-emerald-300 font-medium">
            Cadastre-se
          </NuxtLink>
        </p>

        <!-- Simulated Session Notice -->
        <div class="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <p class="text-xs text-amber-400 text-center flex items-center justify-center gap-2">
            <UIcon name="i-lucide-info" class="w-4 h-4" />
            Sessão simulada - dados armazenados localmente
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
