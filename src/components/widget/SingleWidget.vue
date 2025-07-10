<script setup lang="ts">
import SingleWidgetChangeInDateRangeSelection from '@/components/widget/SingleWidgetChangeInDateRangeSelection.vue';
import InfoIcon from '@/components/widget/SingleWidgetInfoIcon.vue';
import SingleWidgetProgressIndicator from '@/components/widget/SingleWidgetProgressIndicator.vue';
import SingleWidgetWeeklyAverage from '@/components/widget/SingleWidgetWeeklyAverage.vue';
import type { WidgetOptions, WidgetValues } from '@/components/widget/single-widget.types';
import { computed } from 'vue';

const props = defineProps<{
  values?: WidgetValues;
  titleMessageKey: string;
  options: WidgetOptions;
}>();

const latestValue = computed(() => {
  if (!props.values?.latestValue) return -1;
  else return props.values?.latestValue;
});

const changeInSelectedTimeRange = computed(() => props.values?.changeInSelectedTimeRange ?? -1);
const averageWeeklyChange = computed(() => props.values?.weeklyAverageChange ?? -1);
</script>

<template>
  <div>
    <el-card>
      <template #header>
        <div class="flex flex-row flex-nowrap items-center justify-between">
          <el-text size="large">{{ $t(props.titleMessageKey) }}</el-text>
          <InfoIcon :latest-record-date-time="props.values?.latestRecordDateTime" />
        </div>
      </template>
      <template #default>
        <div class="flex flex-col flex-nowrap items-center justify-start">
          <SingleWidgetProgressIndicator :value="latestValue" :options="props.options" />
        </div>
        <div class="mt-4 flex flex-col flex-nowrap items-center justify-start">
          <SingleWidgetChangeInDateRangeSelection
            :change-in-selected-time-range="changeInSelectedTimeRange"
            :options="props.options"
          />
          <SingleWidgetWeeklyAverage
            :average-weekly-change="averageWeeklyChange"
            :options="props.options"
          />
        </div>
      </template>
    </el-card>
  </div>
</template>
