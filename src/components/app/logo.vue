<template>
  <svg
    class="app-logo"
    :class="text ? 'with-text' : 'no-text'"
    role="img"
    aria-label="Apptly"
  >
    <use :href="href" />
  </svg>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ text?: boolean }>(), { text: true });

const href = computed(() => (props.text ? '/img/logo.svg' : '/img/logo-no-text.svg'));
</script>

<style scoped>
.app-logo {
  --start-colour: #9e1f63;
  --stop-colour: #00a4ca;
  display: block;
}

.app-logo.with-text {
  aspect-ratio: 576.12 / 485.33;
}

.app-logo.no-text {
  aspect-ratio: 1 / 1;
}

:global(html.dark) .app-logo {
  --start-colour: #ff1f63;
  --stop-colour: #00ffff;
}
</style>
