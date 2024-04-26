<template>
  <u-container>
    <u-main class="flex flex-1 justify-center">
      <div class="self-center text-center">
        <b>[insert logo here]</b>
        <br>
        Coming soon
      </div>
    </u-main>
    <u-footer>
      <template #left>
        <app-copyright short />
      </template>
      <template #right>
        <u-color-mode-toggle />
      </template>
    </u-footer>
  </u-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});
</script>
