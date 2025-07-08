<script setup lang="ts">
import TheFooter from '@/components/layout/TheFooter.vue';
import TheHeader from '@/components/layout/header/TheHeader.vue';
</script>

<template>
  <div class="layout-container">
    <header class="h-center items-center">
      <TheHeader class="app-strip min-h-15">
        <template #headerRight> <slot name="headerRight"></slot></template>
      </TheHeader>
    </header>

    <div class="layout-content h-center bg-zinc-100 dark:bg-zinc-900">
      <div class="h-full w-full">
        <slot></slot>
      </div>
    </div>

    <footer class="h-center items-center">
      <TheFooter class="app-strip my-3" />
    </footer>
  </div>
</template>

<style scoped>
.layout-container {
  display: grid;
  height: 100vh;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;

  grid-template-areas:
    'header'
    'content'
    'footer';
}

header {
  grid-area: header;

  min-height: 64px;
  color: var(--el-text-color-regular-dark);
}

.layout-content {
  grid-area: content;

  align-items: start;
}

footer {
  grid-area: footer;
  color: var(--el-text-color-regular-dark);
}

html.dark header {
  border-bottom-color: var(--color-zinc-600);
  border-bottom-style: solid;
  border-bottom-width: 1px;
}

.h-center {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
}
</style>
