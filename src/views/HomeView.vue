<script setup lang="ts">
import type { BodyData } from '@/bodyData/body-data.types';
import { useCommonChartOptions } from '@/charting/useCommonChartOptions';
import DateRangePicker from '@/components/infrastructure/DatePicker/DateRangePicker.vue';
import type { DateRangeSelectionId } from '@/components/infrastructure/DatePicker/date-range.types';
import { getTestData } from '@/testData/body-data';
import WeeklyWeightChangeChartView from '@/views/WeeklyWeightChangeChartView.vue';
import WidgetsView from '@/views/WidgetsView.vue';
import { type Ref, computed, onMounted, ref, watch } from 'vue';

useCommonChartOptions();

const startDate = ref<Date>();
const endDate = ref<Date>();
const bodyData: Ref<BodyData[]> = ref([]);

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

watch(bothDatesPresent, () => {
  if (bothDatesPresent.value) fetchData();
});

const fetchData = async () => {
  if (!bothDatesPresent.value) return;

  bodyData.value = getTestData().filter(
    (x) => x.recordedAt >= startDate.value! && x.recordedAt <= endDate.value!,
  );
};

onMounted(async () => {});
</script>

<template>
  <div>
    <DateRangePicker
      v-model:start="startDate"
      v-model:end="endDate"
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
