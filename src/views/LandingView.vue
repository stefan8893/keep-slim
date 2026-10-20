<script setup lang="ts">
import { useAuth } from '@/auth/useAuth';
import ThemeDropdown from '@/components/ThemeDropdown.vue';
import { MessageKey } from '@/i18n/message-keys.g';
import TheLayout from '@/layouts/TheLayout.vue';
import { DataAnalysis, TrendCharts, Upload } from '@element-plus/icons-vue';

const { login } = useAuth();
</script>

<template>
  <TheLayout>
    <template #headerRight>
      <ThemeDropdown class="light-color ml-5 sm:ml-10" />
      <el-button type="primary" @click="login" class="ml-5 sm:ml-10">{{
        $t(MessageKey.login)
      }}</el-button>
    </template>
    <template #default>
      <div
        class="min-h-full bg-linear-to-b from-white to-zinc-100 px-6 py-12 text-zinc-900 dark:from-zinc-900 dark:to-zinc-950 dark:text-zinc-100 sm:px-10 sm:py-16"
      >
        <main class="mx-auto max-w-6xl">
          <section class="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <p
                class="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
              >
                <span class="size-2 rounded-full bg-emerald-500"></span>
                {{ $t(MessageKey.landingEyebrow) }}
              </p>
              <h1 class="text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {{ $t(MessageKey.landingTitle) }}
              </h1>
              <p class="mt-6 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                {{ $t(MessageKey.landingDescription) }}
              </p>
              <el-button type="primary" size="large" class="mt-8" @click="login">
                {{ $t(MessageKey.landingCta) }}
              </el-button>
            </div>

            <div
              aria-hidden="true"
              class="relative mx-auto w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-900/5 dark:border-zinc-700 dark:bg-zinc-800 dark:shadow-black/20 sm:p-8"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    {{ $t(MessageKey.landingPreviewLabel) }}
                  </p>
                  <p class="mt-1 text-xl font-semibold">
                    {{ $t(MessageKey.weight) }}
                  </p>
                </div>
                <div class="rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  <el-icon size="24"><TrendCharts /></el-icon>
                </div>
              </div>
              <div class="mt-8 h-40">
                <svg viewBox="0 0 400 150" class="h-full w-full" fill="none">
                  <path
                    d="M1 30H399M1 75H399M1 120H399"
                    class="stroke-zinc-100 dark:stroke-zinc-700"
                    stroke-width="2"
                  />
                  <path
                    d="M5 38C45 45 58 71 95 66S150 42 185 58 240 102 275 85 332 45 395 22"
                    class="stroke-emerald-500"
                    stroke-width="4"
                    stroke-linecap="round"
                  />
                  <circle cx="395" cy="22" r="6" class="fill-emerald-500" />
                </svg>
              </div>
              <div class="mt-5 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <el-icon class="text-emerald-600 dark:text-emerald-400"><DataAnalysis /></el-icon>
                {{ $t(MessageKey.landingPreviewCaption) }}
              </div>
            </div>
          </section>

          <section class="mt-16 grid gap-4 sm:grid-cols-3 md:mt-24">
            <article
              v-for="feature in [
                {
                  icon: DataAnalysis,
                  title: MessageKey.landingFeatureMetricsTitle,
                  description: MessageKey.landingFeatureMetricsDescription,
                },
                {
                  icon: TrendCharts,
                  title: MessageKey.landingFeatureTrendsTitle,
                  description: MessageKey.landingFeatureTrendsDescription,
                },
                {
                  icon: Upload,
                  title: MessageKey.landingFeatureImportTitle,
                  description: MessageKey.landingFeatureImportDescription,
                },
              ]"
              :key="feature.title"
              class="rounded-2xl border border-zinc-200 bg-white/80 p-6 dark:border-zinc-700 dark:bg-zinc-800/80"
            >
              <div
                class="mb-4 inline-flex rounded-xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
              >
                <el-icon size="22"><component :is="feature.icon" /></el-icon>
              </div>
              <h2 class="text-lg font-semibold">{{ $t(feature.title) }}</h2>
              <p class="mt-2 leading-6 text-zinc-600 dark:text-zinc-300">
                {{ $t(feature.description) }}
              </p>
            </article>
          </section>
        </main>
      </div>
    </template>
  </TheLayout>
</template>

<style scoped>
.light-color {
  color: var(--el-text-color-regular-dark);
}
</style>
