<script setup lang="ts">
import TheHeaderTitle from '@/components/layout/header/TheHeaderTitle.vue';
</script>

<template>
  <div class="flex flex-nowrap items-center justify-between">
    <TheHeaderTitle />
    <div class="light-color flex flex-row flex-nowrap items-center">
      <slot name="headerRight"></slot>
    </div>
  </div>
</template>

<style scoped>
.light-color {
  color: var(--el-text-color-regular-dark);
}
</style>
