import { AsyncLocalStorage } from 'async_hooks';

type Store = Record<string, any>;
const als = new AsyncLocalStorage<Store>();

export function startContext<T>(
  callback: () => T | Promise<T>,
  data: Store = {},
) {
  return als.run(data, callback);
}

export function getContext(): Store {
  const store = als.getStore();
  if (!store)
    throw new Error(
      'Context has not been started. Did you call startContext()?',
    );
  return store;
}

export function setItem(key: string, value: any): void {
  const store = als.getStore();
  if (!store)
    throw new Error(
      'Context has not been started. Did you call startContext()?',
    );
  store[key] = value;
}

export function readItem<T = any>(key: string, defaultValue?: T): T {
  const store = als.getStore();
  if (!store)
    throw new Error(
      'Context has not been started. Did you call startContext()?',
    );

  if (!(key in store)) {
    if (arguments.length >= 2) return defaultValue as T;
    throw new Error(`Missing context key "${key}"`);
  }
  return store[key] as T;
}
