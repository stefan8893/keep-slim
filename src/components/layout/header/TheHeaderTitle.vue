<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps({
  homeLink: {
    type: String,
    default: '/home',
  },
  disabledLink: {
    type: Boolean,
    default: false,
  },
});

const isRootRoute = route.path === '/';

const disableLink = isRootRoute || props.disabledLink;
</script>

<template>
  <router-link
    :to="props.homeLink"
    :disabled="disableLink"
    :class="{ 'disabled-link': disableLink }"
  >
    <span class="text-2xl font-medium select-none md:text-3xl">Keep Slim</span>
  </router-link>
</template>

<style scoped>
.disabled-link {
  pointer-events: none;
  cursor: none;
}
</style>
