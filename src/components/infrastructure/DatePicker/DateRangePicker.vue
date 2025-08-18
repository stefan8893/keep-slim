<script setup lang="ts">
import DateRangeSelectionDropdown from '@/components/infrastructure/DatePicker/DateRangeSelectionDropdown.vue';
import DateRangeStringified from '@/components/infrastructure/DatePicker/DateRangeStringified.vue';
import SingleDatePicker from '@/components/infrastructure/DatePicker/SingleDatePicker.vue';
import { dateRangeSelections } from '@/components/infrastructure/DatePicker/date-range-selection';
import {
  type DateRange,
  type DateRangeSelectionId,
  emptyDateRange,
} from '@/components/infrastructure/DatePicker/date-range.types';
import {
  isEndDateDisabled,
  isStartDateDisabled,
} from '@/components/infrastructure/DatePicker/disabled-dates.ts';
import { MessageKey } from '@/i18n/message-keys.g';
import { addDays, endOfDay } from 'date-fns';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
  availableSelections: DateRangeSelectionId[];
  initialSelection?: DateRangeSelectionId;
  minDate?: Date;
  maxDate?: Date;
}>();

const minDate = computed(() => props.minDate ?? new Date(2000, 0));
const maxDate = computed(() => props.maxDate ?? endOfDay(addDays(new Date(), 2)));

const dateRange = defineModel<DateRange>('dateRange', {
  default: emptyDateRange,
});

const currentSelectionId = ref<DateRangeSelectionId>(
  props.initialSelection ??
    (props.availableSelections.length > 0 ? props.availableSelections.at(0)! : 'CUSTOM'),
);

const currentSelection = computed(() => dateRangeSelections.get(currentSelectionId.value)!);

const initialRange = dateRangeSelections.get(currentSelectionId.value)?.range();
[dateRange.value.start, dateRange.value.end] = [initialRange?.start, initialRange?.end];

watch(
  currentSelection,
  () => {
    if (currentSelectionId.value !== 'CUSTOM') {
      const range = currentSelection.value.range();
      [dateRange.value.start, dateRange.value.end] = [range?.start, range?.end];
    }
  },
  { immediate: false },
);

const disabledStartDates = (date: Date) =>
  isStartDateDisabled(date, minDate.value, maxDate.value, dateRange.value.end);

const disabledEndDates = (date: Date) =>
  isEndDateDisabled(date, minDate.value, maxDate.value, dateRange.value.start);
</script>

<template>
  <div class="date-range-picker-container">
    <div class="date-range-picker">
      <DateRangeSelectionDropdown
        class="date-range-picker-dropdown"
        v-model:current-selection-id="currentSelectionId"
        :available-selections="availableSelections"
        :current-selection="currentSelection"
      />

      <div v-if="currentSelectionId !== 'CUSTOM'" class="date-range-picker-stringified">
        <DateRangeStringified :start="dateRange.start" :end="dateRange.end" />
      </div>

      <div
        v-if="currentSelectionId === 'CUSTOM'"
        class="date-range-picker-custom-start single-date-picker"
      >
        <SingleDatePicker
          v-model="dateRange.start"
          :disabled-date="disabledStartDates"
          :placeholder="$t(MessageKey.startDate)"
        />
      </div>
      <div
        v-if="currentSelectionId === 'CUSTOM'"
        class="date-range-picker-custom-end single-date-picker"
      >
        <SingleDatePicker
          v-model="dateRange.end"
          :disabled-date="disabledEndDates"
          :placeholder="$t(MessageKey.endDate)"
          :set-time-to-end-of-day="true"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.date-range-picker-container {
  container-type: inline-size;
  container-name: date-range-picker;
}

.date-range-picker {
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: auto auto auto 1fr;

  grid-template-areas: 'dropdown custom-start custom-end date-stringified';
}

.date-range-picker-dropdown {
  grid-area: dropdown;
}

.date-range-picker-stringified {
  grid-area: date-stringified;

  margin-left: 0.75rem;
}

.date-range-picker-custom-start {
  grid-area: custom-start;
}

.date-range-picker-custom-end {
  grid-area: custom-end;
}

.single-date-picker {
  margin-left: 0.75rem;
}

@container date-range-picker (382px <= width < 630px) {
  .date-range-picker {
    grid-template-rows: auto auto;
    grid-template-columns: auto auto 1fr;

    grid-template-areas:
      'dropdown custom-start date-stringified'
      '. custom-end .';
  }

  .date-range-picker-custom-end {
    margin-top: 0.75rem;
  }
}

@container date-range-picker (width < 382px) {
  .date-range-picker {
    grid-template-columns: auto;
    grid-template-rows: auto auto auto auto;
    grid-template-areas:
      'dropdown . . .'
      'custom-start . . .'
      'custom-end . . .'
      'date-stringified . . .';
  }

  .date-range-picker-stringified {
    margin-left: 0;
    margin-top: 0.75rem;
  }

  .single-date-picker {
    margin-left: 0;
    margin-top: 0.75rem;
  }
}
</style>
