<script setup lang="ts">
const props = defineProps<{
  titleMessageKey: string;
}>();
</script>

<template>
  <div>
    <el-card>
      <template #header>{{ $t(props.titleMessageKey) }}</template>
    </el-card>
  </div>
</template>
