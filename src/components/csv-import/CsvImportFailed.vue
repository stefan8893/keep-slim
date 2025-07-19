<script setup lang="ts">
import { MessageKey } from '@/i18n/message-keys.g';
</script>

<template>
  <el-result
    icon="error"
    :title="$t(MessageKey.importFailed)"
    :sub-title="$t(MessageKey.csvImportFailed)"
  >
  </el-result>
</template>
