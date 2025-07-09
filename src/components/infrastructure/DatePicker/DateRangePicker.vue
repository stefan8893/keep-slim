<script setup lang="ts">
import {
  type DateRangeSelectionId,
  dateRangeSelections,
} from '@/components/infrastructure/DatePicker/DateRangeSelection';
import { MessageKey } from '@/i18n/message-keys.g';
import { ArrowDown } from '@element-plus/icons-vue';
import { addDays, isSameDay } from 'date-fns';
import { computed, ref, watch } from 'vue';

import DateRangeStringified from './DateRangeStringified.vue';
import SingleDatePicker from './SingleDatePicker.vue';

const props = defineProps<{
  availableSelections: DateRangeSelectionId[];
  initialSelection?: DateRangeSelectionId;
  minDate?: Date;
  maxDate?: Date;
}>();

const minDate = computed(() => props.minDate ?? new Date(2000, 0));
const maxDate = computed(() => props.maxDate ?? addDays(new Date(), 2));

const start = defineModel<Date | undefined>('start');
const end = defineModel<Date | undefined>('end');

const currentSelectionId = ref(
  props.initialSelection ??
    (props.availableSelections.length > 0 ? props.availableSelections[0] : 'CUSTOM'),
);

const currentSelection = computed(() => dateRangeSelections.get(currentSelectionId.value)!);

watch(
  currentSelection,
  () => {
    const range = currentSelection.value.range();
    start.value = range.start;
    end.value = range.end;
  },
  { immediate: true },
);

const disabledStartDates = (date: Date) => {
  if (!start.value) return false;

  if (isSameDay(start.value, date)) return false;

  if (date < minDate.value) return true;

  if (!!end.value && isSameDay(end.value, date)) return false;

  if (!!end.value && date > end.value) return true;

  return false;
};

const disabledEndDates = (date: Date) => {
  if (!end.value) return false;

  if (isSameDay(end.value, date)) return false;

  if (date > maxDate.value) return true;

  if (!!start.value && isSameDay(start.value, date)) return false;

  if (!!start.value && date < start.value) return true;

  return false;
};
</script>

<template>
  <div class="flex min-h-8 flex-row flex-wrap items-start justify-start gap-3 sm:items-center">
    <el-dropdown>
      <span class="daterange-dropdown">
        {{ $t(currentSelection.messageKey) }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="id in props.availableSelections"
            :key="id"
            @click="currentSelectionId = id"
          >
            {{ $t(dateRangeSelections.get(id)!.messageKey) }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <div v-if="currentSelectionId !== 'CUSTOM'">
      <DateRangeStringified :start="start" :end="end" />
    </div>

    <div v-else class="flex flex-col gap-3 sm:flex-row">
      <div>
        <SingleDatePicker
          v-model="start"
          :disabled-date="disabledStartDates"
          :placeholder="$t(MessageKey.startDate)"
        />
      </div>
      <div>
        <SingleDatePicker
          v-model="end"
          :disabled-date="disabledEndDates"
          :placeholder="$t(MessageKey.endDate)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.daterange-dropdown {
  cursor: pointer;
  color: var(--el-color-primary);
}
</style>
