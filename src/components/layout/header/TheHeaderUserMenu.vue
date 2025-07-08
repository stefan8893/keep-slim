<script setup lang="ts">
import '@/auth/useAuth';
import { useAuth } from '@/auth/useAuth';
import TextCopy from '@/components/infrastructure/TextCopy.vue';
import TheHeaderUserMenuSettings from '@/components/layout/header/TheHeaderUserMenuSettings.vue';
import TheHeaderUserMenuUserIcon from '@/components/layout/header/TheHeaderUserMenuUserIcon.vue';
import { MessageKey } from '@/i18n/message-keys.g';
import { useTemplateRef } from 'vue';

const { logout, getName, getEmail, getInitials } = useAuth();

const name = getName();
const email = getEmail();
const initials = getInitials();

const nameText = useTemplateRef('nameText');
const emailText = useTemplateRef('emailText');

const beforeCloseUserMenu = () => {
  nameText.value?.hideTooltip();
  emailText.value?.hideTooltip();
};
</script>

<template>
  <el-popover
    popper-class="header-user-menu"
    width="auto"
    trigger="click"
    placement="bottom-end"
    :hide-after="0"
    :show-after="0"
    :persistent="false"
    @before-leave="beforeCloseUserMenu"
  >
    <template #reference>
      <TheHeaderUserMenuUserIcon :initials="initials" class="cursor-pointer" />
    </template>

    <div class="mx-6 mt-6 flex max-w-xs flex-row flex-nowrap items-center justify-center">
      <div class="user-icon my-auto">
        <TheHeaderUserMenuUserIcon icon-size="large" :initials="initials" />
      </div>
      <div class="ml-5 select-none">
        <TextCopy class="text-lg font-medium break-normal" :text="name" ref="nameText" />
        <TextCopy class="mt-0.5 max-w-[268px] truncate" :text="email" ref="emailText" />
      </div>
    </div>
    <el-divider />
    <TheHeaderUserMenuSettings />
    <el-divider />
    <div class="mx-6 mb-6 flex flex-row flex-nowrap justify-end">
      <el-button @click="logout" link>{{ $t(MessageKey.logout) }}</el-button>
    </div>
  </el-popover>
</template>

<style>
.header-user-menu {
  --el-popover-padding: 0px;
}
</style>
