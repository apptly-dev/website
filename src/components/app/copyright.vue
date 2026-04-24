<template>
  <span class="text-sm">
    <template v-if="short">
      <nuxt-link
        class="hover:text-primary hover:underline"
        to="/legal"
      >{{ copyrightText }}</nuxt-link>
    </template>
    <template v-else>
      {{ copyrightText }}
      <nuxt-link
        class="hover:text-primary hover:underline"
        to="/legal"
      >Apptly Software Ltd</nuxt-link>.
    </template>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  short?: boolean
}>();

const since = 2024;
const until = new Date().getFullYear();
const years = since < until ? `${since}-${until}` : String(since);
const copyrightText = `Copyright © ${years}`;
</script>
