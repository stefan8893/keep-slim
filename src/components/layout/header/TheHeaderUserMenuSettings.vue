<script setup lang="ts">
import LanguageSwitch from '@/components/LanguageSwitch.vue';
import LocaleSwitch from '@/components/LocaleSwitch.vue';
import ThemeSwitch from '@/components/ThemeSwitch.vue';
import { MessageKey } from '@/i18n/message-keys.g';
</script>

<template>
  <div class="mx-6">
    <div class="header-user-settings-menu-item">
      <span class="header-user-settings-menu-item-title">{{ $t(MessageKey.appearance) }}:</span>
      <div class="ml-10">
        <ThemeSwitch />
      </div>
    </div>
    <div class="header-user-settings-menu-item">
      <span class="header-user-settings-menu-item-title">{{ $t(MessageKey.language) }}:</span>
      <div>
        <LanguageSwitch />
      </div>
    </div>
    <div class="header-user-settings-menu-item">
      <span class="header-user-settings-menu-item-title">{{ $t(MessageKey.locale) }}:</span>
      <div>
        <LocaleSwitch />
      </div>
    </div>
  </div>
</template>

<style>
.user-menu-settings-icon {
  width: 36px;
}

.header-user-settings-menu-item {
  height: 56px;
  line-height: 56px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
}

.header-user-settings-menu-item-title {
  color: var(--el-text-color-primary);
}
</style>
