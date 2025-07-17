import { ref } from 'vue';

export function delay(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), milliseconds);
  });
}

type LoaderOptions = {
  defaultStartDelay?: number;
  initialLoading?: boolean;
};

export function useLoader(options: LoaderOptions = {}) {
  const { defaultStartDelay = 0, initialLoading = false } = options;

  const isLoading = ref(initialLoading);
  let delayHandle: ReturnType<typeof setTimeout> | null = null;

  const stopLoading = () => {
    isLoading.value = false;
    if (delayHandle !== null) {
      clearTimeout(delayHandle);
      delayHandle = null;
    }
  };

  const run = async <R>(action: () => R | Promise<R>, startDelay?: number): Promise<R> => {
    const delay = startDelay ?? defaultStartDelay;

    if (delay > 0) {
      delayHandle = setTimeout(() => {
        isLoading.value = true;
      }, delay);
    } else {
      isLoading.value = true;
    }

    try {
      return await action();
    } finally {
      stopLoading();
    }
  };

  return {
    isLoading,
    run,
  };
}
