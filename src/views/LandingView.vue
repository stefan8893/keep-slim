<script setup lang="ts">
import { useAuth } from '@/auth/useAuth';
import LanguageDropdown from '@/components/LanguageDropdown.vue';
import ThemeDropdown from '@/components/ThemeDropdown.vue';
import { MessageKey } from '@/i18n/message-keys.g';
import TheLayout from '@/layouts/TheLayout.vue';

const { login } = useAuth();
</script>

<template>
  <TheLayout>
    <template #headerRight>
      <ThemeDropdown class="light-color ml-5 sm:ml-10" />
      <LanguageDropdown class="light-color ml-5 sm:ml-10" />
      <el-button type="primary" @click="login" class="ml-5 sm:ml-10">{{
        $t(MessageKey.login)
      }}</el-button>
    </template>
    <template #default>
      <div class="flex h-full flex-col flex-nowrap items-center justify-center">
        <el-result icon="primary" :title="$t(MessageKey.underConstruction)">
          <template #extra>
            <el-button type="primary" @click="login">{{ $t(MessageKey.login) }}</el-button>
          </template>
        </el-result>
      </div>
    </template>
  </TheLayout>
</template>

<style scoped>
.light-color {
  color: var(--el-text-color-regular-dark);
}
</style>
