<script setup lang="ts">
import { dateRangeSelections } from '@/components/infrastructure/DatePicker/date-range-selection';
import type {
  DateRangeSelection,
  DateRangeSelectionId,
} from '@/components/infrastructure/DatePicker/date-range.types';
import { ArrowDown } from '@element-plus/icons-vue';

const currentSelectionId = defineModel<DateRangeSelectionId>('currentSelectionId', {
  required: true,
});

const props = defineProps<{
  availableSelections: DateRangeSelectionId[];
  currentSelection: DateRangeSelection;
}>();
</script>

<template>
  <el-dropdown class="date-range-picker-dropdown">
    <el-text
      class="flex cursor-pointer flex-row flex-nowrap items-center justify-center"
      type="primary"
    >
      {{ $t(currentSelection.messageKey) }}
      <el-icon class="ml-1"><ArrowDown /></el-icon>
    </el-text>
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
</template>
