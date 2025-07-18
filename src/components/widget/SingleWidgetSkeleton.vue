<script setup lang="ts">
const props = defineProps<{
  titleMessageKey: string;
}>();
</script>

<template>
  <el-card>
    <template #header>
      <div class="flex flex-row flex-nowrap items-center justify-between">
        <el-text size="large">{{ $t(props.titleMessageKey) }}</el-text>
      </div>
    </template>
    <template #default>
      <div class="flex flex-col flex-nowrap items-center justify-start">
        <div class="w-40">
          <el-skeleton style="--el-skeleton-circle-size: 115px" animated>
            <template #template>
              <div class="flex flex-col flex-nowrap items-center justify-start">
                <el-skeleton-item variant="circle" />
                <el-skeleton-item class="skeleton-widget-item mt-4" />
                <el-skeleton-item class="skeleton-widget-item mt-6" />
                <el-skeleton-item class="skeleton-widget-item mt-6" />
              </div>
            </template>
          </el-skeleton>
        </div>
      </div>
    </template>
  </el-card>
</template>

<style scoped>
.skeleton-widget-item {
  height: 21px;
}
</style>
