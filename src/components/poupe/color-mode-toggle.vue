<template>
  <button
    type="button"
    aria-label="Toggle colour mode"
    class="rounded p-2 hover:bg-surface-container-high"
    @click="toggle"
  >
    <Icon
      :name="isDark ? 'heroicons:sun-20-solid' : 'heroicons:moon-20-solid'"
      size="20"
    />
  </button>
</template>

<script setup lang="ts">
const isDark = ref(false);

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark');
});

const toggle = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};
</script>
