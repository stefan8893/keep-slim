<script setup lang="ts">
import { MessageKey } from '@/i18n/message-keys.g';
</script>

<template>
  <el-result
    icon="success"
    :title="$t(MessageKey.importComplete)"
    :sub-title="$t(MessageKey.csvImportSuccess)"
  >
  </el-result>
</template>
