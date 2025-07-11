<script setup lang="ts">
import type { WidgetOptions } from '@/components/widget/single-widget.types';
import { Bottom, Top } from '@element-plus/icons-vue';
import { computed } from 'vue';

const props = defineProps<{
  change?: number;
  options: WidgetOptions;
}>();

const change = computed(() => Math.abs(props?.change ?? 0));

type IconToShow = 'none' | 'up' | 'down';

const iconToShow = computed((): IconToShow => {
  if (!props?.change || props.change === 0) return 'none';
  else return props.change > 0 ? 'up' : 'down';
});
</script>

<template>
  <div class="flex flex-row flex-nowrap items-center justify-center gap-x-1">
    <el-icon v-if="iconToShow === 'up'" size="large"><Top /></el-icon>
    <el-icon v-if="iconToShow === 'down'" size="large"><Bottom /></el-icon>
    <el-text size="large">
      <i18n-n tag="span" :value="change" :format="options.numberFormat" scope="global">
        <template #integer="slotProps">
          <span class="text-lg font-semibold">{{ slotProps.integer }}</span>
        </template>
        <template #group="slotProps">
          <span class="text-lg font-semibold">{{ slotProps.group }}</span>
        </template>
        <template #fraction="slotProps">
          <span class="text-lg font-semibold">{{ slotProps.fraction }}</span>
        </template>
      </i18n-n>
    </el-text>
  </div>
</template>
