<script setup lang="ts">
import type { BodyData } from '@/bodyData/body-data.types';
import type { BodyDataRepository } from '@/bodyData/persistence/body-data-repository.types';
import { useCommonChartOptions } from '@/charting/useCommonChartOptions';
import BodyDataChart from '@/components/BodyDataChart.vue';
import BodyDataWidgets from '@/components/BodyDataWidgets.vue';
import BodyDatatWeeklyWeightChangeChart from '@/components/BodyDatatWeeklyWeightChangeChart.vue';
import DateRangePicker from '@/components/infrastructure/DatePicker/DateRangePicker.vue';
import type { DateRangeSelectionId } from '@/components/infrastructure/DatePicker/date-range.types';
import { bodyDataRepositoryKey } from '@/injection.types';
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
  <DateRangePicker
    v-model:start="startDate"
    v-model:end="endDate"
    :initial-selection="'L6M'"
    :available-selections="datePickerSelction"
  />
  <BodyDataWidgets class="mt-8" :body-data="bodyData" />
  <BodyDatatWeeklyWeightChangeChart class="mt-8" :body-data="bodyData" />
  <BodyDataChart class="mt-8" :body-data="bodyData" />
</template>

<style scope></style>
