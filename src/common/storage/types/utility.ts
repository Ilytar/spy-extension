export type MakeOptionalFields<T, K extends keyof T> = Partial<Omit<T, K>> & {
  [P in K]: T[P];
};
