<script setup lang="ts">
import type { BodyData } from '@/bodyData/body-data.types';
import BodyDataTable from '@/components/BodyDataTable.vue';

const props = defineProps<{
  bodyData: BodyData[];
  loading: boolean;
}>();
</script>

<template>
  <BodyDataTable
    :body-data="props.bodyData"
    :show-actions-column="false"
    :loading="props.loading"
  />
</template>
