import { useEffect, useState } from 'react';

import { Result, ResultObject } from '../interfaces/Result';

import useAutoClear from './useAutoClear';

type SelectedObjectHook = (props: {
  result: Result | null;
  param: string;
}) => [ResultObject | null, string];

export const useSelectedObject: SelectedObjectHook = ({ result, param }) => {
  const [error, setError] = useAutoClear({});

  const [object, setObject] = useState<ResultObject | null>(null);

  useEffect(() => {
    if (param) {
      if (result !== null) {
        const selected = result.results.find((object) => object.id === param);
        if (selected) {
          setError('');
          setObject(selected);
        } else {
          //setError('Could not find selected object: ' + param);
          setObject(null);
        }
      }
    } else {
      setObject(null);
    }
  }, [param, result, setError]);

  return [object, error];
};

export default useSelectedObject;
