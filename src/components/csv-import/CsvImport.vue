<script setup lang="ts">
import type { BodyDataCsvImportService } from '@/bodyData/body-data-persistence.types';
import type { BodyData } from '@/bodyData/body-data.types';
import CsvImportFailed from '@/components/csv-import/CsvImportFailed.vue';
import CsvImportFileSelection from '@/components/csv-import/CsvImportFileSelection.vue';
import CsvImportPreview from '@/components/csv-import/CsvImportPreview.vue';
import CsvImportSuccess from '@/components/csv-import/CsvImportSuccess.vue';
import type { CsvImport } from '@/components/csv-import/csv-import.types';
import { MessageKey } from '@/i18n/message-keys.g';
import { bodyDataCsvImportServiceKey } from '@/injection.types';
import { useLoader } from '@/utils';
import { computed, inject, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

type Step = 'FileSelection' | 'Preview' | 'Failed' | 'Succeeded';

const csvImportService = inject(bodyDataCsvImportServiceKey) as BodyDataCsvImportService;
const { t } = useI18n();
const { run, isLoading } = useLoader({ defaultStartDelay: 150 });

const visible = defineModel<boolean>('visible');
const emit = defineEmits(['refresh']);
const csvImport = ref<CsvImport>({
  csvFile: null,
  newRecords: [],
});

const activeStep = ref<Step>('FileSelection');
const errorOnLoadingPreview = ref('');

const loadPreview = async (): Promise<BodyData[]> => {
  if (!csvImport.value.csvFile) return [];

  return await csvImportService.getPreview(csvImport.value.csvFile);
};

const importCsv = () => {
  if (!csvImport.value.csvFile) return;

  return run(() => csvImportService.import(csvImport.value.csvFile!));
};

const goBack = () => {
  if (activeStep.value === 'FileSelection') visible.value = false;
  else if (activeStep.value === 'Preview') activeStep.value = 'FileSelection';
  else if (activeStep.value === 'Failed') activeStep.value = 'Preview';
};

const backLabelMessageKey = computed(() => {
  const labelByStep: Map<Step, MessageKey> = new Map([
    ['FileSelection', 'cancel'],
    ['Preview', 'back'],
    ['Failed', 'back'],
  ]);

  return labelByStep.get(activeStep.value) ?? 'cancel';
});

const showBack = computed(() => activeStep.value !== 'Succeeded');

const goToPreview = async () => {
  try {
    const loadingPreviewPromise = run(() => loadPreview());
    activeStep.value = 'Preview';
    csvImport.value.newRecords = await loadingPreviewPromise;
  } catch (error) {
    console.error(error);
    errorOnLoadingPreview.value = t(MessageKey.errorWhileProcessingCsv);
    csvImport.value.csvFile = null;
    activeStep.value = 'FileSelection';
  }
};

const finishImport = async () => {
  try {
    await importCsv();
    emit('refresh');
    activeStep.value = 'Succeeded';
  } catch (error) {
    console.error(error);
    activeStep.value = 'Failed';
  }
};

const goForward = () => {
  if (
    activeStep.value === 'FileSelection' &&
    !!csvImport.value.csvFile &&
    !errorOnLoadingPreview.value
  ) {
    goToPreview();
  } else if (activeStep.value === 'Preview' && csvImport.value.newRecords.length > 0) {
    finishImport();
  } else if (activeStep.value === 'Succeeded') visible.value = false;
  else if (activeStep.value === 'Failed') {
    reset();
  }
};

const forwardEnabled = computed(
  () =>
    (activeStep.value === 'FileSelection' &&
      !!csvImport.value.csvFile &&
      !errorOnLoadingPreview.value) ||
    (activeStep.value === 'Preview' && csvImport.value.newRecords.length > 0) ||
    activeStep.value === 'Succeeded' ||
    activeStep.value === 'Failed',
);

const forwardLabelMessageKey = computed(() => {
  const labelByStep: Map<Step, MessageKey> = new Map([
    ['FileSelection', 'next'],
    ['Preview', 'import'],
    ['Succeeded', 'close'],
    ['Failed', 'retry'],
  ]);

  return labelByStep.get(activeStep.value) ?? 'Ok';
});

const reset = () => {
  activeStep.value = 'FileSelection';
  errorOnLoadingPreview.value = '';
  csvImport.value.csvFile = null;
  csvImport.value.newRecords = [];
};

watch(
  csvImport,
  (newValue) => {
    if (!!newValue.csvFile) errorOnLoadingPreview.value = '';
  },
  { deep: true },
);
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
          <el-alert v-if="errorOnLoadingPreview" :title="errorOnLoadingPreview" type="error" />
        </div>

        <div v-show="activeStep === 'Preview'">
          <CsvImportPreview
            v-loading="isLoading"
            :body-data="csvImport.newRecords"
            :loading="false"
          />
        </div>

        <div v-show="activeStep === 'Succeeded'">
          <CsvImportSuccess />
        </div>
        <div v-show="activeStep === 'Failed'">
          <CsvImportFailed />
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

@media (width < 67rem) {
  .csv-import-dialog {
    width: calc(100% - 3rem);
  }
}
</style>
