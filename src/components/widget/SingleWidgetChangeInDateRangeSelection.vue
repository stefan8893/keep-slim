<script setup lang="ts">
import type { WidgetOptions } from '@/components/widget/single-widget.types';
import { Bottom, Top } from '@element-plus/icons-vue';
import { computed } from 'vue';

const props = defineProps<{
  changeInSelectedTimeRange?: number;
  options: WidgetOptions;
}>();

const changeInSelectedTimeRange = computed(() => props?.changeInSelectedTimeRange ?? -1);

type IconToShow = 'none' | 'up' | 'down';

const iconToShow = computed((): IconToShow => {
  if (!props?.changeInSelectedTimeRange || props.changeInSelectedTimeRange === 0) return 'none';
  else return props.changeInSelectedTimeRange > 0 ? 'up' : 'down';
});
</script>

<template>
  <el-icon v-if="iconToShow === 'up'" size="large"><Top /></el-icon>
  <el-icon v-if="iconToShow === 'down'" size="large"><Bottom /></el-icon>
  <el-text size="large">
    <i18n-n
      tag="span"
      :value="changeInSelectedTimeRange"
      :format="options.numberFormat"
      scope="global"
    >
      <template #unit="slotProps">
        <span class="text-sm">{{ slotProps.unit }}</span>
      </template>
    </i18n-n>
  </el-text>
</template>
