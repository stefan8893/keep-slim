// Adding this declaration prevents false type errors during static type checking.
interface ArrayConstructor {
  fromAsync<T>(asyncIterable: AsyncIterable<T> | Iterable<T>): Promise<T[]>;
}
