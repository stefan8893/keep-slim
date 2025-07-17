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
      <div class="flex flex-col items-center justify-start">
        <div>
          <el-skeleton style="--el-skeleton-circle-size: 115px" animated>
            <template #template>
              <el-skeleton-item variant="circle" />
              <el-skeleton-item class="single-skeleton-widget mt-4" />
              <el-skeleton-item class="single-skeleton-widget mt-4" />
              <el-skeleton-item class="single-skeleton-widget mt-4" />
            </template>
          </el-skeleton>
        </div>
      </div>
    </template>
  </el-card>
</template>

<style scoped>
.single-skeleton-widget {
  height: 20px;
}
</style>
