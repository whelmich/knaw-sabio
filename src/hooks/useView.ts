import { useEffect, useState } from 'react';

import { VIEWS } from '../config/constants';

import useAutoClear from './useAutoClear';

type ViewHook = (props: { param: string }) => [string, string];

export const useView: ViewHook = ({ param }) => {
  const [error, setError] = useAutoClear({});

  const [view, setView] = useState('');

  useEffect(() => {
    if (VIEWS.includes(param)) {
      setView(param);
    } else {
      setView(VIEWS[0]);
      if (param) {
        setError('Unknown view: ' + param);
      }
    }
  }, [param, setError]);

  return [view, error];
};

export default useView;
