import { useCallback, useState, useRef } from 'react';

type AutoClearHook = (props: {
  defaultValue?: string;
  timeout?: number;
}) => [string, (value: string) => void];

export const useAutoClear: AutoClearHook = ({
  defaultValue = '',
  timeout = 5000,
}) => {
  const [value, setValue] = useState(defaultValue);
  const timeoutId = useRef(0);

  const updateValue = useCallback(
    (value: string) => {
      setValue(value);
      window.clearTimeout(timeoutId.current);

      // Empty value after timeout
      if (value) {
        timeoutId.current = window.setTimeout(() => {
          setValue('');
        }, timeout);
      }
    },
    [timeout]
  );

  return [value, updateValue];
};

export default useAutoClear;
