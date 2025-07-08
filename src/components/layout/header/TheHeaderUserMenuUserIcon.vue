<script setup lang="ts">
export type IconSize = 'large' | 'default' | 'small';

const props = defineProps({
  initials: {
    type: String,
    required: true,
  },
  iconSize: {
    type: String,
    default: 'default',
  },
});
</script>

<template>
  <el-avatar :size="props.iconSize"
    ><span :class="{ 'text-xl': props.iconSize === 'large' }" class="font-semibold select-none">{{
      props.initials
    }}</span></el-avatar
  >
</template>
