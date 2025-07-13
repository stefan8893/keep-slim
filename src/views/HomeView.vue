<script setup lang="ts">
import type { BodyData } from '@/bodyData/body-data.types';
import type { BodyDataRepository } from '@/bodyData/persistence/body-data-repository.types';
import { useCommonChartOptions } from '@/charting/useCommonChartOptions';
import DateRangePicker from '@/components/infrastructure/DatePicker/DateRangePicker.vue';
import type { DateRangeSelectionId } from '@/components/infrastructure/DatePicker/date-range.types';
import { bodyDataRepositoryKey } from '@/injection.types';
import BodyDataChartView from '@/views/BodyDataChartView.vue';
import WeeklyWeightChangeChartView from '@/views/WeeklyWeightChangeChartView.vue';
import WidgetsView from '@/views/WidgetsView.vue';
import { computed, inject, ref, watchEffect } from 'vue';

useCommonChartOptions();

const bodyDataRepository = inject(bodyDataRepositoryKey) as BodyDataRepository;

const startDate = ref<Date>();
const endDate = ref<Date>();
const bodyData = ref<BodyData[]>([]);

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

const bothDatesPresent = computed(() => !!startDate.value && !!endDate.value);

watchEffect(() => {
  if (!!startDate.value && !!endDate.value) fetchData();
});

const fetchData = async () => {
  if (!bothDatesPresent.value) return;

  const queriedBodyData = await bodyDataRepository.query({
    start: startDate.value!,
    end: endDate.value!,
  });

  bodyData.value = queriedBodyData;
};
</script>

<template>
  <div>
    <DateRangePicker
      v-model:start="startDate"
      v-model:end="endDate"
      :initial-selection="'L6M'"
      :available-selections="datePickerSelction"
    />
  </div>
  <div class="mt-8">
    <WidgetsView :body-data="bodyData" />
  </div>
  <div class="mt-8">
    <WeeklyWeightChangeChartView :body-data="bodyData" />
  </div>
  <div class="mt-8">
    <BodyDataChartView :body-data="bodyData" />
  </div>
</template>

<style scope></style>
