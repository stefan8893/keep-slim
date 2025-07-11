<script setup lang="ts">
import type { BodyData } from '@/bodyData/body-data.types';
import { useCommonChartOptions } from '@/charting/useCommonChartOptions';
import DateRangePicker from '@/components/infrastructure/DatePicker/DateRangePicker.vue';
import type { DateRangeSelectionId } from '@/components/infrastructure/DatePicker/date-range.types';
import { getTestData } from '@/testData/body-data';
import WeeklyWeightChangeChartView from '@/views/WeeklyWeightChangeChartView.vue';
import WidgetsView from '@/views/WidgetsView.vue';
import { type Ref, onMounted, ref, watch } from 'vue';

useCommonChartOptions();

const start = ref<Date>();
const end = ref<Date>();

const datePickerSelction: DateRangeSelectionId[] = [
  'L7D',
  'L14D',
  'L30D',
  'L2M',
  'L3M',
  'L6M',
  'L12M',
  'CURR_YEAR',
  'PREV_YEAR',
  'CUSTOM',
];

watch(start, () => {
  console.log('DateRange updated in HomeView', start.value);
});

watch(end, () => {
  console.log('DateRange updated in HomeView', end.value);
});

const bodyData: Ref<BodyData[]> = ref(getTestData());

console.log(bodyData.value);

onMounted(async () => {});
</script>

<template>
  <div>
    <DateRangePicker
      v-model:start="start"
      v-model:end="end"
      :initialSelection="'L6M'"
      :available-selections="datePickerSelction"
    />
  </div>
  <div class="mt-8">
    <WidgetsView :body-data="bodyData" />
  </div>
  <div class="mt-8">
    <WeeklyWeightChangeChartView :body-data="bodyData" />
  </div>
</template>

<style scope></style>
