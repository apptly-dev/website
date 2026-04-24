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
  link: [{
    rel: 'icon',
    type: 'image/svg+xml',
    href: '/favicon.svg',
  }],
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
