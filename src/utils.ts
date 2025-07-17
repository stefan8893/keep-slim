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

export type LoaderOptions = {
  defaultStartDelay?: number;
  initialLoading?: boolean;
  skipDelayOnFirstRun?: boolean;
};

export function useLoader(options: LoaderOptions = {}) {
  const { defaultStartDelay = 0, initialLoading = false, skipDelayOnFirstRun = false } = options;

  const isLoading = ref(initialLoading);
  let runningCount = 0;
  let hasRun = false;

  const delayHandles = new Set<ReturnType<typeof setTimeout>>();

  const clearDelays = () => {
    for (const handle of delayHandles) {
      clearTimeout(handle);
    }
    delayHandles.clear();
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
      clearDelays();
      isLoading.value = false;
    }
  };

  const run = async <R>(action: () => R | Promise<R>, startDelay?: number): Promise<R> => {
    const delay = !hasRun && skipDelayOnFirstRun ? 0 : (startDelay ?? defaultStartDelay ?? 0);
    hasRun = true;
    runningCount++;

    if (delay > 0) {
      const handle = setTimeout(() => {
        delayHandles.delete(handle);
        startLoading();
      }, delay);
      delayHandles.add(handle);
    } else {
      startLoading();
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
