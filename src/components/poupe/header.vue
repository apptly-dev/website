<template>
  <header class="flex items-center justify-between p-4">
    <div>
      <slot name="logo" />
    </div>
    <div>
      <slot />
    </div>
    <div>
      <slot name="right" />
    </div>
  </header>
</template>
