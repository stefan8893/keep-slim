<script setup lang="ts">
import { MessageKey } from '@/i18n/message-keys.g';
import { themingControlKey } from '@/injection.types';
import type { ThemingControl } from '@/plugins/theming.plugin';
import { Moon, Sunny } from '@element-plus/icons-vue';
import { inject } from 'vue';

const { colorScheme, isDark } = inject(themingControlKey) as ThemingControl;
</script>

<template>
  <el-dropdown>
    <span class="flex cursor-pointer flex-row items-center justify-center">
      <el-icon size="20px" v-if="isDark"> <Moon /> </el-icon>
      <el-icon size="20px" v-else> <Sunny /> </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="colorScheme === 'light'" @click="colorScheme = 'light'">{{
          $t(MessageKey.light)
        }}</el-dropdown-item>
        <el-dropdown-item :disabled="colorScheme === 'auto'" @click="colorScheme = 'auto'">{{
          $t(MessageKey.auto)
        }}</el-dropdown-item>
        <el-dropdown-item :disabled="colorScheme === 'dark'" @click="colorScheme = 'dark'">{{
          $t(MessageKey.dark)
        }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
