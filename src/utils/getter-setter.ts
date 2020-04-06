import { DateTime, Duration } from 'luxon';

export function getterString<T>(
  something: string,
  key: keyof T,
  store: T,
): string | undefined {
  if (store[key] == null) {
    store[key] = (localStorage.getItem(`${something}_${key}`) ??
      undefined) as any;
  }
  return store[key] as any;
}
export function getterBool<T>(
  something: string,
  key: keyof T,
  store: T,
): boolean | undefined {
  if (store[key] == null) {
    const v = localStorage.getItem(`${something}_${key}`);
    if (v === 'true') store[key] = true as any;
    else if (v === 'false') store[key] = false as any;
    else store[key] = undefined as any;
  }
  return store[key] as any;
}
export function getterDateTime<T>(
  something: string,
  key: keyof T,
  store: T,
): DateTime | undefined {
  if (store[key] == null) {
    const val = localStorage.getItem(`${something}_${key}`);
    if (val != null) {
      return DateTime.fromMillis(parseInt(val));
    } else {
      return undefined;
    }
  }
  return store[key] as any;
}
export function getterDuration<T>(
  something: string,
  key: keyof T,
  store: T,
): Duration | undefined {
  if (store[key] == null) {
    const val = localStorage.getItem(`${something}_${key}`);
    if (val != null) {
      return Duration.fromMillis(parseInt(val));
    } else {
      return undefined;
    }
  }
  return store[key] as any;
}

export function setterString<T>(
  something: string,
  key: keyof T,
  value: string | undefined,
  store: T,
): void {
  store[key] = value as any;
  if (value != null) {
    localStorage.setItem(`${something}_${key}`, value);
  } else {
    localStorage.removeItem(`${something}_${key}`);
  }
}
export function setterBool<T>(
  something: string,
  key: keyof T,
  value: boolean | undefined,
  store: T,
): void {
  store[key] = value as any;
  if (value != null) {
    localStorage.setItem(`${something}_${key}`, value ? 'true' : 'false');
  } else {
    localStorage.removeItem(`${something}_${key}`);
  }
}
export function setterDateTime<T>(
  something: string,
  key: keyof T,
  value: DateTime | undefined,
  store: T,
): void {
  store[key] = value as any;
  if (value != null) {
    localStorage.setItem(`${something}_${key}`, value.toMillis() + '');
  } else {
    localStorage.removeItem(`${something}_${key}`);
  }
}
export function setterDuration<T>(
  something: string,
  key: keyof T,
  value: Duration | undefined,
  store: T,
): void {
  store[key] = value as any;
  if (value != null) {
    localStorage.setItem(`${something}_${key}`, value.valueOf() + '');
  } else {
    localStorage.removeItem(`${something}_${key}`);
  }
}
