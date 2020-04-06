import { DateTime, Duration } from 'luxon';

export function getterString<T extends { prefix: string }>(
  key: keyof T,
  store: T,
): string | undefined {
  if (store[key] == null) {
    store[key] = (localStorage.getItem(`${store.prefix}_${key}`) ??
      undefined) as any;
  }
  return store[key] as any;
}
export function getterBool<T extends { prefix: string }>(
  key: keyof T,
  store: T,
): boolean | undefined {
  if (store[key] == null) {
    const v = localStorage.getItem(`${store.prefix}_${key}`);
    if (v === 'true') store[key] = true as any;
    else if (v === 'false') store[key] = false as any;
    else store[key] = undefined as any;
  }
  return store[key] as any;
}
export function getterDateTime<T extends { prefix: string }>(
  key: keyof T,
  store: T,
): DateTime | undefined {
  if (store[key] == null) {
    const val = localStorage.getItem(`${store.prefix}_${key}`);
    if (val != null) {
      return DateTime.fromMillis(parseInt(val));
    } else {
      return undefined;
    }
  }
  return store[key] as any;
}
export function getterDuration<T extends { prefix: string }>(
  key: keyof T,
  store: T,
): Duration | undefined {
  if (store[key] == null) {
    const val = localStorage.getItem(`${store.prefix}_${key}`);
    if (val != null) {
      return Duration.fromMillis(parseInt(val));
    } else {
      return undefined;
    }
  }
  return store[key] as any;
}

export function setterString<T extends { prefix: string }>(
  key: keyof T,
  value: string | undefined,
  store: T,
): void {
  store[key] = value as any;
  if (value != null) {
    localStorage.setItem(`${store.prefix}_${key}`, value);
  } else {
    localStorage.removeItem(`${store.prefix}_${key}`);
  }
}
export function setterBool<T extends { prefix: string }>(
  key: keyof T,
  value: boolean | undefined,
  store: T,
): void {
  store[key] = value as any;
  if (value != null) {
    localStorage.setItem(`${store.prefix}_${key}`, value ? 'true' : 'false');
  } else {
    localStorage.removeItem(`${store.prefix}_${key}`);
  }
}
export function setterDateTime<T extends { prefix: string }>(
  key: keyof T,
  value: DateTime | undefined,
  store: T,
): void {
  store[key] = value as any;
  if (value != null) {
    localStorage.setItem(`${store.prefix}_${key}`, value.toMillis() + '');
  } else {
    localStorage.removeItem(`${store.prefix}_${key}`);
  }
}
export function setterDuration<T extends { prefix: string }>(
  key: keyof T,
  value: Duration | undefined,
  store: T,
): void {
  store[key] = value as any;
  if (value != null) {
    localStorage.setItem(`${store.prefix}_${key}`, value.valueOf() + '');
  } else {
    localStorage.removeItem(`${store.prefix}_${key}`);
  }
}
