<script setup lang="ts">
import DateRangePicker from '@/components/infrastructure/DatePicker/DateRangePicker.vue';
import type { DateRangeSelectionId } from '@/components/infrastructure/DatePicker/date-range.types';
import { ref, watch } from 'vue';

import DashboardWidgetsView from './DashboardWidgetsView.vue';

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
  <div class="mt-8 flex flex-row flex-wrap items-center justify-between">
    <DashboardWidgetsView :weight="64.7" :muscle-mass="45.3" :body-fat="13.3" :water="60.3" />
  </div>
</template>

<style scope></style>
