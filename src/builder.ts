export type Builder<T, B> = T | ((builder: B) => ({ build(): T }));

export function build<T, B>(item: Builder<T, B>, create: () => B): T {
  if(typeof item === 'function') {
    return (item as ((builder: B) => ({ build(): T })))(create()).build();
  }
  return item;
}