<template>
  <footer class="flex flex-col items-center gap-2 p-4 sm:flex-row sm:justify-between">
    <div>
      <slot name="left" />
    </div>
    <div>
      <slot />
    </div>
    <div>
      <slot name="right" />
    </div>
  </footer>
</template>
