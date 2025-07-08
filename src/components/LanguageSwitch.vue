<script setup lang="ts">
import { useLanguageStore } from '@/stores/languageStore';

const languageStore = useLanguageStore();
</script>

<template>
  <el-radio-group v-model="languageStore.language" size="small">
    <el-radio-button label="DE" value="de" />
    <el-radio-button label="EN" value="en" />
  </el-radio-group>
</template>
