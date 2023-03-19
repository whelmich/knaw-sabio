import { useState } from 'react';
import { ResultObject } from '../interfaces/Result';

type VisibleObjectsHook = () => [
  Array<ResultObject>,
  React.Dispatch<React.SetStateAction<ResultObject[]>>
];

export const useVisibleObjects: VisibleObjectsHook = () => {
  const [visibleObjects, setVisibleObjects] = useState<ResultObject[]>([]);

  return [visibleObjects, setVisibleObjects];
};

export default useVisibleObjects;
