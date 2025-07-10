<script setup lang="ts">
import InfoIcon from '@/components/InfoIcon.vue';
import SingleWidgetChangeInDateRangeSelection from '@/components/widget/SingleWidgetChangeInDateRangeSelection.vue';
import type { ProgressIndicatorOptions } from '@/components/widget/SingleWidgetProgressIndicator.vue';
import SingleWidgetProgressIndicator from '@/components/widget/SingleWidgetProgressIndicator.vue';
import SingleWidgetWeeklyAverage from '@/components/widget/SingleWidgetWeeklyAverage.vue';
import { formatDateTime } from '@/i18n/date-utils';
import { computed } from 'vue';

export type WidgetOptions = ProgressIndicatorOptions;

export type WidgetValues = {
  latestRecordDateTime: Date;
  latestValue: number;
  changeInSelectedTimeRange: number;
  weeklyAverageChange: number;
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

const latestValue = computed(() => {
  if (!props.values?.latestValue) return -1;
  else return props.values?.latestValue;
});

const averageWeeklyChange = computed(() => props.values?.weeklyAverageChange ?? -1);
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
          <SingleWidgetProgressIndicator :value="latestValue" :options="props.options" />
        </div>
        <div class="mt-4 flex flex-col flex-nowrap items-center justify-start">
          <div class="flex flex-row flex-nowrap items-center justify-center gap-x-1">
            <SingleWidgetChangeInDateRangeSelection
              :change-in-selected-time-range="props.values?.changeInSelectedTimeRange"
            />
          </div>
          <div class="mt-2 flex flex-row flex-nowrap items-center justify-start gap-x-1">
            <SingleWidgetWeeklyAverage :average-weekly-change="averageWeeklyChange" />
          </div>
        </div>
      </template>
    </el-card>
  </div>
</template>

<style scoped>
.avg-sign {
  font-size: 20px;
}
</style>
