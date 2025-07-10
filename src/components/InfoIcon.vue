<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue';

const props = defineProps<{
  content: string;
}>();
</script>

<template>
  <el-tooltip placement="top">
    <el-icon class="info-icon cursor-pointer" size="20"><InfoFilled /></el-icon>
    <template #content>
      <div class="flex flex-col flex-nowrap items-center justify-start">
        <span>Latest record date time</span>
        <span>{{ props.content }}</span>
      </div>
    </template>
  </el-tooltip>
</template>

<style scoped>
html:not(.dark) .info-icon {
  color: var(--el-color-info);
  /* color: var(--color-stone-500); */
}
</style>
