<script setup lang="ts">
import Highcharts from 'highcharts';
import { onMounted, ref } from 'vue';

const chart = ref(null);

onMounted(() => {
  if (!chart.value) return;

  Highcharts.chart(chart.value, {
    chart: {
      type: 'line',
    },
    title: {
      text: 'Highcharts ohne Wrapper',
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'März', 'Apr'],
    },
    series: [
      {
        name: 'Beispielreihe',
        data: [1, 3, 2, 4],
        type: 'line',
      },
    ],
  });
});
</script>

<template>
  <div ref="chart"></div>
</template>

<style scoped></style>
