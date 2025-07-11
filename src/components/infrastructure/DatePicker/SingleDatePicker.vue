<script setup lang="ts">
import { useElementPlusLocales } from '@/i18n/useLocales';
import { useLocaleStore } from '@/stores/localeStore';
import { endOfDay } from 'date-fns';
import { computed, ref, watch } from 'vue';

defineOptions({
  inheritAttrs: false,
});
const localeStore = useLocaleStore();
const { getDateFormatString } = useElementPlusLocales();

const props = defineProps({
  setTimeToEndOfDay: {
    type: Boolean,
    default: false,
  },
});

const model = defineModel<Date | undefined>();

const dateInternal = ref(model.value);

const dateFormat = computed(() => getDateFormatString(localeStore.locale));

watch(dateInternal, () => {
  model.value =
    !!dateInternal.value && props.setTimeToEndOfDay
      ? endOfDay(dateInternal.value)
      : dateInternal.value;
});
</script>

<template>
  <el-date-picker v-model="dateInternal" type="date" v-bind="$attrs" :format="dateFormat" />
</template>

<style scoped>
.date-picker-width {
  width: 160px !important;
}
</style>
