<script setup lang="ts">
import { MessageKey } from '@/i18n/message-keys.g';
import { ref } from 'vue';

const visible = ref(false);
const hideTooltip = () => (visible.value = false);

defineExpose({
  hideTooltip,
});

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  closeTooltipInMs: {
    type: Number,
    default: 800,
  },
});

let timerHandle: null | number = null;
const copyText = async (event: MouseEvent) => {
  if (!props.text) return;
  if (timerHandle) clearTimeout(timerHandle);

  positionOnClick.value = DOMRect.fromRect({
    x: event.clientX,
    y: event.clientY,
  });

  await navigator.clipboard.writeText(props.text.trim());

  visible.value = true;
  timerHandle = setTimeout(() => (visible.value = false), props.closeTooltipInMs);
};

const positionOnClick = ref({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
} as DOMRect);

const triggerRef = ref({
  getBoundingClientRect: () => positionOnClick.value,
});
</script>

<template>
  <div class="text-copy">
    <el-tooltip
      :visible="visible"
      trigger="click"
      :content="$t(MessageKey.copied)"
      placement="top"
      virtual-triggering
      :hide-after="999999"
      :virtual-ref="triggerRef"
    />
    <span class="cursor-pointer" @click="copyText">
      <slot>{{ props.text }}</slot>
    </span>
  </div>
</template>
