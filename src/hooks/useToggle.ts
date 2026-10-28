import { useCallback, useState } from 'react';

export interface ToggleResult {
  value: boolean;
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
}

/** Manage a boolean with stable actions. The initial value is used on mount. */
export function useToggle(initialValue = false): ToggleResult {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((current) => !current), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  return { value, toggle, setTrue, setFalse };
}
