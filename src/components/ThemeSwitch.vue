<script setup lang="ts">
import { themingControlKey } from '@/injection.types';
import type { ThemingControl } from '@/plugins/theming.plugin';
import { Moon, Sunny } from '@element-plus/icons-vue';
import { inject } from 'vue';

const { colorScheme } = inject(themingControlKey) as ThemingControl;
</script>

<template>
  <el-radio-group v-model="colorScheme" size="small">
    <el-radio-button
      label="Light"
      value="light"
      class="header-user-settings-color-scheme-option-icon"
    >
      <el-icon size="20px"> <Sunny /> </el-icon>
    </el-radio-button>

    <el-radio-button label="Auto" value="auto" />

    <el-radio-button
      lable="Light"
      value="dark"
      class="header-user-settings-color-scheme-option-icon"
    >
      <el-icon size="20px"> <Moon /> </el-icon>
    </el-radio-button>
  </el-radio-group>
</template>

<style>
.header-user-settings-color-scheme-option-icon .el-radio-button__inner {
  padding: 0 11px 0 11px;
}
</style>
