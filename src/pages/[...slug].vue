<template>
  <article class="content-body mx-auto max-w-3xl px-6 py-10">
    <content-renderer :value="data" />
  </article>
</template>

<script setup lang="ts">
const route = useRoute();

const { data } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first(),
);

if (!data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true,
  });
}
</script>

<style scoped>
@reference '~/assets/css/main.css';

.content-body :deep(h1) {
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.content-body :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.content-body :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.content-body :deep(p) {
  line-height: 1.625;
  margin-bottom: 1rem;
}

.content-body :deep(a) {
  color: var(--md-primary);
}

.content-body :deep(a:hover) {
  text-decoration: underline;
}

.content-body :deep(ul),
.content-body :deep(ol) {
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.content-body :deep(ul) {
  list-style: disc;
}

.content-body :deep(ol) {
  list-style: decimal;
}

.content-body :deep(li) {
  margin-bottom: 0.25rem;
}

.content-body :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background-color: var(--md-surface-container);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.content-body :deep(pre) {
  font-family: var(--font-mono);
  background-color: var(--md-surface-container);
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.content-body :deep(pre code) {
  background: transparent;
  padding: 0;
}
</style>
