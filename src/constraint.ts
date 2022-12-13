export type Constraint<T, K extends keyof T> = T[K] extends string ? T[K] : string;
export type AppendConstraint<T, K extends keyof T, S extends string> = { [KEY in (keyof T) | K]-?: KEY extends K ? (
  undefined extends T[K] ? S : (T[K] extends string ? T[K] | S : S)
  ) : T[KEY] };