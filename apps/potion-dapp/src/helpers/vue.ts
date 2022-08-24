import { unref } from "vue";
import type { Ref, ComputedRef } from "vue";

function deepUnref<T>(value: T | Ref<T> | ComputedRef<T>): T {
  const t = unref(value);
  return unref(t);
}

export { deepUnref };
