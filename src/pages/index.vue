<template>
  <p-container>
    <p-main class="flex flex-1 justify-center">
      <div class="self-center text-center">
        <img
          src="~/assets/img/logo-light.svg"
          alt="Apptly"
          class="mx-auto mb-6 block w-64 dark:hidden"
        >
        <img
          src="~/assets/img/logo-dark.svg"
          alt="Apptly"
          class="mx-auto mb-6 hidden w-64 dark:block"
        >
        Coming soon
      </div>
    </p-main>
    <p-footer>
      <div class="flex flex-col items-center gap-2 text-sm">
        <p-color-mode-toggle />
        <div class="flex items-center gap-3">
          <app-copyright short />
          <nuxt-link
            to="/support"
            class="hover:text-primary hover:underline"
          >
            Support
          </nuxt-link>
        </div>
      </div>
    </p-footer>
  </p-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});
</script>
