<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'surface',
  },
  script: [{
    tagPosition: 'head',
    innerHTML: `(() => {
  try {
    const stored = localStorage.getItem('theme');
    const dark = stored
      ? stored === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch {}
})();`,
  }],
});
</script>
