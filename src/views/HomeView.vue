<script setup lang="ts">
import type { BodyDataRepository } from '@/bodyData/body-data-persistence.types';
import type { BodyData } from '@/bodyData/body-data.types';
import { useCommonChartOptions } from '@/charting/useCommonChartOptions';
import BodyDataChart from '@/components/BodyDataChart.vue';
import BodyDatatWeeklyWeightChangeChart from '@/components/BodyDatatWeeklyWeightChangeChart.vue';
import CsvImport from '@/components/csv-import/CsvImport.vue';
import DateRangePicker from '@/components/infrastructure/DatePicker/DateRangePicker.vue';
import {
  type DateRange,
  type DateRangeSelectionId,
  emptyDateRange,
} from '@/components/infrastructure/DatePicker/date-range.types';
import { useSimpleMessageBox } from '@/components/infrastructure/composables/useSimpleMessageBox';
import BodyDataWidgetSkeletons from '@/components/widget/BodyDataWidgetSkeletons.vue';
import BodyDataWidgets from '@/components/widget/BodyDataWidgets.vue';
import { MessageKey } from '@/i18n/message-keys.g';
import { bodyDataRepositoryKey } from '@/injection.types';
import { isDate, useLoader } from '@/utils';
import { Plus } from '@element-plus/icons-vue';
import { isMonday, isSameDay, startOfMonth, subDays } from 'date-fns';
import { inject, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

useCommonChartOptions();

const bodyDataRepository = inject(bodyDataRepositoryKey) as BodyDataRepository;
const { t } = useI18n();
const { showAlert } = useSimpleMessageBox();

const dateRange = ref<DateRange>(emptyDateRange);
const bodyData = ref<BodyData[]>([]);
const bodyDataExtended = ref<BodyData[]>([]);

const { run, isLoading } = useLoader({
  initialLoading: true,
  defaultStartDelay: 250,
  skipDelayOnFirstRun: true,
});

const csvImportDialogVisible = ref(false);
const csvImportDialogTooltipDisabled = ref(false);

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

watch(dateRange, () => fetchData(), { deep: true });

const fetchData = async () => {
  if (!isDate(dateRange.value.start) || !isDate(dateRange.value.end)) return;

  const start = dateRange.value.start;
  const end = dateRange.value.end;

  const isFirstDayOfMonth = isSameDay(startOfMonth(start), start);
  const startExtended = isMonday(start) || isFirstDayOfMonth ? subDays(start, 1) : start;

  try {
    await run(async () => {
      const result = await bodyDataRepository.query({ start: startExtended, end });

      bodyDataExtended.value = result;
      bodyData.value = bodyDataExtended.value.filter((x) => x.recordedAt >= start);
    });
  } catch (error) {
    console.error(error);
    showAlert('loading-failed', MessageKey.unexpectedErrorOccured);
  }
};

const openCsvImportDialog = () => {
  csvImportDialogVisible.value = true;
};

watch(csvImportDialogVisible, (newValue) => {
  csvImportDialogTooltipDisabled.value = newValue;
});
</script>

<template>
  <div class="flex flex-row flex-nowrap items-center justify-between">
    <DateRangePicker
      class="w-full"
      v-model:date-range="dateRange"
      :initial-selection="'L6M'"
      :available-selections="datePickerSelction"
    />

    <el-tooltip
      placement="top-end"
      :show-after="500"
      :content="t(MessageKey.importCsvFile)"
      :disabled="csvImportDialogTooltipDisabled"
    >
      <el-button class="self-start" type="primary" :icon="Plus" @click="openCsvImportDialog" />
    </el-tooltip>
  </div>
  <BodyDataWidgetSkeletons v-if="isLoading" class="mt-8" />
  <BodyDataWidgets v-else class="mt-8" :body-data="bodyData" />
  <BodyDatatWeeklyWeightChangeChart
    v-loading="isLoading"
    class="mt-8"
    :body-data="bodyDataExtended"
  />
  <BodyDataChart v-loading="isLoading" class="mt-8" :body-data="bodyData" />
  <CsvImport v-model:visible="csvImportDialogVisible" @refresh="fetchData" />
</template>

<style scope></style>
