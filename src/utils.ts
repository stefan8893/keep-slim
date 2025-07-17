import { isDate as isDateFn } from 'date-fns';
import { ref } from 'vue';

export function delay(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), milliseconds);
  });
}

export function isDate(candidate: unknown): candidate is Date {
  return isDateFn(candidate);
}

type LoaderOptions = {
  defaultStartDelay?: number;
  initialLoading?: boolean;
  skipDelayOnFirstRun?: boolean;
};

export function useLoader(options: LoaderOptions = {}) {
  const { defaultStartDelay = 0, initialLoading = false, skipDelayOnFirstRun = false } = options;

  const isLoading = ref(initialLoading);
  let delayHandle: ReturnType<typeof setTimeout> | null = null;
  let runningCount = 0;
  let hasRun = false;

  const clearDelay = () => {
    if (delayHandle !== null) {
      clearTimeout(delayHandle);
      delayHandle = null;
    }
  };

  const startLoading = () => {
    if (!isLoading.value) {
      isLoading.value = true;
    }
  };

  const stopLoading = () => {
    runningCount--;
    if (runningCount <= 0) {
      runningCount = 0;
      clearDelay();
      isLoading.value = false;
    }
  };

  const run = async <R>(action: () => R | Promise<R>, startDelay?: number): Promise<R> => {
    const delay = !hasRun && skipDelayOnFirstRun ? 0 : (startDelay ?? defaultStartDelay ?? 0);
    console.log('running action with delay: ', delay);

    runningCount++;

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
