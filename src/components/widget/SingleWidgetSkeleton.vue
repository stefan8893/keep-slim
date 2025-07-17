<script setup lang="ts">
const props = defineProps<{
  titleMessageKey: string;
}>();
</script>

<template>
  <el-card class="">
    <template #header>
      <div class="flex flex-row flex-nowrap items-center justify-between">
        <el-text size="large">{{ $t(props.titleMessageKey) }}</el-text>
      </div>
    </template>
    <template #default>
      <el-skeleton
        style="--el-skeleton-circle-size: 115px"
        animated
        class="flex w-40 flex-col flex-nowrap items-center justify-start"
      >
        <template #template>
          <el-skeleton-item variant="circle" />
          <el-skeleton-item class="single-skeleton-widget mt-4" />
          <el-skeleton-item class="single-skeleton-widget mt-4" />
          <el-skeleton-item class="single-skeleton-widget mt-4" />
        </template>
      </el-skeleton>
    </template>
  </el-card>
</template>

<style scoped>
.single-skeleton-widget {
  height: 27px;
}
</style>
