<template>
  <span class="text-sm">
    {{ beforeLinkText }}
    <nuxt-link
      class="hover:text-primary hover:underline"
      to="/legal"
    >{{ linkText }}
      {{ afterLinkText }}
    </nuxt-link>
  </span>
</template>

<script setup lang="ts">
// props
//
const props = defineProps<{
  short?: boolean
}>();

const pShort = toRef(props.short);

// data
//
const since = 2024;
const until = new Date().getFullYear();

const years = computed(() => {
  if (since < until) return `${since}-${until}`;
  return String(since);
});

// text
//
const copyrightText = computed(() => `Copyright © ${years.value}`);

const beforeLinkText = computed(() => pShort.value ? '' : copyrightText.value);
const linkText = computed(() => pShort.value ? copyrightText.value : 'Apptly Software Ltd');
const afterLinkText = computed(() => pShort.value ? '' : '.');
</script>
