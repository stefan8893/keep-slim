<script setup lang="ts">
import { themingControlKey } from '@/injection.types';
import type { ThemingControl } from '@/plugins/theming.plugin';
import Highcharts from 'highcharts';
import 'highcharts/modules/accessibility';
import 'highcharts/themes/adaptive';
import { inject, onMounted, ref } from 'vue';

const { isDark } = inject(themingControlKey) as ThemingControl;

Highcharts.setOptions({
  chart: {
    backgroundColor: 'transparent',
    reflow: true,
  },
  responsive: {
    rules: [],
  },
  tooltip: {
    backgroundColor: 'var(--el-text-color-primary)',
    style: {
      color: 'var(--el-bg-color)',
    },
  },
});

const chart = ref<Highcharts.Chart | null>(null);

onMounted(() => {
  chart.value = Highcharts.chart('chart', {
    chart: {
      type: 'bar',
      reflow: true,
    },
    title: {
      text: '',
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'März', 'Apr'],
    },
    series: [
      {
        name: 'Beispielreihe',
        data: [1, 3, 2, 4],
        type: 'bar',
      },
    ],
  });
});
</script>

<template>
  <el-card class="block overflow-hidden">
    <div class="grid-container">
      <div class="block" id="chart" :class="isDark ? 'highcharts-dark' : 'highcharts-light'"></div>
    </div>
  </el-card>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
}
</style>
