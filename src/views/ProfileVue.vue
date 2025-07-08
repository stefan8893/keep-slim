<script setup lang="ts">
import { getCurrentInstance } from 'vue';

const componentName = getCurrentInstance()?.type.__name;
</script>

<template>
  <p>{{ componentName }} works</p>
</template>
