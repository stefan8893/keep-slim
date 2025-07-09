<script setup lang="ts">
import { dateRangeSelections } from '@/components/infrastructure/DatePicker/date-range-selection';
import type { DateRangeSelectionId } from '@/components/infrastructure/DatePicker/date-range.types';
import { MessageKey } from '@/i18n/message-keys.g';
import { addDays, endOfDay } from 'date-fns';
import { computed, ref, watch } from 'vue';

import DateRangeSelectionDropdown from './DateRangeSelectionDropdown.vue';
import DateRangeStringified from './DateRangeStringified.vue';
import SingleDatePicker from './SingleDatePicker.vue';
import { isEndDateDisabled, isStartDateDisabled } from './disabled-dates';

const props = defineProps<{
  availableSelections: DateRangeSelectionId[];
  initialSelection?: DateRangeSelectionId;
  minDate?: Date;
  maxDate?: Date;
}>();

const minDate = computed(() => props.minDate ?? new Date(2000, 0));
const maxDate = computed(() => props.maxDate ?? endOfDay(addDays(new Date(), 2)));

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
    if (currentSelectionId.value !== 'CUSTOM') {
      const range = currentSelection.value.range();
      start.value = range.start;
      end.value = range.end;
    }
  },
  { immediate: true },
);

const disabledStartDates = (date: Date) =>
  isStartDateDisabled(date, minDate.value, maxDate.value, end.value);

const disabledEndDates = (date: Date) =>
  isEndDateDisabled(date, minDate.value, maxDate.value, start.value);
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
        <DateRangeStringified :start="start" :end="end" />
      </div>

      <div
        v-if="currentSelectionId === 'CUSTOM'"
        class="date-range-picker-custom-start single-date-picker"
      >
        <SingleDatePicker
          v-model="start"
          :disabled-date="disabledStartDates"
          :placeholder="$t(MessageKey.startDate)"
        />
      </div>
      <div
        v-if="currentSelectionId === 'CUSTOM'"
        class="date-range-picker-custom-end single-date-picker"
      >
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
