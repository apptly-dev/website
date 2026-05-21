<template>
  <p-footer>
    <template #left>
      <app-copyright />
    </template>
    <template #right>
      <nav
        aria-label="Footer"
        class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
      >
        <nuxt-link
          to="/passphrase"
          class="hover:text-primary hover:underline focus-visible:text-primary focus-visible:underline"
        >
          Passphrase
        </nuxt-link>
        <a
          href="https://awesome-apptly.com/"
          target="_blank"
          rel="noopener"
          class="hover:text-primary hover:underline focus-visible:text-primary focus-visible:underline"
        >
          Open source<span
            aria-hidden="true"
            class="ml-0.5 text-xs"
          >↗︎</span>
          <span class="sr-only">(opens in new tab)</span>
        </a>
        <nuxt-link
          to="/support"
          class="hover:text-primary hover:underline focus-visible:text-primary focus-visible:underline"
        >
          Support
        </nuxt-link>
      </nav>
    </template>
  </p-footer>
</template>
