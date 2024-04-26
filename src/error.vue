<template>
  <app-header />
  <u-container>
    <u-main>
      <u-page>
        <u-page-error :error="error" />
      </u-page>
    </u-main>
  </u-container>
  <app-footer />
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps<{
  error: NuxtError
}>();
</script>
