<script setup lang="ts">
import { MessageKey } from '@/i18n/message-keys.g';
import { useLanguageStore } from '@/stores/languageStore';
import { computed } from 'vue';

const languageStore = useLanguageStore();
const language = computed(() => languageStore.language);
</script>

<template>
  <el-dropdown>
    <span class="cursor-pointer">
      {{ language.toUpperCase() }}
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="language === 'de'" @click="languageStore.language = 'de'">{{
          $t(MessageKey.german)
        }}</el-dropdown-item>
        <el-dropdown-item :disabled="language === 'en'" @click="languageStore.language = 'en'">{{
          $t(MessageKey.english)
        }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
