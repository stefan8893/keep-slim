// This is a TypeScript declaration augmentation, not a runtime polyfill or shim.
// It informs the TypeScript compiler about `Array.fromAsync`, which is part of ES2024.
// Even though the `lib` option includes ES2024, some tooling (like `vue-tsc`) may not
// fully recognize the latest type definitions, especially in `.vue` files.
// Adding this declaration prevents false type errors during static type checking.
interface ArrayConstructor {
  fromAsync<T>(asyncIterable: AsyncIterable<T> | Iterable<T>): Promise<T[]>;
}
