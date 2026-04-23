<template>
  <div>
    <app-header />
    <main class="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 class="mb-4 text-6xl font-bold">
        {{ error.statusCode }}
      </h1>
      <p class="mb-8 text-xl">
        {{ error.statusMessage || 'Something went wrong' }}
      </p>
      <button
        type="button"
        class="rounded px-4 py-2 hover:bg-surface-container-high"
        @click="handleError"
      >
        Go home
      </button>
    </main>
    <app-footer />
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps<{
  error: NuxtError
}>();

const handleError = () => clearError({ redirect: '/' });
</script>
