<script setup lang="ts">
import type { BodyDataRepository } from '@/bodyData/body-data-persistence.types';
import type { BodyData } from '@/bodyData/body-data.types';
import BodyDataTable from '@/components/BodyDataTable.vue';
import DateRangePicker from '@/components/infrastructure/DatePicker/DateRangePicker.vue';
import {
  type DateRange,
  type DateRangeSelectionId,
  emptyDateRange,
} from '@/components/infrastructure/DatePicker/date-range.types';
import { bodyDataRepositoryKey } from '@/injection.types';
import { isDate, useLoader } from '@/utils';
import { inject, ref, watch } from 'vue';

const bodyDataRepository = inject(bodyDataRepositoryKey) as BodyDataRepository;

const dateRange = ref<DateRange>(emptyDateRange);
const bodyData = ref<BodyData[]>([]);
const { run, isLoading } = useLoader({
  initialLoading: true,
});

const datePickerSelction: DateRangeSelectionId[] = [
  'L7D',
  'L14D',
  'L30D',
  'L2M',
  'L3M',
  'CURR_YEAR',
  'PREV_YEAR',
  'CUSTOM',
];

watch(dateRange, () => fetchData(), { deep: true });

const fetchData = async () => {
  if (!isDate(dateRange.value.start) || !isDate(dateRange.value.end)) return;

  const start = dateRange.value.start;
  const end = dateRange.value.end;

  try {
    bodyData.value = await run(() => bodyDataRepository.query({ start, end }));
  } catch (error) {
    console.error(error);
    console.error('TOOD: handle error');
  }
};

const deleteRecord = async (recordedAt: Date) => {
  try {
    await run(async () => {
      await bodyDataRepository.delete(recordedAt);
      await fetchData();
    });
  } catch (error) {
    console.error(error);
    console.error('TOOD: handle error');
  }
};
</script>

<template>
  <DateRangePicker
    v-model:date-range="dateRange"
    :initial-selection="'L14D'"
    :available-selections="datePickerSelction"
  />
  <el-card class="mt-8" v-loading="isLoading">
    <BodyDataTable :body-data="bodyData" @delete-record="deleteRecord" />
  </el-card>
</template>
