<script setup lang="ts">
import DashboardWidget, { type WidgetOptions } from '@/components/DashboardWidget.vue';
import DateRangePicker from '@/components/infrastructure/DatePicker/DateRangePicker.vue';
import type { DateRangeSelectionId } from '@/components/infrastructure/DatePicker/date-range.types';
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

const weightOptions: WidgetOptions = {
  color: 'brown',
  unit: 'KG',
  minValue: 58,
  maxValue: 70,
};

const muscleMassOptions: WidgetOptions = {
  color: 'purple',
  unit: '%',
  minValue: 42,
  maxValue: 50,
};

const bodyFatOptions: WidgetOptions = {
  color: 'orange',
  unit: '%',
  minValue: 8,
  maxValue: 17,
};

const waterOptions: WidgetOptions = {
  color: 'blue',
  unit: '%',
  minValue: 55,
  maxValue: 65,
};

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
    <DashboardWidget
      class="xs:w-1/2 xs:pr-3 w-full pb-3 md:w-1/3 lg:w-1/4"
      :title-message-key="MessageKey.weight"
      :options="weightOptions"
      :value="64"
    />
    <DashboardWidget
      class="xs:w-1/2 w-full pb-3 md:w-1/3 md:pr-3 lg:w-1/4"
      :title-message-key="MessageKey.muscleMass"
      :options="muscleMassOptions"
      :value="45.7"
    />
    <DashboardWidget
      class="xs:w-1/2 xs:pr-3 w-full pb-3 sm:pr-3 md:w-1/3 md:pr-0 lg:w-1/4 lg:pr-3"
      :title-message-key="MessageKey.bodyFat"
      :options="bodyFatOptions"
      :value="13.3"
    />
    <DashboardWidget
      class="xs:w-1/2 w-full pb-3 md:w-1/3 md:pr-3 lg:w-1/4 lg:pr-0"
      :title-message-key="MessageKey.water"
      :options="waterOptions"
      :value="60.9"
    />
  </div>
</template>

<style scope></style>
