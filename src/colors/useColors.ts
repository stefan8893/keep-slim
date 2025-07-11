export function useColors() {
  const styles = getComputedStyle(document.documentElement);
  const weigthColor = styles.getPropertyValue('--color-teal-400');
  const muscleMassColor = styles.getPropertyValue('--color-violet-400');
  const bodyFatColor = styles.getPropertyValue('--color-yellow-400');
  const waterColor = styles.getPropertyValue('--color-sky-400');

  return {
    weigthColor,
    muscleMassColor,
    bodyFatColor,
    waterColor,
  };
}
