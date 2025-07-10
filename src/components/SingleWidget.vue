<script setup lang="ts">
import { computed } from 'vue';

export type WidgetOptions = {
  color: string;
  unit: string;
  minValue: number;
  maxValue: number;
};

const props = defineProps<{
  value?: number;
  titleMessageKey: string;
  options: WidgetOptions;
}>();

const percentage = computed(() => {
  if (!props.value) return 0;

  const range = props.options.maxValue - props.options.minValue;
  const actual = props.value - props.options.minValue;

  return (actual / range) * 100;
});
</script>

<template>
  <div>
    <el-card>
      <template #header>{{ $t(props.titleMessageKey) }}</template>
      <template #default>
        <div class="flex flex-col flex-nowrap items-center justify-start">
          <el-progress
            type="dashboard"
            :show-text="true"
            :color="options.color"
            :stroke-width="12"
            :percentage="percentage"
          >
            <template #default>
              <span>{{ value }} {{ options.unit }}</span>
            </template>
          </el-progress>
        </div>
      </template>
    </el-card>
  </div>
</template>
