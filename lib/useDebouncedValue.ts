import { useEffect, useState } from "react";

/**
 * Returns a debounced copy of `value` that only updates after `delay` ms of no
 * changes. Use it to drive expensive work (full-res canvas passes, toDataURL)
 * from a slider/text input so the input stays smooth while the heavy recompute
 * runs once the user pauses — instead of on every keystroke/drag tick.
 */
export function useDebouncedValue<T>(value: T, delay = 150): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
