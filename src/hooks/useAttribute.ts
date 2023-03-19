import { useMemo } from 'react';
import { Result } from '../interfaces/Result';
import useAutoClear from './useAutoClear';

type AttributeHook = (props: {
  param: string;
  result: Result | null;
}) => [number | null, string];

export const useAttribute: AttributeHook = ({ param, result }) => {
  const [error, setError] = useAutoClear({});

  const attribute = useMemo(() => {
    // no result, no attribute
    if (result === null || result.attributes.length === 0) {
      return null;
    }
    // invalid number, default to 0
    const attribute = parseInt(param);
    if (!attribute) {
      return 0;
    }
    // number too large
    if (attribute >= result.attributes.length || attribute < 0) {
      setError('Invalid attribute param');
      return 0;
    }
    return attribute;
  }, [param, result, setError]);

  return [attribute, error];
};

export default useAttribute;
