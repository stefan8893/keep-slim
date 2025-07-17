<script setup lang="ts">
import type { BodyDataRepository } from '@/bodyData/body-data-persistence.types';
import type { BodyData } from '@/bodyData/body-data.types';
import { useCommonChartOptions } from '@/charting/useCommonChartOptions';
import BodyDataChart from '@/components/BodyDataChart.vue';
import BodyDatatWeeklyWeightChangeChart from '@/components/BodyDatatWeeklyWeightChangeChart.vue';
import CsvImport from '@/components/csv-import/CsvImport.vue';
import DateRangePicker from '@/components/infrastructure/DatePicker/DateRangePicker.vue';
import type { DateRangeSelectionId } from '@/components/infrastructure/DatePicker/date-range.types';
import BodyDataWidgetSkeletons from '@/components/widget/BodyDataWidgetSkeletons.vue';
import BodyDataWidgets from '@/components/widget/BodyDataWidgets.vue';
import { MessageKey } from '@/i18n/message-keys.g';
import { bodyDataRepositoryKey } from '@/injection.types';
import { useLoader } from '@/utils';
import { Plus } from '@element-plus/icons-vue';
import { computed, inject, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

useCommonChartOptions();

const bodyDataRepository = inject(bodyDataRepositoryKey) as BodyDataRepository;
const { t } = useI18n();

const startDate = ref<Date>();
const endDate = ref<Date>();
const bodyData = ref<BodyData[]>([]);
const { run, isLoading } = useLoader({
  initialLoading: true,
  defaultStartDelay: 200,
  skipDelayOnFirstRun: true,
});

const csvImportDialogVisible = ref(false);

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

  bodyData.value = await run(() => {
    return bodyDataRepository.query({
      start: startDate.value!,
      end: endDate.value!,
    });
  });
};

const openCsvImportDialog = () => {
  csvImportDialogVisible.value = true;
};
</script>

<template>
  <div class="flex flex-row flex-nowrap items-start justify-between">
    <DateRangePicker
      class="w-full"
      v-model:start="startDate"
      v-model:end="endDate"
      :initial-selection="'L6M'"
      :available-selections="datePickerSelction"
    />

    <el-tooltip placement="top-end" :show-after="1000" :content="t(MessageKey.importCsvFile)">
      <el-button type="primary" :icon="Plus" @click="openCsvImportDialog" />
    </el-tooltip>
  </div>
  <BodyDataWidgetSkeletons v-if="isLoading" class="mt-8" />
  <BodyDataWidgets v-else class="mt-8" :body-data="bodyData" />
  <BodyDatatWeeklyWeightChangeChart v-loading="isLoading" class="mt-8" :body-data="bodyData" />
  <BodyDataChart v-loading="isLoading" class="mt-8" :body-data="bodyData" />
  <CsvImport v-model:visible="csvImportDialogVisible" @refresh="fetchData" />
</template>

<style scope></style>
