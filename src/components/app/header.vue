<template>
  <p-header>
    <template #logo>
      <a :href="appConfig.homeUrl">Apptly</a>
    </template>
    <template #right>
      <p-color-mode-toggle />
    </template>
  </p-header>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();
</script>
