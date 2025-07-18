<script setup lang="ts">
import type { BodyData } from '@/bodyData/body-data.types';
import { formatDateTime } from '@/i18n/date-utils';
import { MessageKey } from '@/i18n/message-keys.g';
import { Delete } from '@element-plus/icons-vue';
import { compareAsc, compareDesc, isDate } from 'date-fns';
import { computed, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    bodyData: BodyData[];
    showActionsColumn?: boolean;
  }>(),
  {
    showActionsColumn: true,
  },
);

const tooltipDisabled = ref(false);

const emit = defineEmits<{
  (event: 'deleteRecord', recordedAt: Date): void;
}>();

const bodyData = computed(() =>
  props.bodyData.map((x) => ({
    ...x,
    muscleMass: x.muscleMass / 100,
    bodyFat: x.bodyFat / 100,
    water: x.water / 100,
  })),
);

const pageSize = ref(10);
const currentPage = ref(1);

const maxPages = computed(() => Math.ceil(bodyData.value.length / pageSize.value));

const sortProp = ref<keyof BodyData | undefined>();
const sortOrder = ref<string>('');

const sortedBodyData = computed(() => {
  if (!sortProp.value || !sortOrder.value) {
    return [...bodyData.value].sort((a, b) => compareAsc(b.recordedAt, a.recordedAt));
  }

  return [...bodyData.value].sort((a, b) => {
    const left = a[sortProp.value!];
    const right = b[sortProp.value!];

    const asc = sortOrder.value === 'ascending';

    if (isDate(left) && isDate(right))
      return asc ? compareAsc(left, right) : compareDesc(left, right);

    if (left === right) return 0;
    const result = left > right ? 1 : -1;

    return asc ? result : -result;
  });
});

const startOfCurrentPage = computed(() => (currentPage.value - 1) * pageSize.value);
const endOfCurrentPage = computed(() => startOfCurrentPage.value + pageSize.value);

const currentSortedBodyDataPage = computed(() =>
  sortedBodyData.value.slice(startOfCurrentPage.value, endOfCurrentPage.value),
);

const onSortChange = ({ prop, order }: { prop: keyof BodyData; order: string }) => {
  sortProp.value = prop;
  sortOrder.value = order;
  currentPage.value = 1;
};

const deleteRecord = async (recordedAt: Date) => {
  tooltipDisabled.value = true;
  emit('deleteRecord', recordedAt);
  setTimeout(() => (tooltipDisabled.value = false), 1000);
};
</script>

<template>
  <div class="table-container">
    <el-table :data="currentSortedBodyDataPage" @sort-change="onSortChange" width="100%">
      <el-table-column prop="recordedAt" width="170px" sortable :label="$t(MessageKey.recorded)">
        <template #default="scope">{{ formatDateTime(scope.row.recordedAt) }}</template>
      </el-table-column>
      <el-table-column prop="weight" min-width="110px" sortable :label="$t(MessageKey.weight)">
        <template #default="scope">{{ $n(scope.row.weight, 'weight') }}</template>
      </el-table-column>
      <el-table-column
        prop="muscleMass"
        min-width="145px"
        sortable
        :label="$t(MessageKey.muscleMass)"
      >
        <template #default="scope">{{ $n(scope.row.muscleMass, 'percent') }}</template>
      </el-table-column>
      <el-table-column prop="bodyFat" min-width="120px" sortable :label="$t(MessageKey.bodyFat)">
        <template #default="scope">{{ $n(scope.row.bodyFat, 'percent') }}</template>
      </el-table-column>
      <el-table-column prop="water" min-width="140px" sortable :label="$t(MessageKey.water)">
        <template #default="scope">{{ $n(scope.row.water, 'percent') }}</template>
      </el-table-column>
      <el-table-column prop="bmi" min-width="80px" sortable :label="$t(MessageKey.bmiShort)">
        <template #default="scope">{{ $n(scope.row.bmi, 'decimal') }}</template>
      </el-table-column>

      <el-table-column
        prop="dailyCalorieRequirement"
        min-width="110px"
        sortable
        :label="$t(MessageKey.calories)"
      >
        <template #default="scope"
          >{{ $n(scope.row.dailyCalorieRequirement, 'decimal') }}
          {{ $t(MessageKey.calorieUnit) }}</template
        >
      </el-table-column>

      <el-table-column
        v-if="props.showActionsColumn"
        fixed="right"
        width="100%"
        :label="$t(MessageKey.actions)"
      >
        <template #header>
          <div class="flex flex-row flex-nowrap items-center justify-center">
            <span>{{ $t(MessageKey.actions) }} </span>
          </div>
        </template>
        <template #default="scope">
          <div class="flex flex-row flex-wrap items-center justify-center">
            <el-button link type="primary" @click="deleteRecord(scope.row.recordedAt)">
              <el-tooltip
                class="box-item"
                placement="top"
                :show-after="1000"
                :content="$t(MessageKey.delete)"
                :disabled="tooltipDisabled"
              >
                <el-icon size="large"><Delete /></el-icon>
              </el-tooltip>
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex flex-row flex-wrap items-center justify-center">
      <el-pagination
        class="mt-4"
        background
        layout="prev, pager, next"
        v-model:current-page="currentPage"
        :hide-on-single-page="true"
        :page-count="maxPages"
        :total="bodyData.length"
      />
    </div>
  </div>
</template>

<style scoped>
.table-container {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
}
</style>
