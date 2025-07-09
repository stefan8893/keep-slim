<script setup lang="ts">
import DashboardWidget from '@/components/DashboardWidget.vue';
import DateRangePicker from '@/components/infrastructure/DatePicker/DateRangePicker.vue';
import { type DateRangeSelectionId } from '@/components/infrastructure/DatePicker/date-range-selection';
import { MessageKey } from '@/i18n/message-keys.g';
import { ref, watch } from 'vue';

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
  <div class="">
    <DateRangePicker
      v-model:start="start"
      v-model:end="end"
      :initialSelection="'L6M'"
      :available-selections="datePickerSelction"
    />
  </div>
  <div class="mt-8 flex flex-row flex-wrap items-center justify-between">
    <DashboardWidget
      class="xs:w-1/2 xs:pr-3 w-full pb-3 md:w-1/3 lg:w-1/4"
      :title-message-key="MessageKey.weight"
    />
    <DashboardWidget
      class="xs:w-1/2 w-full pb-3 md:w-1/3 md:pr-3 lg:w-1/4"
      :title-message-key="MessageKey.muscleMass"
    />
    <DashboardWidget
      class="xs:w-1/2 xs:pr-3 w-full pb-3 sm:pr-3 md:w-1/3 md:pr-0 lg:w-1/4 lg:pr-3"
      :title-message-key="MessageKey.bodyFat"
    />
    <DashboardWidget
      class="xs:w-1/2 w-full pb-3 md:w-1/3 md:pr-3 lg:w-1/4 lg:pr-0"
      :title-message-key="MessageKey.water"
    />
  </div>
</template>

<style scope></style>
