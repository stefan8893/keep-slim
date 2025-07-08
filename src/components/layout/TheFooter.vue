<script setup lang="ts">
import packageInfo from '@/../package.json';
</script>

<template>
  <div class="flex flex-row flex-nowrap items-center justify-end">
    <div>
      <el-link target="_blank" underline="never" href="https://github.com/stefan8893/keep-slim">
        <img src="@/assets/github-logo.svg" alt="Github Logo" />
      </el-link>
    </div>
    <div class="my-auto ml-3">
      <span>{{ packageInfo.version }}</span>
    </div>
  </div>
</template>
