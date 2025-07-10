<script setup lang="ts">
import type { WidgetOptions } from '@/components/widget/single-widget.types';
import { computed } from 'vue';

const props = defineProps<{
  value: number;
  options: WidgetOptions;
}>();

const clampBetweenZeroAndHundred = (x: number) => Math.min(Math.max(x, 0), 100);

const percentage = computed(() => {
  const isPercentage = props.options.numberFormat === 'percent';
  if (!props.value) return 0;

  const range = props.options.maxValue - props.options.minValue;
  const actual = (isPercentage ? props.value * 100 : props.value) - props.options.minValue;

  return clampBetweenZeroAndHundred((actual / range) * 100);
});
</script>

<template>
  <el-progress
    type="dashboard"
    stroke-linecap="square"
    :width="120"
    :show-text="true"
    :color="options.color"
    :stroke-width="16"
    :percentage="percentage"
  >
    <template #default>
      <span class="text-xl font-semibold">{{ $n(props.value, props.options.numberFormat) }}</span>
    </template>
  </el-progress>
</template>
