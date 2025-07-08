<script setup lang="ts">
import TheNavBar from '@/components/layout/TheNavBar.vue';
import TheHeaderUserMenu from '@/components/layout/header/TheHeaderUserMenu.vue';
import TheLayout from '@/layouts/TheLayout.vue';
</script>

<template>
  <TheLayout>
    <template #headerRight>
      <TheHeaderUserMenu />
    </template>
    <template #default>
      <div class="app-layout-container">
        <nav class="h-center bg-white shadow-md shadow-zinc-300">
          <div class="app-strip">
            <TheNavBar />
          </div>
        </nav>
        <main class="h-center">
          <div class="app-strip my-15">
            <slot>
              <RouterView />
            </slot>
          </div>
        </main>
      </div>
    </template>
  </TheLayout>
</template>

<style scoped>
.app-layout-container {
  height: 100%;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;

  grid-template-areas:
    'nav'
    'main';
}

nav {
  grid-area: nav;
}

main {
  grid-area: main;
}

.h-center {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
}

html.dark nav {
  box-shadow: none;
  background-color: transparent;
  border-color: var(--color-zinc-600);
  border-style: solid;
  border-bottom-width: 1px;
}
</style>
