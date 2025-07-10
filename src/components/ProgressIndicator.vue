<script setup lang="ts">
import type { NumberFormat } from '@/i18n/i18n-config';
import { computed } from 'vue';

export type ProgressIndicatorOptions = {
  color: string;
  numberFormat: NumberFormat;
  minValue: number;
  maxValue: number;
};

const props = defineProps<{
  value: number;
  options: ProgressIndicatorOptions;
}>();

const percentage = computed(() => {
  if (!props.value) return 0;

  const range = props.options.maxValue - props.options.minValue;
  const actual = props.value - props.options.minValue;

  return (actual / range) * 100;
});

const value = computed(() => {
  if (props.options.numberFormat === 'percent') return props.value / 100;

  return props.value;
});
</script>

<template>
  <el-progress
    type="dashboard"
    stroke-linecap="square"
    :width="110"
    :show-text="true"
    :color="options.color"
    :stroke-width="16"
    :percentage="percentage"
  >
    <template #default>
      <span class="text-lg">{{ $n(value, props.options.numberFormat) }}</span>
    </template>
  </el-progress>
</template>
