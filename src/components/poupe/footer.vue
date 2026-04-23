<template>
  <footer class="flex items-center justify-between p-4">
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
