<script setup lang="ts">
import { MessageKey } from '@/i18n/message-keys.g';
import { ArrowDown } from '@element-plus/icons-vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const activeMenu = computed(() => {
  const path = route.path;

  if (path === '/home') return '';

  return path;
});
</script>

<template>
  <el-menu
    class="nav-bar select-none"
    mode="horizontal"
    :default-active="activeMenu"
    :show-timeout="0"
    :router="true"
    :ellipsis-icon="ArrowDown"
  >
    <el-menu-item index="body-data">{{ $t(MessageKey.bodyData) }}</el-menu-item>
  </el-menu>
</template>

<style scoped>
.nav-bar.el-menu--horizontal.el-menu {
  border-bottom: none;
}
</style>
