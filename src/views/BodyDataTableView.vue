<script setup lang="ts">
import type { BodyDataRepository } from '@/bodyData/body-data-persistence.types';
import type { BodyData } from '@/bodyData/body-data.types';
import BodyDataTable from '@/components/BodyDataTable.vue';
import DateRangePicker from '@/components/infrastructure/DatePicker/DateRangePicker.vue';
import type { DateRangeSelectionId } from '@/components/infrastructure/DatePicker/date-range.types';
import { bodyDataRepositoryKey } from '@/injection.types';
import { computed, inject, ref, watchEffect } from 'vue';

const bodyDataRepository = inject(bodyDataRepositoryKey) as BodyDataRepository;

const startDate = ref<Date>();
const endDate = ref<Date>();
const bodyData = ref<BodyData[]>([]);
const isLoading = ref(false);

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

const bothDatesPresent = computed(() => !!startDate.value && !!endDate.value);

watchEffect(() => {
  if (!!startDate.value && !!endDate.value) fetchData();
});

const fetchData = async () => {
  if (!bothDatesPresent.value) return;

  try {
    isLoading.value = true;

    bodyData.value = await bodyDataRepository.query({
      start: startDate.value!,
      end: endDate.value!,
    });
  } catch (error) {
    console.error(error);
    console.error('TOOD: handle error');
  } finally {
    isLoading.value = false;
  }
};

const deleteRecord = async (recordedAt: Date) => {
  console.log('delete record on', recordedAt);

  try {
    isLoading.value = true;

    await bodyDataRepository.delete(recordedAt);
  } catch (error) {
    console.error(error);
    console.error('TOOD: handle error');
  } finally {
    isLoading.value = false;
  }

  fetchData();
};
</script>

<template>
  <DateRangePicker
    v-model:start="startDate"
    v-model:end="endDate"
    :initial-selection="'L14D'"
    :available-selections="datePickerSelction"
  />
  <el-card class="mt-8" v-loading="isLoading">
    <BodyDataTable :body-data="bodyData" @delete-record="deleteRecord" />
  </el-card>
</template>
