<template>
  <section class="surface-container-high shape-medium shadow-z1 mx-auto my-10 w-full max-w-xl p-8">
    <h2 class="mb-6 text-2xl font-semibold">
      Secure Passphrase Generator
    </h2>

    <client-only>
      <p
        v-if="errorMessage"
        class="mb-4 text-error"
      >
        {{ errorMessage }}
      </p>

      <div
        v-if="passphrase"
        class="result surface-container-highest mb-4 select-all rounded-md px-4 py-3 text-lg"
        aria-live="polite"
      >
        {{ passphrase }}
      </div>

      <button
        class="interactive-surface-primary rounded-md px-4 py-2 disabled:cursor-not-allowed"
        type="button"
        :disabled="isLoading || wordlist.length === 0"
        @click="generatePassphrase"
      >
        {{ isLoading ? 'Loading dictionary…' : 'Generate New Passphrase' }}
      </button>

      <template #fallback>
        <p class="text-sm opacity-70">
          Loading secure generator environment…
        </p>
      </template>
    </client-only>
  </section>
</template>

<script setup lang="ts">
// EFF Large Wordlist for Passphrases — https://www.eff.org/dice
useHead({ title: 'Passphrase generator' });

const passphrase = ref('');

const { data: wordlist, error, status } = useLazyFetch('/eff_large_wordlist.txt', {
  server: false,
  responseType: 'text',
  default: () => [] as string[],
  transform: (text: string) => {
    const words: string[] = [];
    for (const line of text.split('\n')) {
      const word = line.split('\t')[1]?.trim();
      if (word) words.push(word);
    }
    return words;
  },
});

const isLoading = computed(() => status.value === 'pending');
const errorMessage = computed(() =>
  error.value ? 'Could not load the wordlist. Please reload the page.' : '',
);

// Cryptographically-random integers in [0, slots), bias-free.
// Reject values that would land in the partial bucket above
// floor(2^32 / slots) * slots.
const getRandomIndexes = (slots: number, count: number) => {
  const U32 = 2 ** 32;
  const acceptable = U32 - (U32 % slots);
  const buf = new Uint32Array(1);

  const result: number[] = [];
  for (let i = 0; i < count; i++) {
    let value: number;
    do {
      crypto.getRandomValues(buf);
      value = buf[0]!;
    } while (value >= acceptable);
    result.push(value % slots);
  }
  return result;
};

const generatePassphrase = () => {
  if (wordlist.value.length === 0) return;
  const indexes = getRandomIndexes(wordlist.value.length, 6);
  passphrase.value = indexes.map((i) => wordlist.value[i]!).join(' ');
};
</script>

<style scoped>
/* cspell:words Lexend */
.result {
  font-family: 'Lexend', sans-serif;
}
</style>
