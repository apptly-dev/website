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
        class="result surface-container-highest mb-2 select-all rounded-md px-4 py-3 text-lg"
        :class="{ 'cursor-pointer': isCopySupported }"
        :role="isCopySupported ? 'button' : undefined"
        :tabindex="isCopySupported ? 0 : undefined"
        :title="isCopySupported ? 'Click to copy' : undefined"
        :aria-label="isCopySupported ? 'Generated passphrase. Click or press Enter to copy.' : 'Generated passphrase.'"
        @click="copyPassphrase"
        @keydown.enter.prevent="copyPassphrase"
        @keydown.space.prevent="copyPassphrase"
      >
        {{ passphrase }}
      </div>

      <p
        class="mb-4 h-5 text-sm"
        role="status"
        aria-live="polite"
      >
        {{ statusMessage }}
      </p>

      <div class="flex flex-wrap items-end gap-3">
        <label class="flex flex-col text-sm">
          <span class="mb-1">Word count</span>
          <select
            v-model.number="length"
            aria-describedby="strength-label"
            class="surface-container-highest rounded-md px-3 py-2"
          >
            <option
              v-for="n in lengthOptions"
              :key="n"
              :value="n"
            >
              {{ n }}
            </option>
          </select>
        </label>

        <button
          class="interactive-surface-primary rounded-md px-4 py-2 disabled:cursor-not-allowed"
          type="button"
          :disabled="wordlist.length === 0"
          @click="onGenerate"
        >
          {{ isLoading ? 'Loading dictionary…' : 'Generate New Passphrase' }}
        </button>
      </div>

      <p
        id="strength-label"
        class="mt-2 text-sm opacity-70"
      >
        {{ strengthLabel }}
      </p>

      <template #fallback>
        <p class="text-sm opacity-70">
          Loading secure generator environment…
        </p>
      </template>
    </client-only>
  </section>
</template>

<script setup lang="ts">
import { useClipboard, useTimeoutFn } from '@vueuse/core';

// EFF Large Wordlist for Passphrases — https://www.eff.org/dice
//
// Security invariant: the passphrase must never leave the browser. Refs here
// are component-local (not `useState`), so they aren't serialised into the
// hydration payload, and `generatePassphrase` bails out under SSR.
useHead({ title: 'Passphrase generator' });

const MIN_LENGTH = 3;
const MAX_LENGTH = 16;
const DEFAULT_LENGTH = 6;
const lengthOptions = Array.from(
  { length: MAX_LENGTH - MIN_LENGTH + 1 },
  (_, i) => MIN_LENGTH + i,
);

const passphrase = ref('');
const length = ref<number>(DEFAULT_LENGTH);

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

const generatePassphrase = (count: number) => {
  if (!import.meta.client) return;
  if (wordlist.value.length === 0) return;
  const indexes = getRandomIndexes(wordlist.value.length, count);
  passphrase.value = indexes.map((i) => wordlist.value[i]!).join(' ');
};

const BITS_PER_WORD = Math.log2(7776);

const strengthSummary = (n: number) => {
  const bits = Math.round(n * BITS_PER_WORD);
  if (n <= 3) return `${n} words ≈ ${bits} bits — weak: rate-limited logins only.`;
  if (n <= 4) return `${n} words ≈ ${bits} bits — marginal: throwaway secrets only.`;
  if (n <= 5) return `${n} words ≈ ${bits} bits — low: low-value accounts.`;
  if (n <= 6) return `${n} words ≈ ${bits} bits — baseline: EFF's recommended floor.`;
  if (n <= 8) return `${n} words ≈ ${bits} bits — strong: sensitive accounts.`;
  if (n <= 11) return `${n} words ≈ ${bits} bits — very strong: master passwords and root keys.`;
  if (n <= 15) return `${n} words ≈ ${bits} bits — overkill: beyond classical brute force.`;
  return `${n} words ≈ ${bits} bits — paranoid: post-quantum comfortable.`;
};

const notice = ref('');
const { start: scheduleNoticeClear } = useTimeoutFn(() => {
  notice.value = '';
}, 3000, { immediate: false });
const announce = (message: string) => {
  notice.value = message;
  scheduleNoticeClear();
};

const strengthLabel = computed(() => strengthSummary(length.value));

const onGenerate = () => {
  generatePassphrase(length.value);
};

watch(wordlist, (list) => {
  if (list.length > 0 && !passphrase.value) {
    generatePassphrase(length.value);
  }
}, { immediate: true });

const { copy, copied, isSupported: isCopySupported } = useClipboard();

const copyPassphrase = () => {
  if (!passphrase.value) return;
  if (!isCopySupported.value) {
    announce('Clipboard copy is not supported in this browser.');
    return;
  }
  copy(passphrase.value);
};

const statusMessage = computed(() => {
  if (copied.value && passphrase.value && isCopySupported.value) {
    return 'Copied to clipboard!';
  }
  return notice.value;
});
</script>

<style scoped>
/* cspell:words Lexend */
.result {
  font-family: 'Lexend', sans-serif;
}
</style>
