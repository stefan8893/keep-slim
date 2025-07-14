<script setup lang="ts">
import type { BodyData } from '@/bodyData/body-data.types';
import { formatDateTime } from '@/i18n/date-utils';
import { MessageKey } from '@/i18n/message-keys.g';
import { computed } from 'vue';

const props = defineProps<{
  bodyData: BodyData[];
}>();

const bodyData = computed(() =>
  props.bodyData.map((x) => ({
    ...x,
    muscleMass: x.muscleMass / 100,
    bodyFat: x.bodyFat / 100,
    water: x.water / 100,
  })),
);
</script>

<template>
  <div class="table-container">
    <el-card>
      <el-table :data="bodyData" style="width: 100%">
        <el-table-column prop="recordedAt" :label="$t(MessageKey.recorded)">
          <template #default="scope">{{ formatDateTime(scope.row.recordedAt) }}</template>
        </el-table-column>
        <el-table-column prop="weight" :label="$t(MessageKey.weight)">
          <template #default="scope">{{ $n(scope.row.weight, 'weight') }}</template>
        </el-table-column>
        <el-table-column prop="muscleMass" :label="$t(MessageKey.muscleMass)">
          <template #default="scope">{{ $n(scope.row.muscleMass, 'percent') }}</template>
        </el-table-column>
        <el-table-column prop="bodyFat" :label="$t(MessageKey.bodyFat)">
          <template #default="scope">{{ $n(scope.row.bodyFat, 'percent') }}</template>
        </el-table-column>
        <el-table-column prop="water" :label="$t(MessageKey.water)">
          <template #default="scope">{{ $n(scope.row.water, 'percent') }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.table-container {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
}
</style>
