import { useState, useRef, useCallback } from 'react';
import debounce from 'debounce';
import { ResultObject } from '../interfaces/Result';
import { Point } from '../interfaces/Point';

type HoverObjectHook = () => [
  ResultObject | null,
  (object: ResultObject | null) => void,
  React.MutableRefObject<Point>
];

export const useHoverObject: HoverObjectHook = () => {
  const [object, setObject] = useState<ResultObject | null>(null);

  // Store mouse position on result
  const mousePos = useRef<Point>({ x: 360, y: 230 });

  const debouncedSetObject = useRef(debounce(setObject, 100));

  const customSetObject = useCallback((object: ResultObject | null) => {
    debouncedSetObject.current.clear();
    if (object) {
      debouncedSetObject.current(object);
    } else {
      setObject(null);
    }
  }, []);

  return [object, customSetObject, mousePos];
};

export default useHoverObject;
