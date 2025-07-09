<script setup lang="ts">
import { useSlots } from 'vue';

const slots = useSlots();
</script>

<template>
  <div class="card-container">
    <div v-if="slots.header" class="card-header p-5"><slot name="header"></slot></div>

    <slot v-if="slots.header" name="header-content-separator"
      ><div class="card-separator"></div
    ></slot>

    <div class="card-content p-5"><slot></slot></div>

    <slot v-if="slots.footer" name="content-footer-separator"
      ><div class="card-separator"></div
    ></slot>

    <div v-if="slots.footer" class="card-footer"><slot name="footer"></slot></div>
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: stretch;
  justify-content: stretch;

  background-color: var(--el-bg-color);

  box-shadow: var(--el-box-shadow-light);
  border-radius: 6px;
  border: 1px solid var(--el-border-color-light);
  overflow: hidden;
  color: var(--el-text-color-primary);
  transition: var(--el-transition-duration);
}

.card-footer {
  padding: 18px 20px;
}

.card-separator {
  border-bottom: 1px solid var(--el-border-color-light);
}
</style>
