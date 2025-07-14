<script setup lang="ts">
import type { BodyData } from '@/bodyData/body-data.types';
import type { BodyDataRepository } from '@/bodyData/persistence/body-data-repository.types';
import BodyDataTable from '@/components/BodyDataTable.vue';
import DateRangePicker from '@/components/infrastructure/DatePicker/DateRangePicker.vue';
import type { DateRangeSelectionId } from '@/components/infrastructure/DatePicker/date-range.types';
import { bodyDataRepositoryKey } from '@/injection.types';
import { computed, inject, ref, watchEffect } from 'vue';

const bodyDataRepository = inject(bodyDataRepositoryKey) as BodyDataRepository;

const startDate = ref<Date>();
const endDate = ref<Date>();
const bodyData = ref<BodyData[]>([]);
const isLoading = ref(true);

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

    const queriedBodyData = await bodyDataRepository.query({
      start: startDate.value!,
      end: endDate.value!,
    });

    bodyData.value = queriedBodyData;
  } catch (error) {
    console.error(error);
    console.error('TOOD: handle error');
  } finally {
    isLoading.value = false;
  }
};

const refreshData = () => {
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
  <BodyDataTable
    class="mt-8"
    :body-data="bodyData"
    :loading="isLoading"
    @refresh-data="refreshData"
  />
</template>
