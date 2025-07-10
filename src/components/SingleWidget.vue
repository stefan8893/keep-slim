<script setup lang="ts">
import InfoIcon from '@/components/InfoIcon.vue';
import type { ProgressIndicatorOptions } from '@/components/ProgressIndicator.vue';
import ProgressIndicator from '@/components/ProgressIndicator.vue';
import { formatDateTime } from '@/i18n/date-utils';
import { computed } from 'vue';

export type WidgetOptions = ProgressIndicatorOptions;

export type WidgetValues = {
  latestRecordDateTime: Date;
  latestValue: number;
  changeInSelectedTimeRange: number;
  weeklyAverage: number;
};

const props = defineProps<{
  values?: WidgetValues;
  titleMessageKey: string;
  options: WidgetOptions;
}>();

const latestRecordDateTime = computed(() => {
  if (!props.values) return '';

  return formatDateTime(props.values.latestRecordDateTime);
});
</script>

<template>
  <div>
    <el-card>
      <template #header>
        <div class="flex flex-row flex-nowrap items-center justify-between">
          <el-text size="large">{{ $t(props.titleMessageKey) }}</el-text>
          <InfoIcon :content="latestRecordDateTime" />
        </div>
      </template>
      <template #default>
        <div class="flex flex-col flex-nowrap items-center justify-start">
          <ProgressIndicator :value="props.values?.latestValue ?? 0" :options="props.options" />
        </div>
      </template>
    </el-card>
  </div>
</template>

<style scoped></style>
