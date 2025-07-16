<script setup lang="ts">
import type { BodyDataCsvImportService } from '@/bodyData/body-data-persistence.types';
import type { BodyData } from '@/bodyData/body-data.types';
import CsvImportFileSelection from '@/components/csv-import/CsvImportFileSelection.vue';
import CsvImportPreview from '@/components/csv-import/CsvImportPreview.vue';
import type { CsvImport } from '@/components/csv-import/csv-import.types';
import { MessageKey } from '@/i18n/message-keys.g';
import { bodyDataCsvImportServiceKey } from '@/injection.types';
import { computed, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import CsvImportSuccess from './CsvImportSuccess.vue';

type Step = 'FileSelection' | 'Preview' | 'Succeeded';

const csvImportService = inject(bodyDataCsvImportServiceKey) as BodyDataCsvImportService;
const { t } = useI18n();

const visible = defineModel<boolean>('visible');
const emit = defineEmits(['refresh']);
const csvImport = ref<CsvImport>({
  csvFile: null,
  newRecords: [],
});

const activeStep = ref<Step>('FileSelection');

const loadPreview = async (): Promise<BodyData[]> => {
  if (!csvImport.value.csvFile) return [];

  return await csvImportService.getPreview(csvImport.value.csvFile);
};

const importCsv = () => {
  if (!csvImport.value.csvFile) return;

  return csvImportService.import(csvImport.value.csvFile);
};

const goBack = () => {
  if (activeStep.value === 'FileSelection') visible.value = false;
  else if (activeStep.value === 'Preview') activeStep.value = 'FileSelection';
};

const backLabelMessageKey = computed(() => {
  const labelByStep: Map<Step, MessageKey> = new Map([
    ['FileSelection', 'cancel'],
    ['Preview', 'back'],
  ]);

  return labelByStep.get(activeStep.value) ?? 'cancel';
});

const showBack = computed(() => activeStep.value !== 'Succeeded');

const goForward = async () => {
  if (activeStep.value === 'FileSelection' && !!csvImport.value.csvFile) {
    csvImport.value.newRecords = await loadPreview();
    activeStep.value = 'Preview';
  } else if (activeStep.value === 'Preview' && csvImport.value.newRecords.length > 0) {
    await importCsv();
    emit('refresh');
    activeStep.value = 'Succeeded';
  } else if (activeStep.value === 'Succeeded') visible.value = false;
};

const forwardEnabled = computed(
  () =>
    (activeStep.value === 'FileSelection' && !!csvImport.value.csvFile) ||
    (activeStep.value === 'Preview' && csvImport.value.newRecords.length > 0) ||
    activeStep.value === 'Succeeded',
);

const forwardLabelMessageKey = computed(() => {
  const labelByStep: Map<Step, MessageKey> = new Map([
    ['FileSelection', 'next'],
    ['Preview', 'import'],
    ['Succeeded', 'close'],
  ]);

  return labelByStep.get(activeStep.value) ?? 'Ok';
});

const reset = () => {
  activeStep.value = 'FileSelection';
  csvImport.value.csvFile = null;
  csvImport.value.newRecords = [];
};
</script>

<template>
  <el-dialog
    v-model="visible"
    class="csv-import-dialog"
    :title="t(MessageKey.importCsvFile)"
    :close-on-click-modal="false"
    :close-on-press-escape="true"
    :destroy-on-close="false"
    @closed="reset"
  >
    <template #default>
      <div class="">
        <div v-show="activeStep === 'FileSelection'">
          <CsvImportFileSelection v-model:selected-file="csvImport.csvFile" />
        </div>

        <div v-show="activeStep === 'Preview'">
          <CsvImportPreview :body-data="csvImport.newRecords" :loading="false" />
        </div>

        <div v-show="activeStep === 'Succeeded'">
          <CsvImportSuccess />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="csv-import-dialog-footer">
        <el-button v-show="showBack" @click="goBack">{{ $t(backLabelMessageKey) }}</el-button>
        <el-button type="primary" :disabled="!forwardEnabled" @click="goForward">{{
          $t(forwardLabelMessageKey)
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style>
.csv-import-dialog {
  width: 100%;
  max-width: 64rem;
}

@media (width < 64rem) {
  .csv-import-dialog {
    width: 90%;
  }
}
</style>
