<script setup lang="ts">
import ThemeDropdown from '@/components/ThemeDropdown.vue';
import { MessageKey } from '@/i18n/message-keys.g';
import TheLayout from '@/layouts/TheLayout.vue';
import { DeleteLocation } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = async () => {
  router.replace('/');
};
</script>

<template>
  <TheLayout>
    <template #headerRight>
      <ThemeDropdown class="light-color" />
    </template>
    <template #default>
      <div class="flex h-full flex-col flex-nowrap items-center justify-center">
        <el-result :title="$t(MessageKey.pageNotFound)">
          <template #icon>
            <el-icon size="70"><DeleteLocation /></el-icon>
          </template>
          <template #extra>
            <el-button type="primary" @click="goHome">{{ $t(MessageKey.goHome) }}</el-button>
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
