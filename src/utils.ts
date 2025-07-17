import { ref } from 'vue';

export function delay(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), milliseconds);
  });
}

type LoaderOptions = {
  defaultStartDelay?: number;
  initialLoading?: boolean;
  skipDelayOnFirstRun?: boolean;
  onlyOnce?: boolean;
};

export function useLoader(options: LoaderOptions = {}) {
  const {
    defaultStartDelay = 0,
    initialLoading = false,
    skipDelayOnFirstRun = false,
    onlyOnce = false,
  } = options;

  const isLoading = ref(initialLoading);
  let delayHandle: ReturnType<typeof setTimeout> | null = null;
  let hasRun = false;

  const stopLoading = () => {
    isLoading.value = false;
    if (delayHandle !== null) {
      clearTimeout(delayHandle);
      delayHandle = null;
    }
  };

  const startLoading = () => {
    if (onlyOnce && hasRun) return;

    isLoading.value = true;
  };

  const run = async <R>(action: () => R | Promise<R>, startDelay?: number): Promise<R> => {
    const delay = !hasRun && skipDelayOnFirstRun ? 0 : (startDelay ?? defaultStartDelay ?? 0);

    if (delay > 0) {
      delayHandle = setTimeout(() => {
        startLoading();
      }, delay);
    } else {
      startLoading();
    }

    try {
      return await action();
    } finally {
      hasRun = true;
      stopLoading();
    }
  };

  return {
    isLoading,
    run,
  };
}
