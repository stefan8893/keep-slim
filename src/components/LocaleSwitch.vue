<script setup lang="ts">
import { useLocaleStore } from '@/stores/localeStore';

const localeStore = useLocaleStore();
</script>

<template>
  <el-radio-group v-model="localeStore.locale" size="small">
    <el-radio-button label="de-AT" value="de-AT" />
    <el-radio-button label="en-US" value="en-US" />
  </el-radio-group>
</template>
